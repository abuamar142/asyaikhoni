import { api } from '@/utils/httpClient'

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

export async function createShareBundle(payload: ShareBundlePayload) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('Anda sedang offline')
  }

  // Plain clone to avoid DataCloneError from Vue reactive proxies / Dexie objects
  const plainPayload = JSON.parse(JSON.stringify(payload))

  // Ensure each item's lyrics is a plain sanitized array
  if (plainPayload.items && Array.isArray(plainPayload.items)) {
    plainPayload.items = plainPayload.items.map((item: any) => ({
      amalan_id: String(item.amalan_id ?? ''),
      title: String(item.title ?? ''),
      slug: String(item.slug ?? item.amalan_id ?? ''),
      lyrics: Array.isArray(item.lyrics)
        ? JSON.parse(
            JSON.stringify(
              item.lyrics.map((r: any) => ({
                arab: String(r?.arab ?? ''),
                latin: r?.latin == null ? null : String(r.latin),
              })),
            ),
          )
        : [],
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
    return {
      public_share_id: result.bundle.public_share_id,
      share_url: `${window.location.origin}/amalan/share/${result.bundle.public_share_id}`,
    }
  } catch (err: any) {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new Error('Anda sedang offline')
    }

    const message: string = err?.message || String(err) || ''
    const name: string = err?.name || ''
    const status: number | undefined = err?.status ?? err?.statusCode ?? err?.code

    if (
      /Failed to fetch|NetworkError|Network request failed|Load failed/i.test(message) ||
      (name === 'TypeError' && /fetch/i.test(message))
    ) {
      throw new Error('Periksa koneksi internet')
    }

    if (status === 404 || /404|not.?found/i.test(message)) {
      throw new Error('Fitur share belum tersedia di server (404)')
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

export async function getShareBundle(publicShareId: string) {
  const result = await api.get<{ bundle: any }>(`/api/v1/asyaikhoni/share/${publicShareId}`)
  return result.bundle
}
