import { api } from '@/utils/httpClient'
import { toPlainLyrics } from '@/utils/lyric'

export interface ShareBundlePayload {
  title: string
  description?: string
  items: {
    amalan_id: string
    title: string
    slug: string
    lyrics: { arab: string; latin: string | null }[]
    folder_path: string | null
    sort_order: number
    version_at_share: number
  }[]
}

/** Baris lyric yang sudah dishaping di dalam bundle share. */
export interface ShareBundleLyric {
  id?: string
  arab: string
  latin: string | null
}

/** Item bundle hasil buildLocalBundle — bentuk pasti bundle lokal. */
export interface ShareBundleItem {
  id: string
  amalan_id: string
  title: string
  slug: string
  folder_path: string | null
  sort_order: number
  version_at_share: number
  lyrics: ShareBundleLyric[]
  amalan: {
    id: string
    judul: string
    title: string
    slug: string
    ringkasan: null
    lyrics: ShareBundleLyric[]
    folder_path: string | null
  }
  _raw: ShareBundlePayload['items'][number]
}

/** Bundle lokal yang dibangun buildLocalBundle (offline-first share). */
export interface LocalShareBundle {
  public_share_id: string
  id: string
  title: string
  description: string | null
  items: ShareBundlePayload['items']
  share_bundle_items: ShareBundleItem[]
  shareBundleItems: ShareBundleItem[]
  created_at: string
  updated_at: string
  createdAt: string
  updatedAt: string
  is_local: true
  _local: true
}

/** Item bundle mentah dari server — field longgar karena versi API bisa
 *  berbeda; konsumen (AmalanSharePreview) menormalkan lewat normalizeBundle. */
export interface RawShareBundleItem {
  id?: string | number
  amalan_id?: string
  title?: string
  judul?: string
  slug?: string
  ringkasan?: string | null
  folder_path?: string | null
  sort_order?: number
  version_at_share?: number
  lyrics?: unknown[]
  amalan?: {
    id?: string | number
    judul?: string
    title?: string
    slug?: string
    ringkasan?: string | null
    lyrics?: unknown[]
    folder_path?: string | null
  } | null
  _raw?: unknown
}

/** Bundle mentah dari server — field opsional, ternormalisasi di view. */
export interface RawShareBundle {
  public_share_id?: string
  id?: string | number
  title?: string
  description?: string | null
  items?: RawShareBundleItem[]
  share_bundle_items?: RawShareBundleItem[]
  shareBundleItems?: RawShareBundleItem[]
  created_at?: string
  updated_at?: string
  createdAt?: string
  updatedAt?: string
  is_local?: boolean
  _local?: boolean
}

/** Hasil createShareBundle — link share siap pakai (server atau lokal). */
export interface CreateShareResult {
  public_share_id: string
  share_url: string
  is_local: boolean
}

/** Respons API create share — data wrapper sudah dilepas httpClient;
 *  bentuknya longgar karena server bisa membalas `{bundle}` atau datar. */
interface CreateShareResponse {
  bundle?: { public_share_id?: string }
  public_share_id?: string
  share_url?: string
  id?: string
  is_local?: boolean
}

const LOCAL_PREFIX = 'share_bundle:'

function generateLocalId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID().slice(0, 8)
    }
  } catch {}
  return Math.random().toString(36).slice(2, 10)
}

function saveLocalBundle(id: string, bundle: LocalShareBundle) {
  try {
    localStorage.setItem(LOCAL_PREFIX + id, JSON.stringify(bundle))
  } catch {}
}

