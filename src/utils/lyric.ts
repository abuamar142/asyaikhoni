export type LyricRow = { arab: string; latin: string | null; id?: string }

export function toPlainLyrics(rows: any[]): LyricRow[] {
  if (!Array.isArray(rows)) return []
  return (rows as any[])
    .map((r: any) => ({
      ...(r?.id != null ? { id: String(r.id) } : {}),
      arab: String(r?.arab ?? ''),
      latin: r?.latin == null ? null : String(r.latin),
    }))
    .filter((r) => !!r.arab)
}

export function toSavedAmalanPayload(src: any, lyrics: any[], folderId: number) {
  const plainLyrics = toPlainLyrics(lyrics as any)
  return {
    amalan_id: String(src?.id ?? src?.amalan_id ?? ''),
    judul: String(src?.judul ?? ''),
    slug: String(src?.slug ?? ''),
    ringkasan: src?.ringkasan == null ? null : String(src.ringkasan),
    content: JSON.stringify(plainLyrics),
    lyrics: plainLyrics,
    content_version: Number(src?.content_version ?? 1),
    server_updated_at: String(src?.updated_at ?? (src as any)?.updatedAt ?? new Date().toISOString()),
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
