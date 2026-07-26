import { ref, onMounted } from 'vue'
import { db } from '@/utils/localDb'
import { api } from '@/utils/httpClient'

export function useOfflineSync() {
  const isSyncing = ref(false)
  const updateCount = ref(0)

  async function checkUpdates() {
    if (isSyncing.value) return
    isSyncing.value = true
    
    try {
      const savedItems = await db.saved_amalan.toArray()
      if (savedItems.length === 0) {
        isSyncing.value = false
        return
      }

      const ids = savedItems.map(item => item.amalan_id)
      
      // Fetch latest versions from server via REST API
      const result = await api.get<{ amalan: { id: string; content_version: number; updated_at: string }[] }>(
        `/api/v1/asyaikhoni/amalan?limit=9999`,
      )
      const serverItems = result.amalan.filter((item) => ids.includes(item.id))

      let count = 0
      const serverMap = new Map(serverItems.map(item => [item.id, item]))

      for (const local of savedItems) {
        const server = serverMap.get(local.amalan_id)
        if (server) {
          const hasUpdate = server.content_version > local.content_version
          if (hasUpdate !== local.has_update_available) {
            await db.saved_amalan.update(local.id!, { has_update_available: hasUpdate })
          }
          if (hasUpdate) count++
        }
      }

      updateCount.value = count
    } catch (err) {
      console.error('Failed to sync offline updates:', err)
    } finally {
      isSyncing.value = false
    }
  }

  onMounted(() => {
    // Check for updates when online
    if (navigator.onLine) {
      checkUpdates()
    }
    
    window.addEventListener('online', checkUpdates)
  })

  return {
    isSyncing,
    updateCount,
    checkUpdates
  }
}
