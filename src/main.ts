import { ViteSSG } from 'vite-ssg'
import { VueQueryPlugin, hydrate, dehydrate } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import App from './App.vue'
import { routes } from './router'
import { queryClient } from './utils/queryClient'
import * as amalanService from '@/services/amalanService'
import { fetchAmalanSlugs } from '@/utils/prerender'

// Import our CSS
import './assets/main.css'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, initialState, isClient }) => {
    app.use(VueQueryPlugin, { queryClient })

    // Client-only browser integrations: localStorage query persistence + PWA
    // storage persist request. Both are skipped during SSR/prerender.
    if (isClient) {
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
    }

    // Hydrate the query cache transferred from the prerender (dehydrated in transformState).
    if (isClient && initialState.vueQueryState) {
      hydrate(queryClient, initialState.vueQueryState)
    }

    // During prerender, prefetch each amalan's lyric data so the generated HTML
    // contains the real content. Query key + queryFn mirror useAmalanBySlugQuery
    // exactly (src/composables/useAmalanQueries.ts) so client hydration reuses
    // the same cache entry.
    router.beforeEach(async (to) => {
      if (import.meta.env.SSR && to.name === 'amalan-detail') {
        const slug = String(to.params.slug)
        await queryClient.prefetchQuery({
          queryKey: ['amalan', 'detail', 'slug', slug],
          queryFn: () => amalanService.getBySlug(slug),
          staleTime: Infinity,
        })
      }
    })
  },
  {
    transformState(state) {
      if (import.meta.env.SSR) {
        state.vueQueryState = dehydrate(queryClient)
        return JSON.stringify(state)
      }
      return state
    },
  },
)

/**
 * Expand prerender targets: every static route (excluding dynamic `:`/`*` variants,
 * mirroring vite-ssg's default filter — see DefaultIncludedRoutes) plus one exact
 * real path per amalan slug fetched from the API, e.g. `/amalan/nurul-huda-wal-haqq`.
 */
export async function includedRoutes(paths: string[], routes: any[]) {
  const staticPaths = paths.filter((p) => !p.includes(':') && !p.includes('*'))
  const slugs = await fetchAmalanSlugs()
  return staticPaths.concat(slugs.map((s: string) => `/amalan/${s}`))
}