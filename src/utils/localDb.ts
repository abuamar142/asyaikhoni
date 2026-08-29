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
    // v2 adds lyrics field (no index change, just schema upgrade)
    this.version(2).stores({
      saved_amalan: '++id, amalan_id, slug, folder_id, has_update_available',
      folders: '++id, name, parent_id',
    })
  }
}

export const db = new MyDatabase()
