import { ref } from 'vue'
import { db } from '@/utils/localDb'

export function useOfflineSync() {
  const savedCount = ref(0)

  async function loadSaved() {
    const items = await db.saved_amalan.toArray()
    savedCount.value = items.length
    return items
  }

  async function saveAmalan(amalan: {
    amalan_id: string
    judul: string
    slug: string
    content: string
    content_version: number
    server_updated_at: string
  }) {
    await db.saved_amalan.put({
      ...amalan,
      saved_at: Date.now(),
      last_synced_at: Date.now(),
      has_update_available: false,
      folder_id: 0,
    })
    savedCount.value = await db.saved_amalan.count()
  }

  async function removeAmalan(id: number) {
    await db.saved_amalan.delete(id)
    savedCount.value = await db.saved_amalan.count()
  }

  return {
    savedCount,
    loadSaved,
    saveAmalan,
    removeAmalan,
  }
}
