import { computed, ref, watch, type Ref } from 'vue'
import { db, ensureDbReady, isIndexedDBAvailable, type AmalanProgress } from '@/utils/localDb'

/**
 * Hafalan/reading progress checklist for one amalan, persisted in Dexie
 * (table `amalan_progress`, keyed by amalan_id; slug fallback for offline first load).
 *
 * If the stored `content_version` differs from the amalan's current one,
 * the checklist is reset automatically (content changed → old indices invalid).
 */
export function useAmalanProgress(
  amalanId: Ref<string | null | undefined>,
  slug: Ref<string>,
  contentVersion: Ref<number | null | undefined>,
  totalLines?: Ref<number>,
) {
  const checked = ref<Set<number>>(new Set())
  const loaded = ref(false)

  // invalidate in-flight loads when a save lands (avoids stale overwrite of `checked`)
  let loadSeq = 0
  let recordKey: string | null = null
  let recordVersion: number | null = null

  function currentVersion(): number | null {
    const v = contentVersion.value
    return v != null && Number.isFinite(Number(v)) ? Number(v) : null
  }

  async function clearRecord(): Promise<void> {
    if (!recordKey) return
    try {
      await ensureDbReady()
      await db.amalan_progress.delete(recordKey)
    } catch (e) {
      console.error('[progress] delete failed', e)
    }
  }

  async function load(): Promise<void> {
    if (!isIndexedDBAvailable()) {
      checked.value = new Set()
      return
    }
    try {
      await ensureDbReady()
    } catch (e) {
      console.error('[progress] ensureDbReady failed', e)
    }

    const seq = ++loadSeq
    const id = amalanId.value ? String(amalanId.value) : null

    let record: AmalanProgress | undefined
    if (id) {
      try {
        record = await db.amalan_progress.get(id)
      } catch (e) {
        console.error('[progress] get by amalan_id failed', e)
      }
    }
    if (!record && slug.value) {
      try {
        record = await db.amalan_progress.where('slug').equals(slug.value).first()
      } catch (e) {
        console.error('[progress] get by slug failed', e)
      }
    }

    if (seq !== loadSeq) return // a save landed meanwhile — discard stale read

    if (record) {
      // migrate slug-keyed record to the real amalan_id once it becomes known
      if (id && record.amalan_id !== id) {
        try {
          await db.amalan_progress.put({ ...record, amalan_id: id, slug: slug.value, updated_at: Date.now() })
          await db.amalan_progress.delete(record.amalan_id)
        } catch (e) {
          console.error('[progress] migrate record failed', e)
        }
        record = { ...record, amalan_id: id }
      }
      recordKey = record.amalan_id
      recordVersion = record.content_version
      const current = currentVersion()
      if (current != null && record.content_version !== current) {
        // content version changed — previous checklist no longer valid
        checked.value = new Set()
        await clearRecord()
        recordVersion = current
      } else {
        checked.value = new Set(record.checked_indices ?? [])
      }
    } else {
      recordKey = id ?? slug.value ?? null
      recordVersion = null
      checked.value = new Set()
    }
    loaded.value = true
  }

  async function save(set: Set<number>): Promise<void> {
    const key = amalanId.value ? String(amalanId.value) : slug.value
    if (!key) return
    loadSeq++ // invalidate any in-flight load so it cannot overwrite this state
    try {
      await ensureDbReady()
      const payload: AmalanProgress = {
        amalan_id: key,
        slug: slug.value,
        content_version: currentVersion() ?? recordVersion ?? 1,
        checked_indices: Array.from(set).sort((a, b) => a - b),
        updated_at: Date.now(),
      }
      await db.amalan_progress.put(payload)
      recordKey = key
      recordVersion = payload.content_version
    } catch (e) {
      console.error('[progress] save failed', e)
    }
  }

  async function toggle(i: number): Promise<void> {
    const next = new Set(checked.value)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    checked.value = next
    await save(next)
  }

  async function reset(): Promise<void> {
    checked.value = new Set()
    await clearRecord()
    recordVersion = null
  }

  const progressText = computed(() => {
    const done = totalLines ? Math.min(checked.value.size, totalLines.value) : checked.value.size
    return totalLines ? `${done}/${totalLines.value} baris selesai` : `${done} baris selesai`
  })

  watch([amalanId, slug], () => {
    load()
  })

  // version bump without id change (e.g. offline update) → auto-clear stale checklist
  watch(contentVersion, () => {
    if (!loaded.value || !recordKey) return
    const current = currentVersion()
    if (current != null && recordVersion != null && recordVersion !== current) {
      checked.value = new Set()
      clearRecord()
      recordVersion = current
    }
  })

  load()

  return { checked, loaded, progressText, toggle, reset }
}