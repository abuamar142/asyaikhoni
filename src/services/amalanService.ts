import { api } from '@/utils/httpClient'
import type { Category } from '@/services/categoryService'

export type Amalan = {
  id: string
  judul: string
  slug: string
  ringkasan?: string | null
  md_content?: string | null
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

type AmalanResponse = {
  amalan: Amalan
}

type AmalanListResponse = {
  amalan: Amalan[]
  total: number
  limit: number
  offset: number
}

export async function listPublic(params?: {
  q?: string
  kategori?: string | string[]
  kategoriIds?: string[]
  limit?: number
  offset?: number
}) {
  const searchParams = new URLSearchParams()
  if (params?.q) searchParams.set('q', params.q)
  if (params?.kategoriIds?.length) searchParams.set('kategoriIds', params.kategoriIds.join(','))
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.offset) searchParams.set('offset', String(params.offset))

  const query = searchParams.toString()
  const result = await api.get<AmalanListResponse>(
    `/api/v1/asyaikhoni/amalan${query ? `?${query}` : ''}`,
  )
  return result.amalan
}

export async function listAll(params?: {
  q?: string
  kategori?: string | string[]
  kategoriIds?: string[]
  limit?: number
  offset?: number
  includeDeleted?: boolean
}) {
  const searchParams = new URLSearchParams()
  if (params?.q) searchParams.set('q', params.q)
  if (params?.kategoriIds?.length) searchParams.set('kategoriIds', params.kategoriIds.join(','))
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.offset) searchParams.set('offset', String(params.offset))

  const query = searchParams.toString()
  const result = await api.get<AmalanListResponse>(
    `/api/v1/asyaikhoni/amalan${query ? `?${query}` : ''}`,
  )
  return result.amalan
}

export async function getBySlug(slug: string) {
  try {
    const result = await api.get<AmalanResponse>(`/api/v1/asyaikhoni/amalan/slug/${slug}`)
    return result.amalan
  } catch {
    return null
  }
}

export async function getById(id: string) {
  try {
    const result = await api.get<AmalanResponse>(`/api/v1/asyaikhoni/amalan/${id}`)
    return result.amalan
  } catch {
    return null
  }
}

export async function downloadMarkdown(id: string): Promise<string> {
  const result = await api.get<{ md_content: string }>(`/api/v1/asyaikhoni/amalan/markdown/${id}`)
  return result.md_content
}

export async function createAmalan(payload: {
  judul: string
  slug: string
  ringkasan?: string
  ikon_url?: string
  urutan?: number
  aktif?: boolean
  kategoriIds?: string[]
  mdContent: string
}) {
  const result = await api.post<AmalanResponse>('/api/v1/asyaikhoni/amalan', {
    judul: payload.judul,
    slug: payload.slug,
    ringkasan: payload.ringkasan || null,
    md_content: payload.mdContent,
    kategori_ids: payload.kategoriIds,
    ikon_url: payload.ikon_url || null,
    urutan: payload.urutan ?? null,
    aktif: payload.aktif ?? true,
  })
  return result.amalan
}

export async function updateAmalan(
  id: string,
  payload: {
    judul?: string
    slug?: string
    ringkasan?: string
    md_content?: string
    kategori_ids?: string[]
    kategoriIds?: string[]
    ikon_url?: string
    urutan?: number
    aktif?: boolean
  },
) {
  const body: Record<string, unknown> = {}
  if (payload.judul !== undefined) body.judul = payload.judul
  if (payload.slug !== undefined) body.slug = payload.slug
  if (payload.ringkasan !== undefined) body.ringkasan = payload.ringkasan
  if (payload.md_content !== undefined) body.md_content = payload.md_content
  if (payload.ikon_url !== undefined) body.ikon_url = payload.ikon_url
  if (payload.urutan !== undefined) body.urutan = payload.urutan
  if (payload.aktif !== undefined) body.aktif = payload.aktif
  if (payload.kategoriIds !== undefined) body.kategori_ids = payload.kategoriIds
  if (payload.kategori_ids !== undefined) body.kategori_ids = payload.kategori_ids

  const result = await api.put<AmalanResponse>(`/api/v1/asyaikhoni/amalan/${id}`, body)
  return result.amalan
}

export async function deleteAmalan(
  id: string,
  options?: { deleteFile?: boolean; permanent?: boolean },
) {
  const query = options?.permanent ? '?permanent=true' : ''
  await api.delete(`/api/v1/asyaikhoni/amalan/${id}${query}`)
}

export async function restoreAmalan(id: string) {
  await api.delete(`/api/v1/asyaikhoni/amalan/${id}?action=restore`)
}

export async function toggleAktif(id: string, aktif: boolean) {
  const result = await api.put<AmalanResponse>(`/api/v1/asyaikhoni/amalan/${id}`, { aktif })
  return result.amalan
}
