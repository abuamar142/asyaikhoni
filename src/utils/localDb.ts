import Dexie, { type Table } from 'dexie'

export interface LyricRow {
  id?: string
  arab: string
  latin?: string | null
}

export interface LocalSavedAmalan {
  id?: number
  amalan_id: string
  judul: string
  slug: string
  ringkasan?: string | null
  content: string // deprecated: kept for backwards compat, now stores JSON.stringify(lyrics) or md_content
  lyrics?: LyricRow[]
  content_version: number
  server_updated_at: string
  saved_at: number
  last_synced_at: number
  has_update_available: boolean
  folder_id: number // 0 for root
}

export interface LocalFolder {
  id?: number
  name: string
  parent_id: number | null
  created_at: number
  updated_at: number
}

export interface AmalanProgress {
  amalan_id: string
  slug: string
  content_version: number
  checked_indices: number[]
  updated_at: number
}

export class MyDatabase extends Dexie {
  saved_amalan!: Table<LocalSavedAmalan>
  folders!: Table<LocalFolder>
  amalan_progress!: Table<AmalanProgress>

  constructor() {
    super('AmalanOfflineDB')
    this.version(1).stores({
      saved_amalan: '++id, amalan_id, slug, folder_id, has_update_available',
      folders: '++id, name, parent_id',
    })
    // v2 adds lyrics field (no index change, just schema upgrade) + data migration
    this.version(2)
      .stores({
        saved_amalan: '++id, amalan_id, slug, folder_id, has_update_available',
        folders: '++id, name, parent_id',
      })
      .upgrade(async (tx) => {
        // Migrate old records: populate lyrics from content JSON if missing (HP with v1 DB)
        await tx
          .table('saved_amalan')
          .toCollection()
          .modify((item: any) => {
            if (!item.lyrics && item.content) {
              try {
                const parsed = JSON.parse(item.content)
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.arab) {
                  item.lyrics = parsed
                }
              } catch {
                // keep content as-is; effectiveLyrics will fallback-parse
              }
            }
            // ensure required fields have defaults for old records
            if (item.folder_id == null) item.folder_id = 0
            if (item.has_update_available == null) item.has_update_available = false
            if (!item.content_version) item.content_version = 1
          })
      })
    // v3: folder nesting - ensure parent_id exists (null for root)
    this.version(3)
      .stores({
        saved_amalan: '++id, amalan_id, slug, folder_id, has_update_available',
        folders: '++id, name, parent_id',
      })
      .upgrade((tx) => {
        return tx
          .table('folders')
          .toCollection()
          .modify((f: any) => {
            if (f.parent_id === undefined) f.parent_id = null
          })
      })
    // v4: same amalan in different folders — compound unique [amalan_id+folder_id]
    this.version(4)
      .stores({
        saved_amalan: '++id, &[amalan_id+folder_id], folder_id, amalan_id, slug, has_update_available',
        folders: '++id, name, parent_id',
      })
      .upgrade(async (tx) => {
        const table = tx.table('saved_amalan')
        // ensure folder_id defaults to 0 (root) for old records
        await table.toCollection().modify((item: any) => {
          if (item.folder_id == null) item.folder_id = 0
        })
        // deduplicate by [amalan_id+folder_id], keep newest by saved_at/last_synced_at
        const all = await table.toArray()
        const grouped = new Map<string, any[]>()
        for (const item of all) {
          const amalanId = String(item.amalan_id ?? '')
          const folderId = item.folder_id ?? 0
          const key = `${amalanId}::${folderId}`
          if (!grouped.has(key)) grouped.set(key, [])
          grouped.get(key)!.push(item)
        }
        for (const [, items] of grouped) {
          if (items.length > 1) {
            items.sort((a: any, b: any) => {
              const at = a.saved_at ?? a.last_synced_at ?? 0
              const bt = b.saved_at ?? b.last_synced_at ?? 0
              return bt - at
            })
            const dupes = items.slice(1)
            for (const dup of dupes) {
              if (dup.id != null) {
                await table.delete(dup.id)
              } else {
                await table.where('[amalan_id+folder_id]').equals([String(dup.amalan_id), dup.folder_id ?? 0]).delete()
              }
            }
          }
        }
      })
    // v5: hafalan progress checklist — per-amalan checked lyric indices (keyed by amalan_id, slug indexed for offline fallback lookup)
    this.version(5).stores({
      saved_amalan: '++id, &[amalan_id+folder_id], folder_id, amalan_id, slug, has_update_available',
      folders: '++id, name, parent_id',
      amalan_progress: 'amalan_id, slug',
    })
  }
}

export const db = new MyDatabase()

// Dexie lifecycle handlers — helps diagnose blocked upgrade on mobile PWA (second tab holds v1)
if (typeof window !== 'undefined') {
  db.on('blocked', () => {
    console.warn('[localDb] DB upgrade blocked — close other tabs holding old DB')
  })
  // Dexie fires versionchange when another tab upgrades; close to allow the
  // upgrade to proceed, then reload so this tab picks up the new version.
  // Data is preserved — the DB is never deleted on upgrade conflicts.
  db.on('versionchange', () => {
    console.warn('[localDb] versionchange — closing DB and reloading to pick up new version')
    db.close()
    window.location.reload()
  })
}

/** Ensure DB is open. On version conflicts, close cleanly and reload so the new
 * version loads fresh — never delete/recreate, so saved koleksi/folders survive. */
export async function ensureDbReady(): Promise<void> {
  try {
    if (!db.isOpen()) await db.open()
  } catch (err: any) {
    const name = err?.name || ''
    const msg = err?.message || String(err)
    const isVersionErr = /VersionError|SchemaError|UpgradeError|DatabaseClosed/i.test(name + ' ' + msg)
    if (isVersionErr) {
      console.error('[localDb] VersionError opening DB — closing and reloading to load new version', err)
      db.close()
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
      // Page is reloading; do not throw — ensureDbReady re-runs after reload.
    } else {
      throw err
    }
  }
}

export function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && !!indexedDB
  } catch {
    return false
  }
}
