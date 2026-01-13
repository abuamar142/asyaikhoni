import { createApp } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import App from './App.vue'
import router from './router'

// Import our CSS
import './assets/main.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

if (typeof window !== 'undefined') {
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'amalan-query-cache',
  })

  persistQueryClient({
    queryClient,
    persister,
    buster: 'v1',
    maxAge: 1000 * 60 * 10, // align with gcTime
  })
}

const app = createApp(App)
app.use(router)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