export function getLocalBundle(id: string): RawShareBundle | null {
  try {
    const raw = localStorage.getItem(LOCAL_PREFIX + id)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function buildLocalBundle(payload: ShareBundlePayload, public_share_id: string): LocalShareBundle {
  const now = new Date().toISOString()
  const items: ShareBundlePayload['items'] = payload.items.map((it, idx) => ({
    amalan_id: String(it.amalan_id ?? ''),
    title: String(it.title ?? ''),
    slug: String(it.slug ?? it.amalan_id ?? ''),
    lyrics: Array.isArray(it.lyrics) ? it.lyrics : [],
    folder_path: it.folder_path == null ? null : String(it.folder_path),
    sort_order: Number(it.sort_order ?? idx),
    version_at_share: Number(it.version_at_share ?? 1),
  }))
  const share_bundle_items: ShareBundleItem[] = items.map((it, idx) => ({
    id: `${public_share_id}-${idx}`,
    amalan_id: it.amalan_id,
    title: it.title,
    slug: it.slug,
    folder_path: it.folder_path,
    sort_order: it.sort_order,
    version_at_share: it.version_at_share,
    lyrics: it.lyrics,
    amalan: {
      id: it.amalan_id,
      judul: it.title,
      title: it.title,
      slug: it.slug,
      ringkasan: null,
      lyrics: it.lyrics,
      folder_path: it.folder_path,
    },
    _raw: it,
  }))
  return {
    public_share_id,
    id: public_share_id,
    title: payload.title,
    description: payload.description ?? null,
    items,
    share_bundle_items,
    shareBundleItems: share_bundle_items,
    created_at: now,
    updated_at: now,
    createdAt: now,
    updatedAt: now,
    is_local: true,
    _local: true,
  }
}

export async function createShareBundle(payload: ShareBundlePayload): Promise<CreateShareResult> {
  // Plain clone to avoid DataCloneError from Vue reactive proxies / Dexie objects
  const plainPayload = JSON.parse(JSON.stringify(payload)) as ShareBundlePayload

  // Ensure each item's lyrics is a plain sanitized array
  if (plainPayload.items && Array.isArray(plainPayload.items)) {
    plainPayload.items = plainPayload.items.map((item) => ({
      amalan_id: String(item.amalan_id ?? ''),
      title: String(item.title ?? ''),
      slug: String(item.slug ?? item.amalan_id ?? ''),
      lyrics: Array.isArray(item.lyrics) ? toPlainLyrics(item.lyrics) : [],
      folder_path: item.folder_path == null ? null : String(item.folder_path),
      sort_order: Number(item.sort_order ?? 0),
      version_at_share: Number(item.version_at_share ?? 1),
    }))
  }

  try {
    const result = await api.post<CreateShareResponse & RawShareBundle>(
      '/api/v1/asyaikhoni/share',
      plainPayload,
    )
    const bundleId = result?.bundle?.public_share_id ?? result?.public_share_id ?? result?.id
    if (!bundleId) throw new Error('Gagal membuat link share.')
    return {
      public_share_id: bundleId,
      share_url: `${window.location.origin}/amalan/share/${bundleId}`,
      is_local: false,
    }
  } catch (err: unknown) {
    // httpClient errors: Error + status/statusCode/code; fetch failures: TypeError.
    const e = err as { message?: string; name?: string; status?: number; statusCode?: number; code?: number } | null | undefined
    const message: string = e?.message || String(err) || ''
    const name: string = e?.name || ''
    const status: number | undefined = e?.status ?? e?.statusCode ?? e?.code

    if (
      /Failed to fetch|NetworkError|Network request failed|Load failed/i.test(message) ||
      (name === 'TypeError' && /fetch/i.test(message))
    ) {
      // Offline / network failure -> offline-first local share
      const localId = generateLocalId()
      const bundle = buildLocalBundle(plainPayload, localId)
      saveLocalBundle(localId, bundle)
      return {
        public_share_id: localId,
        share_url: `${window.location.origin}/amalan/share/${localId}`,
        is_local: true,
      }
    }

    if (status === 404 || /404|not.?found|Fitur share belum/i.test(message)) {
      // Server 404 -> fallback to local bundle so "Buat Link Share" still works
      const localId = generateLocalId()
      const bundle = buildLocalBundle(plainPayload, localId)
      saveLocalBundle(localId, bundle)
      return {
        public_share_id: localId,
        share_url: `${window.location.origin}/amalan/share/${localId}`,
        is_local: true,
      }
    }

    if (status && status >= 500 && status < 600) {
      throw new Error(`Gagal di server: ${status}`)
    }

    const serverMatch = message.match(/\b(5\d{2})\b/)
    if (serverMatch) {
      throw new Error(`Gagal di server: ${serverMatch[1]}`)
    }

    if (/Internal Server Error|Gagal di server/i.test(message)) {
      throw new Error(message.includes('Gagal di server') ? message : 'Gagal di server: 500')
    }

    throw err instanceof Error ? err : new Error(message || 'Gagal membuat link share.')
  }
}

// Fallback lokal hanya untuk network-error/404 (bukan 401/403/5xx) — dipakai
// getShareBundle dan loadBundle di AmalanSharePreview (audit race #4: hasil
// gagal tidak boleh menimpa state sukses dengan bundle lokal yang keliru).
export function isLocalFallbackError(err: unknown): boolean {
  // httpClient errors: Error + status/statusCode/code; fetch failures: TypeError "Failed to fetch".
  if (!(err instanceof Error)) return false
  const message = err.message
  const named = err as Error & { status?: number; statusCode?: number; code?: number }
  const status = named.status ?? named.statusCode ?? named.code
  const isNetworkError =
    /Failed to fetch|NetworkError|Network request failed|Load failed/i.test(message) ||
    (err.name === 'TypeError' && /fetch/i.test(message))
  const is404 = status === 404 || /\b404\b|not.?found/i.test(message)
  return isNetworkError || is404
}

export async function getShareBundle(publicShareId: string): Promise<RawShareBundle> {
  try {
    const result = await api.get<RawShareBundle & { bundle?: RawShareBundle }>(
      `/api/v1/asyaikhoni/share/${publicShareId}`,
    )
    return result?.bundle ?? result
  } catch (err: unknown) {
    // 401/403/5xx harus surface sebagai error, jangan ditimpa bundle lokal.
    if (isLocalFallbackError(err)) {
      const local = getLocalBundle(publicShareId)
      if (local) return local
    }
    throw err
  }
}
