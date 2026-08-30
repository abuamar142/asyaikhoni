import { api } from '@/utils/httpClient'

export type Category = {
  id: string
  nama: string
  deskripsi?: string | null
  created_at?: string
  updated_at?: string
}

export async function listCategories(params?: { q?: string }) {
  const query = params?.q ? `?q=${encodeURIComponent(params.q)}` : ''
  const result = await api.get<{ kategori: Category[] }>(`/api/v1/asyaikhoni/kategori${query}`)
  return result.kategori
}

export async function getCategory(id: string) {
  const result = await api.get<{ kategori: Category }>(`/api/v1/asyaikhoni/kategori/${id}`)
  return result.kategori
}
