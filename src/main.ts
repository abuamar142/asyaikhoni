import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import App from './App.vue'
import router from './router'
import { queryClient } from './utils/queryClient'

// Import our CSS
import './assets/main.css'

if (typeof window !== 'undefined') {
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'amalan-query-cache',
  })

  persistQueryClient({
    queryClient,
    persister,
    buster: 'v2', // bumped from v1 to invalidate stale empty cache after amalan insert (2026-08-29)
    maxAge: 1000 * 60 * 10, // align with gcTime
  })
}

const app = createApp(App)
app.use(router)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')

// Fire-and-forget persistent storage request (PWA): ask the browser to keep
// our cache/quota data across sessions. If denied, log the storage estimate.
if (navigator.storage?.persist) {
  navigator.storage.persist().then((persisted) => {
    if (!persisted) {
      navigator.storage.estimate().then((estimate) => {
        console.info('[pwa] storage persist denied; estimate:', estimate)
      })
    }
  })
}
