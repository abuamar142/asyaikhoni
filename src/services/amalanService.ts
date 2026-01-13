import { supabase, AMALAN_BUCKET_ID } from '@/utils/supabaseClient'
import type { Category } from '@/services/categoryService'

export type Amalan = {
  id: string
  judul: string
  slug: string
  ringkasan?: string | null
  md_path: string
  md_bucket_id: string
  kategori?: string | null
  kategori_ids?: string[]
  categories?: Category[]
  ikon_url?: string | null
  urutan?: number | null
  aktif: boolean
  created_at?: string
  updated_at?: string
}

type AmalanRow = Amalan & {
  amalan_kategori?: { kategori: Category | null; kategori_id: string }[]
}

function mapAmalan(row: AmalanRow): Amalan {
  const categories = (row.amalan_kategori || [])
    .map((rel) => rel.kategori)
    .filter(Boolean) as Category[]
  const kategori_ids = categories.map((c) => c.id)
  const { amalan_kategori: _relations, ...rest } = row
  void _relations
  return { ...rest, categories, kategori_ids }
}

export async function listPublic(params?: {
  q?: string
  kategori?: string
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('amalan')
    .select('*, amalan_kategori:amalan_kategori ( kategori:kategori_id ( id, nama, deskripsi ) )')
    .eq('aktif', true)
  if (params?.q) {
    query = query.ilike('judul', `%${params.q}%`)
  }
  if (params?.kategori) {
    query = query.eq('amalan_kategori.kategori_id', params.kategori)
  }
  query = query.order('urutan', { ascending: true })
  if (params?.limit) query = query.limit(params.limit)
  if (params?.offset)
    query = query.range(params.offset, (params.offset || 0) + (params?.limit || 10) - 1)
  const { data, error } = await query
  if (error) throw error
  return (data || []).map((row) => mapAmalan(row as AmalanRow))
}

export async function listAll(params?: {
  q?: string
  kategori?: string
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('amalan')
    .select('*, amalan_kategori:amalan_kategori ( kategori:kategori_id ( id, nama, deskripsi ) )')
  if (params?.q) {
    query = query.ilike('judul', `%${params.q}%`)
  }
  if (params?.kategori) {
    query = query.eq('amalan_kategori.kategori_id', params.kategori)
  }
  query = query.order('created_at', { ascending: false })
  if (params?.limit) query = query.limit(params.limit)
  if (params?.offset)
    query = query.range(params.offset, (params.offset || 0) + (params?.limit || 10) - 1)
  const { data, error } = await query
  if (error) throw error
  return (data || []).map((row) => mapAmalan(row as AmalanRow))
}

export async function getBySlug(slug: string) {
  const { data, error } = await supabase
    .from('amalan')
    .select('*, amalan_kategori:amalan_kategori ( kategori:kategori_id ( id, nama, deskripsi ) )')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data ? mapAmalan(data as AmalanRow) : null
}

export async function getById(id: string) {
  const { data, error } = await supabase
    .from('amalan')
    .select('*, amalan_kategori:amalan_kategori ( kategori:kategori_id ( id, nama, deskripsi ) )')
    .eq('id', id)
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data ? mapAmalan(data as AmalanRow) : null
}

export async function downloadMarkdown(bucketId: string, mdPath: string): Promise<string> {
  const { data, error } = await supabase.storage.from(bucketId).download(mdPath)
  if (error) throw error
  const text = await data.text()
  return text
}

export async function createAmalan(payload: {
  judul: string
  slug: string
  ringkasan?: string
  ikon_url?: string
  urutan?: number
  aktif?: boolean
  kategoriIds?: string[]
  mdFile: File
}) {
  const path = `amalan/${payload.slug}.md`
  const bucket = AMALAN_BUCKET_ID

  const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, payload.mdFile, {
    contentType: 'text/markdown',
    upsert: true,
  })
  if (uploadErr) throw uploadErr

  const { data, error } = await supabase
    .from('amalan')
    .insert({
      judul: payload.judul,
      slug: payload.slug,
      ringkasan: payload.ringkasan || null,
      md_path: path,
      md_bucket_id: bucket,
      ikon_url: payload.ikon_url || null,
      urutan: payload.urutan ?? null,
      aktif: payload.aktif ?? true,
    })
    .select('*')
    .single()
  if (error) throw error
  const created = data as Amalan
  if (payload.kategoriIds?.length) {
    await setAmalanCategories(created.id, payload.kategoriIds)
    return (await getById(created.id)) as Amalan
  }
  return created
}

export async function updateAmalan(
  id: string,
  payload: Partial<Omit<Amalan, 'id' | 'md_path' | 'md_bucket_id'>> & {
    slug?: string
    kategoriIds?: string[]
    mdFile?: File
  },
) {
  const existing = await getById(id)
  if (!existing) throw new Error('Amalan tidak ditemukan')

  let md_path = existing.md_path
  const md_bucket_id = existing.md_bucket_id

  // Handle slug change: upload to new path and delete old
  const newSlug = payload.slug ?? existing.slug
  const desiredPath = `amalan/${newSlug}.md`
  if (payload.mdFile) {
    const { error: uploadErr } = await supabase.storage
      .from(md_bucket_id)
      .upload(desiredPath, payload.mdFile, {
        contentType: 'text/markdown',
        upsert: true,
      })
    if (uploadErr) throw uploadErr
    if (existing.md_path && existing.md_path !== desiredPath) {
      await supabase.storage.from(md_bucket_id).remove([existing.md_path])
    }
    md_path = desiredPath
  } else if (existing.md_path !== desiredPath) {
    // If slug changed but no new file, copy then remove old
    const { data: file, error: dlErr } = await supabase.storage
      .from(md_bucket_id)
      .download(existing.md_path)
    if (!dlErr && file) {
      const { error: upErr } = await supabase.storage.from(md_bucket_id).upload(desiredPath, file, {
        contentType: 'text/markdown',
        upsert: true,
      })
      if (!upErr) {
        await supabase.storage.from(md_bucket_id).remove([existing.md_path])
        md_path = desiredPath
      }
    }
  }

  const { error } = await supabase
    .from('amalan')
    .update({
      judul: payload.judul ?? existing.judul,
      slug: newSlug,
      ringkasan: payload.ringkasan ?? existing.ringkasan,
      md_path,
      ikon_url: payload.ikon_url ?? existing.ikon_url,
      urutan: payload.urutan ?? existing.urutan,
      aktif: payload.aktif ?? existing.aktif,
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  if (payload.kategoriIds) {
    await setAmalanCategories(id, payload.kategoriIds)
  }
  return (await getById(id)) as Amalan
}

export async function deleteAmalan(id: string, options?: { deleteFile?: boolean }) {
  const existing = await getById(id)
  if (!existing) return
  const { error } = await supabase.from('amalan').delete().eq('id', id)
  if (error) throw error
  if (options?.deleteFile && existing.md_path) {
    await supabase.storage.from(existing.md_bucket_id).remove([existing.md_path])
  }
}

export async function toggleAktif(id: string, aktif: boolean) {
  const { data, error } = await supabase
    .from('amalan')
    .update({ aktif })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data ? mapAmalan(data as AmalanRow) : (data as Amalan)
}

async function setAmalanCategories(amalanId: string, categoryIds: string[]) {
  // Fetch existing links
  const { data: existing } = await supabase
    .from('amalan_kategori')
    .select('kategori_id')
    .eq('amalan_id', amalanId)

  const existingIds = new Set((existing || []).map((row) => row.kategori_id))
  const nextIds = new Set(categoryIds)

  const toInsert = Array.from(nextIds).filter((id) => !existingIds.has(id))
  const toDelete = Array.from(existingIds).filter((id) => !nextIds.has(id))

  if (toInsert.length) {
    await supabase
      .from('amalan_kategori')
      .insert(toInsert.map((kategori_id) => ({ amalan_id: amalanId, kategori_id })))
  }

  if (toDelete.length) {
    await supabase
      .from('amalan_kategori')
      .delete()
      .eq('amalan_id', amalanId)
      .in('kategori_id', toDelete)
  }
}
