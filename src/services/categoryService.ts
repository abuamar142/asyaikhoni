import { apiGet } from '@/utils/httpClient'

export type Category = {
  id: string
  nama: string
  deskripsi?: string | null
  created_at?: string
  updated_at?: string
}

export async function listCategories(params?: { q?: string }): Promise<Category[]> {
  const sp = new URLSearchParams()
  if (params?.q) sp.set('q', params.q)
  const qs = sp.toString()
  const path = qs ? `/api/v1/asyaikhoni/kategori?${qs}` : '/api/v1/asyaikhoni/kategori'
  return apiGet<Category[]>(path)
}

export async function getCategory(id: string): Promise<Category | null> {
  return apiGet<Category | null>(`/api/v1/asyaikhoni/kategori/${id}`)
}
