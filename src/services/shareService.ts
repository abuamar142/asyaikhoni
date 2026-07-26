import { requireSupabase } from '@/utils/supabaseClient'
import type { LocalSavedAmalan, LocalFolder } from '@/utils/localDb'

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
  const supabase = requireSupabase()
  const public_share_id = Math.random().toString(36).substring(2, 10)
  
  const { data: bundle, error: bundleErr } = await supabase
    .from('share_bundles')
    .insert({
      public_share_id,
      title: payload.title,
      description: payload.description
    })
    .select()
    .single()

  if (bundleErr) throw bundleErr

  const bundleItems = payload.items.map(item => ({
    share_bundle_id: bundle.id,
    amalan_id: item.amalan_id,
    folder_path: item.folder_path,
    sort_order: item.sort_order,
    version_at_share: item.version_at_share
  }))

  const { error: itemsErr } = await supabase
    .from('share_bundle_items')
    .insert(bundleItems)

  if (itemsErr) throw itemsErr

  return {
    public_share_id,
    share_url: `${window.location.origin}/amalan/share/${public_share_id}`
  }
}

export async function getShareBundle(publicShareId: string) {
  const supabase = requireSupabase()
  const { data: bundle, error: bundleErr } = await supabase
    .from('share_bundles')
    .select('*, share_bundle_items(*, amalan(judul, slug, ringkasan, content_version))')
    .eq('public_share_id', publicShareId)
    .single()

  if (bundleErr) throw bundleErr
  return bundle
}
