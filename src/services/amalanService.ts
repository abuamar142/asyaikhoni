import { api } from '@/utils/httpClient'
import type { Category } from '@/services/categoryService'

export type LyricRow = {
  id?: string
  arab: string
  latin?: string | null
}

export type Amalan = {
  id: string
  judul: string
  slug: string
  ringkasan?: string | null
  md_content?: string | null // DEPRECATED
  lyrics?: LyricRow[]
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

export type AmalanList = {
  amalan: Amalan[]
  total: number
  limit: number
  offset: number
}

function buildAmalanParams(params?: {
  q?: string
  kategori?: string | string[]
  kategoriIds?: string[]
  limit?: number
  offset?: number
}): URLSearchParams {
  const searchParams = new URLSearchParams()
  if (params?.q) searchParams.set('q', params.q)
  if (params?.kategoriIds?.length) searchParams.set('kategoriIds', params.kategoriIds.join(','))
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.offset) searchParams.set('offset', String(params.offset))
  return searchParams
}

export async function listPublic(params?: {
  q?: string
  kategori?: string | string[]
  kategoriIds?: string[]
  limit?: number
  offset?: number
}): Promise<AmalanList> {
  const searchParams = buildAmalanParams(params)
  const query = searchParams.toString()
  return api.get<AmalanList>(
    `/api/v1/asyaikhoni/amalan${query ? `?${query}` : ''}`,
  )
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

// DEPRECATED - kept for backwards compat, returns md_content (not used for lyrics)
// Kept because AmalanSharePreview uses fallback when lyrics not yet migrated
export async function downloadMarkdown(id: string): Promise<string> {
  const result = await api.get<{ md_content: string }>(`/api/v1/asyaikhoni/amalan/markdown/${id}`)
  return result.md_content
}
