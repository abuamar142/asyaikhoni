import { apiGet } from '@/utils/httpClient'

export type Category = {
  id: string
  nama: string
  deskripsi?: string | null
  created_at?: string
  updated_at?: string
}

export type Amalan = {
  id: string
  judul: string
  slug: string
  ringkasan?: string | null
  md_path?: string | null
  md_bucket_id?: string | null
  kategori?: string | null
  kategori_ids?: string[]
  categories?: Category[]
  ikon_url?: string | null
  urutan?: number | null
  aktif: boolean
  content_version: number
  deleted_at?: string | null
  created_at?: string
  updated_at?: string
}

type ListParams = {
  q?: string
  kategori?: string | string[]
  kategoriIds?: string[]
  limit?: number
  offset?: number
}

function buildListQuery(base: string, params?: ListParams): string {
  const sp = new URLSearchParams()
  if (params?.q) sp.set('q', params.q)
  if (params?.kategori) {
    const k = Array.isArray(params.kategori) ? params.kategori.join(',') : params.kategori
    sp.set('kategori', k)
  }
  if (params?.kategoriIds?.length) sp.set('kategori', params.kategoriIds.join(','))
  if (params?.limit) sp.set('limit', String(params.limit))
  if (params?.offset) sp.set('offset', String(params.offset))
  const qs = sp.toString()
  return qs ? `${base}?${qs}` : base
}

export async function listPublic(params?: ListParams): Promise<Amalan[]> {
  return apiGet<Amalan[]>(buildListQuery('/api/v1/asyaikhoni/amalan', params))
}

export async function listAll(params?: ListParams): Promise<Amalan[]> {
  return apiGet<Amalan[]>(buildListQuery('/api/v1/asyaikhoni/amalan', params))
}

export async function getBySlug(slug: string): Promise<Amalan | null> {
  return apiGet<Amalan | null>(`/api/v1/asyaikhoni/amalan/slug/${slug}`)
}

export async function getById(id: string): Promise<Amalan | null> {
  return apiGet<Amalan | null>(`/api/v1/asyaikhoni/amalan/${id}`)
}

export async function downloadMarkdown(id: string): Promise<string> {
  return apiGet<string>(`/api/v1/asyaikhoni/amalan/markdown/${id}`)
}
