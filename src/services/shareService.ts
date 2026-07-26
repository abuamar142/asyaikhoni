import { api } from '@/utils/httpClient'

export interface ShareBundlePayload {
  title: string
  description?: string
  items: {
    amalan_id: string
    folder_path: string | null
    sort_order: number
    version_at_share: number
  }[]
}

export async function createShareBundle(payload: ShareBundlePayload) {
  const result = await api.post<{ bundle: { public_share_id: string } }>('/api/v1/asyaikhoni/share', payload)
  return {
    public_share_id: result.bundle.public_share_id,
    share_url: `${window.location.origin}/amalan/share/${result.bundle.public_share_id}`,
  }
}

export async function getShareBundle(publicShareId: string) {
  const result = await api.get<{ bundle: any }>(`/api/v1/asyaikhoni/share/${publicShareId}`)
  return result.bundle
}
