<template>
  <div class="min-h-screen bg-white py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand mb-4"></div>
        <p class="text-body-md text-muted">Memuat koleksi yang dibagikan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error || !bundle" class="text-center py-20">
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle class="w-10 h-10" />
        </div>
        <h1 class="text-heading-lg text-brand mb-2">Koleksi Tidak Ditemukan</h1>
        <p class="text-body-md text-muted mb-8">Maaf, link share ini mungkin sudah tidak valid atau sudah kedaluwarsa.</p>
        <router-link :to="{ name: 'amalan-list' }" class="btn-primary">Kembali ke Beranda</router-link>
      </div>

      <!-- Bundle Content -->
      <div v-else>
        <div class="bg-gradient-to-r from-primary-50 to-white p-8 rounded-2xl border border-green-100 mb-12">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span class="inline-block px-3 py-1 bg-brand text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Koleksi Dibagikan</span>
              <span v-if="bundle.is_local || bundle._local" class="inline-block ml-2 px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Lokal — hanya di perangkat ini</span>
              <h1 class="text-heading-xl text-brand mb-3">{{ bundle.title }}</h1>
              <p v-if="bundle.description" class="text-body-md text-muted">{{ bundle.description }}</p>
            </div>
            <button 
              @click="importBundle" 
              class="btn-primary flex items-center gap-2 px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              :disabled="importing"
            >
              <Download class="w-6 h-6" />
              <span>{{ importLabel }}</span>
            </button>
          </div>
          <div class="mt-6 flex items-center gap-6 text-body-sm text-muted">
            <div class="flex items-center gap-2">
              <BookOpen class="w-4 h-4 text-brand" />
              <span>{{ bundle.share_bundle_items.length }} Amalan</span>
            </div>
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4 text-brand" />
              <span>Dibuat {{ new Date(bundle.created_at).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <h2 class="text-heading-md text-brand mb-6">Isi Koleksi</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="item in bundle.share_bundle_items" 
            :key="item.id"
            class="p-6 rounded-xl border border-gray-100 bg-white hover:border-brand transition-colors"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-lg bg-green-50 text-green-600">
                <FileText class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-heading-sm text-brand mb-1">{{ item.amalan.judul }}</h3>
                <p class="text-body-sm text-muted line-clamp-2 mb-3">{{ item.amalan.ringkasan }}</p>
                <div v-if="item.folder_path" class="flex items-center gap-1.5 text-xs text-brand/70 bg-brand/5 px-2 py-1 rounded-md w-fit">
                  <Folder class="w-3 h-3" />
                  <span>Folder: {{ item.folder_path }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getShareBundle, getLocalBundle } from '@/services/shareService'
import { downloadMarkdown, getById } from '@/services/amalanService'
import { db, type LocalFolder, ensureDbReady, isIndexedDBAvailable } from '@/utils/localDb'
import { 
  Download, BookOpen, Calendar, FileText, Folder, AlertCircle 
} from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const error = ref(false)
const bundle = ref<any>(null)
const importing = ref(false)
const importedCount = ref(0)
const importTotal = ref(0)

const importLabel = computed(() =>
  importing.value ? `Mengimpor... (${importedCount.value}/${importTotal.value})` : 'Impor Koleksi'
)

function normalizeBundle(raw: any): any {
  if (!raw) return raw
  const b = { ...raw }
  // ensure share_bundle_items exists
  if (!Array.isArray(b.share_bundle_items)) {
    if (Array.isArray(b.shareBundleItems)) b.share_bundle_items = b.shareBundleItems
    else if (Array.isArray(b.items)) {
      b.share_bundle_items = b.items.map((it: any, idx: number) => ({
        id: `${b.public_share_id ?? b.id ?? 'local'}-${idx}`,
        amalan_id: it.amalan_id ?? it.slug ?? '',
        title: it.title ?? (it as any).judul ?? '',
        slug: it.slug ?? it.amalan_id ?? '',
        folder_path: it.folder_path ?? null,
        sort_order: it.sort_order ?? idx,
        version_at_share: it.version_at_share ?? 1,
        lyrics: it.lyrics ?? [],
        amalan: {
          id: it.amalan_id ?? it.slug ?? '',
          judul: it.title ?? (it as any).judul ?? '',
          title: it.title ?? (it as any).judul ?? '',
          slug: it.slug ?? it.amalan_id ?? '',
          ringkasan: (it as any).ringkasan ?? null,
          lyrics: it.lyrics ?? [],
          folder_path: it.folder_path ?? null,
        },
        _raw: it,
      }))
    } else {
      b.share_bundle_items = []
    }
  }
  // ensure each item has amalan sub-object
  b.share_bundle_items = (b.share_bundle_items as any[]).map((it: any) => ({
    ...it,
    amalan: it.amalan ?? {
      id: it.amalan_id ?? it.slug ?? '',
      judul: it.title ?? (it as any).judul ?? '',
      title: it.title ?? (it as any).judul ?? '',
      slug: it.slug ?? it.amalan_id ?? '',
      ringkasan: (it as any).ringkasan ?? null,
      lyrics: it.lyrics ?? [],
    },
    folder_path: it.folder_path ?? it.amalan?.folder_path ?? null,
  }))
  return b
}

async function loadBundle() {
  const shareId = route.params.share_id as string
  try {
    loading.value = true
    const fetched: any = await getShareBundle(shareId)
    bundle.value = normalizeBundle(fetched)
  } catch (err) {
    console.error('Error loading bundle:', err)
    // final fallback: try localStorage directly
    try {
      const local = getLocalBundle(shareId)
      if (local) {
        bundle.value = normalizeBundle(local)
        error.value = false
        return
      }
      // also try hash / query fallback (if any)
      const hash = window.location.hash || ''
      if (hash.includes('local')) {
        const local2 = getLocalBundle(shareId)
        if (local2) {
          bundle.value = normalizeBundle(local2)
          return
        }
      }
    } catch {}
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBundle()
})

/**
 * Run `worker` over `items` with at most `limit` promises in flight at once.
 * Results are stored by index so the returned array preserves input order.
 * If a worker rejects, no new work is started (in-flight workers finish).
 */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let nextIndex = 0
  let aborted = false

  async function runWorker(): Promise<void> {
    while (!aborted && nextIndex < items.length) {
      const index = nextIndex++
      try {
        results[index] = await worker(items[index], index)
      } catch (err) {
        aborted = true
        throw err
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runWorker()))
  return results
}

/**
 * Recreate the folder hierarchy for one item, reusing folders already seen in
 * this import via `folderMap`. Sequential — a parent folder must exist before
 * its children.
 */
async function resolveFolderId(item: any, folderMap: Map<string, number>): Promise<number> {
  if (!item.folder_path) return 0

  const parts = item.folder_path.split('/').map((s: string) => s.trim()).filter(Boolean)
  let parent_id: number | null = null
  let pathAccumulator = ''

  for (const part of parts) {
    pathAccumulator = pathAccumulator ? `${pathAccumulator}/${part}` : part

    if (folderMap.has(pathAccumulator)) {
      parent_id = folderMap.get(pathAccumulator)!
    } else {
      // Check if folder exists in DB
      const existing: LocalFolder | undefined = await db.folders.where({ name: part, parent_id }).first()
      if (!existing) {
        const newId = await db.folders.add({
          name: part,
          parent_id,
          created_at: Date.now(),
          updated_at: Date.now()
        }) as number
        folderMap.set(pathAccumulator, newId)
        parent_id = newId
      } else {
        parent_id = existing.id!
        folderMap.set(pathAccumulator, parent_id)
      }
    }
  }
  return parent_id || 0
}

/**
 * Fetch + save a single shared amalan. Offline-first: prefers the lyrics that
 * shipped inside the bundle, falls back to `getById` + `downloadMarkdown` from
 * the server, and upserts by the compound key [amalan_id+folder_id] so the same
 * amalan can live in different folders.
 */
async function importShareItem(item: any, folder_id: number): Promise<void> {
  // Try to fetch full amalan from server, but fallback to bundle data for offline/local shares
  let fullAmalan: any = null
  let contentFromServer: string | null = null
  try {
    fullAmalan = await getById(item.amalan_id)
    if (fullAmalan) {
      try { contentFromServer = await downloadMarkdown(fullAmalan.id) } catch {}
    }
  } catch (e) {
    // offline or not found — will use bundle data
    console.warn('[share] getById failed, using bundle lyrics', e)
  }

  // Prefer bundle lyrics (offline-first), fallback to server lyrics
  let plainLyrics: any[] | null = null
  const bundleLyrics = (item as any).lyrics || (item.amalan as any)?.lyrics
  if (Array.isArray(bundleLyrics) && bundleLyrics.length > 0) {
    plainLyrics = JSON.parse(JSON.stringify(bundleLyrics.map((r: any) => ({
      ...(r?.id != null ? { id: String(r.id) } : {}),
      arab: String(r?.arab ?? ''),
      latin: r?.latin == null ? null : String(r.latin),
    }))))
  } else if (fullAmalan && Array.isArray((fullAmalan as any).lyrics) && (fullAmalan as any).lyrics.length > 0) {
    plainLyrics = JSON.parse(JSON.stringify((fullAmalan as any).lyrics.map((r: any) => ({
      ...(r?.id != null ? { id: String(r.id) } : {}),
      arab: String(r?.arab ?? ''),
      latin: r?.latin == null ? null : String(r.latin),
    }))))
  }

  // Determine metadata — prefer server, fallback to bundle
  const amalanIdStr = String(fullAmalan?.id ?? item.amalan_id ?? '')
  if (!amalanIdStr) return
  const judul = String(fullAmalan?.judul ?? item.amalan?.judul ?? (item as any).title ?? '')
  const slug = String(fullAmalan?.slug ?? item.amalan?.slug ?? (item as any).slug ?? amalanIdStr)
  const ringkasan = fullAmalan?.ringkasan ?? item.amalan?.ringkasan ?? (item as any).ringkasan ?? null
  const contentVersion = Number(fullAmalan?.content_version ?? (item as any).version_at_share ?? 1)
  const serverUpdatedAt = String(fullAmalan?.updated_at ?? bundle.value.updated_at ?? bundle.value.created_at ?? new Date().toISOString())
  const content = plainLyrics ? JSON.stringify(plainLyrics) : (contentFromServer ?? '[]')

  // If neither server nor bundle provided lyrics/content, skip this item (avoid empty record)
  // — still allow import with empty lyrics but with bundle title (useful for local fallback)

  // Compound check: allow same amalan in different folders
  let existingLocal: any = null
  try {
    existingLocal = await db.saved_amalan.where('[amalan_id+folder_id]').equals([amalanIdStr, folder_id]).first()
  } catch (e) {
    console.error('[share] compound check failed, fallback to amalan_id', e)
    try { existingLocal = await db.saved_amalan.where('amalan_id').equals(amalanIdStr).first() } catch {}
  }
  const basePayload: any = {
    folder_id,
    content,
    content_version: contentVersion,
    server_updated_at: serverUpdatedAt,
    last_synced_at: Date.now(),
    has_update_available: false,
  }
  if (plainLyrics) {
    basePayload.lyrics = plainLyrics
    basePayload.content = JSON.stringify(plainLyrics)
  }
  const plainBase = JSON.parse(JSON.stringify(basePayload))
  if (existingLocal) {
    if (existingLocal.id != null) {
      await db.saved_amalan.update(existingLocal.id, plainBase)
    } else {
      await db.saved_amalan.where('[amalan_id+folder_id]').equals([amalanIdStr, folder_id]).modify(plainBase)
    }
  } else {
    const newRec: any = JSON.parse(JSON.stringify({
      amalan_id: amalanIdStr,
      judul,
      slug,
      ringkasan: ringkasan == null ? null : String(ringkasan),
      content,
      content_version: contentVersion,
      server_updated_at: serverUpdatedAt,
      saved_at: Date.now(),
      last_synced_at: Date.now(),
      has_update_available: false,
      folder_id,
    }))
    if (plainLyrics) {
      newRec.lyrics = plainLyrics
      newRec.content = JSON.stringify(plainLyrics)
    }
    await db.saved_amalan.add(newRec)
  }
}

async function importBundle() {
  if (!bundle.value) return
  
  importing.value = true
  importedCount.value = 0
  try {
    if (!isIndexedDBAvailable()) {
      toast.error('Penyimpanan offline tidak tersedia di browser ini.')
      importing.value = false
      return
    }
    try { await ensureDbReady() } catch {}
    const folderMap = new Map<string, number>()
    const items: any[] = bundle.value.share_bundle_items

    // Phase 1 — recreate the folder hierarchy for every item. Kept sequential
    // because parent folders must exist before children (shared `folderMap`).
    const folderIds = new Array<number>(items.length)
    for (let i = 0; i < items.length; i++) {
      folderIds[i] = await resolveFolderId(items[i], folderMap)
    }

    // Collapse duplicate [amalan_id+folder_id] entries (last occurrence wins —
    // same final state as the old sequential update-last flow) so concurrent
    // workers never race on the unique compound index.
    const workItems: Array<{ item: any; folder_id: number }> = []
    {
      const lastIndex = new Map<string, number>()
      for (let i = 0; i < items.length; i++) {
        lastIndex.set(`${String(items[i].amalan_id ?? '')}::${folderIds[i]}`, i)
      }
      for (let i = 0; i < items.length; i++) {
        if (lastIndex.get(`${String(items[i].amalan_id ?? '')}::${folderIds[i]}`) === i) {
          workItems.push({ item: items[i], folder_id: folderIds[i] })
        }
      }
    }

    // Phase 2 — fetch + import each item in parallel (bounded concurrency).
    // Each worker keeps its own dedupe/offline-first logic inside `importShareItem`.
    importTotal.value = workItems.length
    await mapWithConcurrency(workItems, 4, async ({ item, folder_id }) => {
      await importShareItem(item, folder_id)
      importedCount.value++
    })

    toast.success('Koleksi berhasil diimpor ke koleksi offline Anda.')
    router.push({ name: 'amalan-offline' })
  } catch (err) {
    console.error('Error importing bundle:', err)
    toast.error('Gagal mengimpor koleksi. Pastikan Anda memiliki koneksi internet.')
  } finally {
    importing.value = false
  }
}
</script>
