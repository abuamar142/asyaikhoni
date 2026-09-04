import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import generateSitemap from 'vite-ssg-sitemap'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_API_BASE_URL || 'https://backend.abuamar.online'

  return {
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifest: {
          name: 'PPTQ Asy-Syaikhoni',
          short_name: 'Asy-Syaikhoni',
          description: "Pondok Pesantren Tahfidzul Qur'an Asy-Syaikhoni",
          theme_color: '#16a34a', // emerald-600
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'logo.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
            },
            {
              src: 'logo.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // API GET caching (default base: https://backend.abuamar.online, see src/utils/httpClient.ts)
              // POST/PUT/DELETE requests are never cached — this route only matches GET.
              urlPattern: /^https:\/\/backend\.abuamar\.online\/api\/.*/i,
              handler: 'StaleWhileRevalidate',
              method: 'GET',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 7 * 24 * 3600, // <== 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-vue-next')) return 'icons'
              if (id.includes('vue')) return 'vendor'
            }
          },
        },
      },
    },
    ssgOptions: {
      // Prettify the generated HTML so the lyric content is readable for crawlers.
      formatting: 'prettify',
      script: 'async',
      async onFinished() {
        // Fetch the live slug list (same source as includedRoutes) so every lyric
        // page is listed. The sitemap plugin auto-discovers all prerendered HTML
        // files in dist; dynamicRoutes adds the API-derived pages explicitly.
        let slugs: string[] = []
        try {
          const res = await fetch(`${apiBase}/api/v1/asyaikhoni/amalan?limit=100`)
          if (res.ok) {
            const json: any = await res.json()
            const amalan = json?.data?.amalan
            if (Array.isArray(amalan)) {
              slugs = amalan.map((a: any) => String(a?.slug)).filter(Boolean)
            }
          }
        } catch {
          // Never fail the build because the API hiccuped.
        }

        generateSitemap({
          hostname: 'https://asyaikhoni.abuamar.online',
          dynamicRoutes: slugs.map((s) => `/amalan/${s}`),
          exclude: ['/amalan/koleksi'],
        })
      },
    },
  }
})