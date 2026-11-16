import type { LocalSavedAmalan } from '@/utils/localDb'

export type LyricRow = { arab: string; latin: string | null; id?: string }

// Bentuk baris lyric mentah sebelum dishaping — lintas API/IndexedDB/JSON,
// field-nya tidak dijamin sehingga semuanya longgar.
export type RawLyricRow = {
  id?: unknown
  arab?: unknown
  latin?: unknown
}

export function toPlainLyrics(rows: readonly unknown[] | null | undefined): LyricRow[] {
  if (!Array.isArray(rows)) return []
  return (rows as RawLyricRow[])
    .map((r) => ({
      ...(r?.id != null ? { id: String(r.id) } : {}),
      arab: String(r?.arab ?? ''),
      latin: r?.latin == null ? null : String(r.latin),
    }))
    .filter((r) => !!r.arab)
}

// Field amalan yang dibaca toSavedAmalanPayload — `Amalan` online maupun
// objek fallback lokal memenuhi bentuk ini.
export type SavedAmalanSource = {
  id?: string | number
  amalan_id?: string
  judul?: string
  slug?: string
  ringkasan?: string | null
  content_version?: number
  updated_at?: string
  updatedAt?: string
}

export function toSavedAmalanPayload(
  src: SavedAmalanSource | null | undefined,
  lyrics: readonly unknown[] | null | undefined,
  folderId: number,
): LocalSavedAmalan {
  const plainLyrics = toPlainLyrics(lyrics)
  return {
    amalan_id: String(src?.id ?? src?.amalan_id ?? ''),
    judul: String(src?.judul ?? ''),
    slug: String(src?.slug ?? ''),
    ringkasan: src?.ringkasan == null ? null : String(src.ringkasan),
    content: JSON.stringify(plainLyrics),
    lyrics: plainLyrics,
    content_version: Number(src?.content_version ?? 1),
    server_updated_at: String(src?.updated_at ?? src?.updatedAt ?? new Date().toISOString()),
    saved_at: Date.now(),
    last_synced_at: Date.now(),
    has_update_available: false,
    folder_id: folderId,
  }
}

export function parseLegacyContent(content: string): LyricRow[] {
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) return toPlainLyrics(parsed)
  } catch {}
  return []
}
