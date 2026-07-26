import { requireSupabase } from '@/utils/supabaseClient'

export type Category = {
  id: string
  nama: string
  deskripsi?: string | null
  created_at?: string
  updated_at?: string
}

export async function listCategories(params?: { q?: string }) {
  const supabase = requireSupabase()
  let query = supabase.from('kategori').select('*')
  if (params?.q) {
    query = query.ilike('nama', `%${params.q}%`)
  }
  const { data, error } = await query.order('nama', { ascending: true })
  if (error) throw error
  return (data || []) as Category[]
}

export async function getCategory(id: string) {
  const supabase = requireSupabase()
  const { data, error } = await supabase.from('kategori').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as Category | null
}

export async function createCategory(payload: { nama: string; deskripsi?: string | null }) {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('kategori')
    .insert({
      nama: payload.nama,
      deskripsi: payload.deskripsi ?? null,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as Category
}

export async function updateCategory(id: string, payload: Partial<Category>) {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('kategori')
    .update({
      nama: payload.nama,
      deskripsi: payload.deskripsi ?? null,
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data as Category
}

export async function deleteCategory(id: string) {
  const supabase = requireSupabase()
  const { error } = await supabase.from('kategori').delete().eq('id', id)
  if (error) throw error
}
