import { ref } from 'vue'
import type { Ref } from 'vue'
import { db, ensureDbReady, isIndexedDBAvailable, type LocalSavedAmalan, type LocalFolder } from '@/utils/localDb'
import { toPlainLyrics, toSavedAmalanPayload } from '@/utils/lyric'
import { useToast } from '@/composables/useToast'

export function useOfflineAmalan(amalan: Ref<any | null>, slug: Ref<string>) {
  const isSaved = ref(false)
  const localData = ref<LocalSavedAmalan | null>(null)
  const hasUpdate = ref(false)
  const hasUpdateAvailable = hasUpdate
  const allFolders = ref<LocalFolder[]>([])
  const isSaving = ref(false)
  const isSavingToFolder = ref(false)

  const toast = useToast()

  async function withDbReady<T>(fn: () => Promise<T>): Promise<T | null> {
    if (!isIndexedDBAvailable()) {
      console.warn('[offline] IndexedDB not available')
      return null
    }
    try {
      await ensureDbReady()
    } catch (e) {
      console.error('[offline] ensureDbReady failed', e)
    }
    try {
      return await fn()
    } catch (err: any) {
      console.error('[offline] DB operation failed', err)
      return null
    }
  }

  async function findRootById(id: string): Promise<LocalSavedAmalan | undefined> {
    if (!id) return undefined
    try {
      const found = await db.saved_amalan.where('[amalan_id+folder_id]').equals([id, 0]).first()
      if (found) return found
    } catch (e) {
      console.error('[offline] where compound [amalan_id+folder_id] failed', e)
    }
    try {
      return await db.saved_amalan.where('amalan_id').equals(id).first()
    } catch (e) {
      console.error('[offline] where amalan_id fallback failed', e)
      return undefined
    }
  }

  async function findBySlug(slugVal: string): Promise<LocalSavedAmalan | undefined> {
    if (!slugVal) return undefined
    try {
      return await db.saved_amalan.where('slug').equals(slugVal).first()
    } catch (e) {
      console.error('[offline] where slug failed', e)
      return undefined
    }
  }

  async function findRootBySlug(slugVal: string): Promise<LocalSavedAmalan | undefined> {
    return findBySlug(slugVal)
  }

  async function loadFolders(): Promise<void> {
    const result = await withDbReady(() => db.folders.toArray())
    if (result) allFolders.value = result
    else if (!isIndexedDBAvailable()) return
    // if withDbReady returned null due to error, keep previous value and log
    if (result === null && isIndexedDBAvailable()) {
      console.error('[offline] loadFolders failed')
    }
  }

  async function checkStatus(): Promise<void> {
    if (!isIndexedDBAvailable()) {
      console.warn('[offline] IndexedDB not available (private mode / insecure context)')
      return
    }
    try {
      await ensureDbReady()
    } catch (e) {
      console.error('[offline] ensureDbReady failed', e)
    }

    let local: LocalSavedAmalan | undefined

    const rawId = (amalan.value as any)?.id ?? (localData.value as any)?.amalan_id ?? null
    const id = rawId != null ? String(rawId) : null

    // Try by id compound, then fallback amalan_id
    if (id) {
      try {
        local = await db.saved_amalan.where('[amalan_id+folder_id]').equals([id, 0]).first()
      } catch (e) {
        console.error('[offline] where compound [amalan_id+folder_id] failed', e)
      }
      if (!local) {
        try {
          local = await db.saved_amalan.where('amalan_id').equals(id).first()
        } catch (e) {
          console.error('[offline] where amalan_id fallback failed', e)
        }
      }
    }

    // Fallback by slug — critical for offline first load (amalan.value is null)
    if (!local && slug.value) {
      try {
        local = await db.saved_amalan.where('slug').equals(slug.value).first()
      } catch (e) {
        console.error('[offline] where slug failed', e)
      }
    }

    if (local) {
      isSaved.value = true
      localData.value = local
      const serverVer = (amalan.value as any)?.content_version ?? local.content_version ?? 1
      hasUpdate.value = (local.content_version ?? 1) < (serverVer ?? 1)
      return
    }

    isSaved.value = false
    localData.value = null
    hasUpdate.value = false
  }

  async function toggleRoot(opts?: { amalan?: any; lyrics?: any[] }): Promise<boolean> {
    if (isSaving.value) return false

    const src = opts?.amalan ?? (amalan.value as any) ?? (localData.value ? {
      id: (localData.value as any).amalan_id,
      judul: (localData.value as any).judul,
      slug: (localData.value as any).slug,
      ringkasan: (localData.value as any).ringkasan,
      content_version: (localData.value as any).content_version,
      updated_at: (localData.value as any).server_updated_at,
    } : null)

    // lyrics resolution: prefer explicit opts.lyrics, then amalan.value?.lyrics, then localData fallback parsed
    let lyricsToSave: any[] | undefined = opts?.lyrics
    if (!lyricsToSave) {
      const online = (amalan.value as any)?.lyrics
      if (online && Array.isArray(online) && online.length > 0) lyricsToSave = online
      else if (localData.value?.lyrics && Array.isArray(localData.value.lyrics) && localData.value.lyrics.length > 0) lyricsToSave = localData.value.lyrics
      else if (localData.value?.content) {
        try {
          const parsed = JSON.parse(localData.value.content)
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.arab) lyricsToSave = parsed
        } catch {}
      }
    }

    if (!src || !lyricsToSave || !lyricsToSave.length) {
      toast.error('Konten belum siap untuk disimpan offline.')
      return false
    }

    if (!isIndexedDBAvailable()) {
      toast.error('Penyimpanan offline tidak tersedia di browser ini. Coba gunakan Chrome terbaru dan pastikan bukan mode private.')
      return false
    }

    isSaving.value = true
    try {
      try {
        await ensureDbReady()
      } catch (e) {
        console.error('[offline] ensureDbReady in toggle failed', e)
      }

      if (isSaved.value) {
        const amalanIdStr = String(src.id ?? (src as any).amalan_id ?? (localData.value as any)?.amalan_id ?? '')
        if (amalanIdStr) {
          try {
            await db.saved_amalan.where('[amalan_id+folder_id]').equals([amalanIdStr, 0]).delete()
          } catch (e) {
            console.error('[offline] delete compound failed, fallback to amalan_id+folder 0', e)
            const candidates = await db.saved_amalan.where('amalan_id').equals(amalanIdStr).toArray().catch(() => [] as LocalSavedAmalan[])
            for (const c of candidates) {
              if ((c.folder_id ?? 0) === 0 && c.id != null) await db.saved_amalan.delete(c.id)
            }
          }
          if (amalanIdStr === '' && src.slug) {
            await db.saved_amalan.where('slug').equals(String(src.slug)).delete().catch(() => {})
          }
          const stillExists = await db.saved_amalan.where('[amalan_id+folder_id]').equals([amalanIdStr, 0]).first().catch(() => null)
          if (stillExists && (stillExists as any).id != null) {
            try {
              await db.saved_amalan.delete((stillExists as any).id)
            } catch {}
          }
        } else if (src.slug) {
          await db.saved_amalan.where('slug').equals(String(src.slug)).delete().catch(() => {})
        }

        isSaved.value = false
        localData.value = null
        hasUpdate.value = false
        toast.success('Dihapus dari koleksi offline.')
        return true
      }

      // not saved -> add root copy, check duplicate first
      let existing: LocalSavedAmalan | undefined
      try {
        const checkId = String(src.id ?? (src as any).amalan_id ?? '')
        if (checkId) {
          existing = await db.saved_amalan.where('[amalan_id+folder_id]').equals([checkId, 0]).first()
        }
        if (!existing && src.slug) existing = await db.saved_amalan.where('slug').equals(String(src.slug)).first()
      } catch {}

      if (existing) {
        isSaved.value = true
        localData.value = existing
        toast.success('Sudah tersimpan offline.')
        return true
      }

      const plainLyrics: LocalSavedAmalan['lyrics'] = toPlainLyrics(lyricsToSave as any)
      const plainPayload: LocalSavedAmalan = toSavedAmalanPayload(src, plainLyrics, 0) as LocalSavedAmalan
      await db.saved_amalan.add(plainPayload)
      isSaved.value = true
      toast.success('Berhasil disimpan offline.')
      await checkStatus()
      return true
    } catch (err: any) {
      console.error('[offline] toggleRoot failed', err)
      const name = err?.name || ''
      const msg = err?.message || ''
      if (/VersionError|SchemaError|UpgradeError/i.test(name + ' ' + msg)) {
        try {
          toast.warning('Memperbaiki penyimpanan offline, coba lagi…')
          db.close()
          await db.delete()
          await db.open()
          toast.error('Penyimpanan telah diperbaiki — ketuk Simpan offline lagi.')
        } catch (e2) {
          console.error('[offline] recovery failed', e2)
          toast.error('Gagal memperbaiki penyimpanan offline. Coba hapus data situs di pengaturan browser.')
        }
        return false
      }
      if (/QuotaExceeded|Storage/i.test(name + ' ' + msg)) {
        toast.error('Penyimpanan penuh — hapus beberapa amalan offline atau bersihkan cache browser.')
        return false
      }
      if (/SecurityError|NotAllowedError/i.test(name)) {
        toast.error('Browser memblokir penyimpanan offline (mode private atau izin ditolak).')
        return false
      }
      toast.error(msg || 'Gagal menyimpan offline.')
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function saveToFolder(folderId: number, opts?: { amalan?: any; lyrics?: any[] }): Promise<boolean> {
    if (isSavingToFolder.value) return false
    const src = opts?.amalan ?? (amalan.value as any) ?? (localData.value ? {
      id: (localData.value as any).amalan_id,
      judul: (localData.value as any).judul,
      slug: (localData.value as any).slug,
      ringkasan: (localData.value as any).ringkasan,
      content_version: (localData.value as any).content_version,
      updated_at: (localData.value as any).server_updated_at,
    } : null)

    let lyricsToSave: any[] | undefined = opts?.lyrics
    if (!lyricsToSave) {
      const online = (amalan.value as any)?.lyrics
      if (online && Array.isArray(online) && online.length > 0) lyricsToSave = online
      else if (localData.value?.lyrics && Array.isArray(localData.value.lyrics) && localData.value.lyrics.length > 0) lyricsToSave = localData.value.lyrics
      else if (localData.value?.content) {
        try {
          const parsed = JSON.parse(localData.value.content)
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.arab) lyricsToSave = parsed
        } catch {}
      }
    }

    if (!src || !lyricsToSave || !lyricsToSave.length) {
      toast.error('Konten belum siap untuk disimpan offline.')
      return false
    }
    if (!isIndexedDBAvailable()) {
      toast.error('Penyimpanan offline tidak tersedia di browser ini.')
      return false
    }
    if (folderId == null) {
      toast.error('Pilih folder tujuan terlebih dahulu.')
      return false
    }

    const idStr = String(src.id ?? (src as any).amalan_id ?? (localData.value as any)?.amalan_id ?? '')
    if (!idStr) {
      toast.error('Data amalan tidak valid.')
      return false
    }

    isSavingToFolder.value = true
    try {
      await ensureDbReady()

      let exists: LocalSavedAmalan | undefined
      try {
        exists = await db.saved_amalan.where('[amalan_id+folder_id]').equals([idStr, folderId]).first()
      } catch (e) {
        console.error('[offline] duplicate check compound failed', e)
        const candidates = await db.saved_amalan.where('amalan_id').equals(idStr).toArray().catch(() => [] as LocalSavedAmalan[])
        exists = candidates.find((c) => (c.folder_id ?? 0) === folderId)
      }
      if (exists) {
        toast.error('Sudah ada di folder tersebut')
        return false
      }

      const plainLyrics: LocalSavedAmalan['lyrics'] = toPlainLyrics(lyricsToSave as any)
      const plainPayload: LocalSavedAmalan = toSavedAmalanPayload(
        { ...src, id: idStr, slug: String(src.slug ?? slug.value ?? '') },
        plainLyrics,
        folderId,
      ) as LocalSavedAmalan
      await db.saved_amalan.add(plainPayload)
      toast.success(folderId === 0 ? 'Berhasil disimpan di Koleksi Utama.' : 'Berhasil disimpan ke folder.')
      return true
    } catch (err: any) {
      console.error('[offline] saveToFolder failed', err)
      const msg = err?.message || ''
      if (/ConstraintError|already exists|unique/i.test(msg)) {
        toast.error('Sudah ada di folder tersebut')
      } else {
        toast.error(msg || 'Gagal menyimpan ke folder.')
      }
      return false
    } finally {
      isSavingToFolder.value = false
    }
  }

  async function updateAllCopies(lyrics: any[], amalanOverride?: any): Promise<boolean> {
    if (isSaving.value) return false
    const src = amalanOverride ?? (amalan.value as any)
    const lyricsToSave = lyrics

    if (!src || !lyricsToSave || !lyricsToSave.length) {
      toast.error('Konten belum siap untuk diperbarui.')
      return false
    }
    if (!isIndexedDBAvailable()) {
      toast.error('Penyimpanan offline tidak tersedia.')
      return false
    }

    isSaving.value = true
    try {
      try {
        await ensureDbReady()
      } catch {}

      const plainLyricsUpd: LocalSavedAmalan['lyrics'] = toPlainLyrics(lyricsToSave as any)
      const plainModify = {
        content: JSON.stringify(plainLyricsUpd),
        lyrics: plainLyricsUpd,
        content_version: Number(src.content_version ?? 1),
        server_updated_at: String(src.updated_at ?? (src as any).updatedAt ?? new Date().toISOString()),
        last_synced_at: Date.now(),
        has_update_available: false,
      }

      let updated = 0
      try {
        updated = await db.saved_amalan.where('amalan_id').equals(String(src.id)).modify(plainModify)
      } catch (e) {
        console.error('[offline] updateAllCopies modify by amalan_id failed', e)
      }
      if (!updated && src.slug) {
        try {
          await db.saved_amalan.where('slug').equals(String(src.slug)).modify(plainModify)
        } catch (e) {
          console.error('[offline] updateAllCopies modify by slug failed', e)
        }
      }

      hasUpdate.value = false
      await checkStatus()
      toast.success('Konten offline diperbarui.')
      return true
    } catch (err: any) {
      console.error('[offline] updateAllCopies failed', err)
      toast.error(err?.message || 'Gagal memperbarui offline.')
      return false
    } finally {
      isSaving.value = false
    }
  }

  return {
    isSaved,
    localData,
    hasUpdate,
    hasUpdateAvailable,
    allFolders,
    isSaving,
    isSavingToFolder,
    loadFolders,
    checkStatus,
    toggleRoot,
    saveToFolder,
    updateAllCopies,
    // alias for legacy naming
    checkOfflineStatus: checkStatus,
    // helpers exposed for testing
    findRootById,
    findRootBySlug,
  }
}
