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
  parent_id?: number | null
  created_at: number
  updated_at: number
}

export class MyDatabase extends Dexie {
  saved_amalan!: Table<LocalSavedAmalan>
  folders!: Table<LocalFolder>

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
  }
}

export const db = new MyDatabase()

// Dexie lifecycle handlers — helps diagnose blocked upgrade on mobile PWA (second tab holds v1)
if (typeof window !== 'undefined') {
  db.on('blocked', () => {
    console.warn('[localDb] DB upgrade blocked — close other tabs holding old DB')
  })
  // Dexie fires versionchange when another tab upgrades; close to allow upgrade
  db.on('versionchange', () => {
    console.warn('[localDb] versionchange — closing DB to allow upgrade')
    db.close()
  })
}

/** Ensure DB is open and recover from VersionError / stale schema on old HP installs. */
export async function ensureDbReady(): Promise<void> {
  try {
    if (!db.isOpen()) await db.open()
  } catch (err: any) {
    const name = err?.name || ''
    const msg = err?.message || String(err)
    const isVersionErr = /VersionError|SchemaError|UpgradeError|DatabaseClosed/i.test(name + ' ' + msg)
    if (isVersionErr) {
      console.error('[localDb] VersionError opening DB, deleting and recreating', err)
      try {
        db.close()
        await db.delete()
        await db.open()
      } catch (e) {
        console.error('[localDb] recreate failed', e)
        throw e
      }
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
