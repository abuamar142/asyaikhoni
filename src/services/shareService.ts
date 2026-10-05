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

const LOCAL_PREFIX = 'share_bundle:'

function generateLocalId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
      return (crypto as any).randomUUID().slice(0, 8)
    }
  } catch {}
  return Math.random().toString(36).slice(2, 10)
}

function saveLocalBundle(id: string, bundle: any) {
  try {
    localStorage.setItem(LOCAL_PREFIX + id, JSON.stringify(bundle))
  } catch {}
}

export function getLocalBundle(id: string): any | null {
  try {
    const raw = localStorage.getItem(LOCAL_PREFIX + id)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function buildLocalBundle(payload: ShareBundlePayload, public_share_id: string) {
  const now = new Date().toISOString()
  const items = payload.items.map((it, idx) => ({
    amalan_id: String((it as any).amalan_id ?? ''),
    title: String((it as any).title ?? ''),
    slug: String((it as any).slug ?? (it as any).amalan_id ?? ''),
    lyrics: Array.isArray((it as any).lyrics) ? (it as any).lyrics : [],
    folder_path: (it as any).folder_path == null ? null : String((it as any).folder_path),
    sort_order: Number((it as any).sort_order ?? idx),
    version_at_share: Number((it as any).version_at_share ?? 1),
  }))
  const share_bundle_items = items.map((it: any, idx: number) => ({
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

export async function createShareBundle(payload: ShareBundlePayload) {
  // Plain clone to avoid DataCloneError from Vue reactive proxies / Dexie objects
  const plainPayload = JSON.parse(JSON.stringify(payload)) as ShareBundlePayload

  // Ensure each item's lyrics is a plain sanitized array
  if (plainPayload.items && Array.isArray(plainPayload.items)) {
    plainPayload.items = plainPayload.items.map((item: any) => ({
      amalan_id: String(item.amalan_id ?? ''),
      title: String(item.title ?? ''),
      slug: String(item.slug ?? item.amalan_id ?? ''),
      lyrics: Array.isArray(item.lyrics) ? toPlainLyrics(item.lyrics as any) : [],
      folder_path: item.folder_path == null ? null : String(item.folder_path),
      sort_order: Number(item.sort_order ?? 0),
      version_at_share: Number(item.version_at_share ?? 1),
    }))
  }

  try {
    const result = await api.post<{ bundle: { public_share_id: string } }>(
      '/api/v1/asyaikhoni/share',
      plainPayload,
    )
    const bundleId =
      (result as any)?.bundle?.public_share_id ??
      (result as any)?.public_share_id ??
      (result as any)?.id
    if (!bundleId) throw new Error('Gagal membuat link share.')
    return {
      public_share_id: bundleId,
      share_url: `${window.location.origin}/amalan/share/${bundleId}`,
      is_local: false as const,
    }
  } catch (err: any) {
    const message: string = err?.message || String(err) || ''
    const name: string = err?.name || ''
    const status: number | undefined = err?.status ?? err?.statusCode ?? err?.code

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
        is_local: true as const,
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
        is_local: true as const,
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

export async function getShareBundle(publicShareId: string): Promise<unknown> {
  try {
    const result = await api.get<{ bundle?: unknown }>(`/api/v1/asyaikhoni/share/${publicShareId}`)
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
