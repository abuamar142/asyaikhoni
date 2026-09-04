import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

// Routes are exported separately so vite-ssg (main.ts) can reuse the array.
export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: "PPTQ Asy-Syaikhoni | Pondok Pesantren Tahfidzul Qur'an",
      description:
        "Pondok Pesantren Tahfidzul Qur'an Asy-Syaikhoni - Pusat pendidikan Islam terpercaya dengan program tahfidz Al-Qur'an berkualitas",
    },
  },
  {
    path: '/sejarah',
    name: 'sejarah',
    component: () => import('@/views/Sejarah.vue'),
    meta: {
      title: "Sejarah - PPTQ Asy-Syaikhoni | Pondok Pesantren Tahfidzul Qur'an",
      description:
        'Sejarah dan perjalanan PPTQ Asy-Syaikhoni dari tahun 2008 hingga sekarang, visi misi, dan para pendiri pesantren',
    },
  },
  {
    path: '/amalan',
    name: 'amalan-list',
    component: () => import('@/views/AmalanList.vue'),
    meta: {
      title: 'Amalan - PPTQ Asy-Syaikhoni',
      description: 'Daftar amalan (tahlil, doa, dll) yang aktif di PPTQ Asy-Syaikhoni',
    },
  },
  {
    path: '/amalan/koleksi',
    name: 'amalan-offline',
    component: () => import('@/views/AmalanOffline.vue'),
    meta: {
      title: 'Koleksi Saya - PPTQ Asy-Syaikhoni',
      description: 'Kelola amalan yang telah Anda simpan untuk akses offline',
    },
  },
  {
    path: '/amalan/share/:share_id',
    name: 'amalan-share',
    component: () => import('@/views/AmalanSharePreview.vue'),
    meta: {
      title: 'Koleksi Dibagikan - PPTQ Asy-Syaikhoni',
      description: 'Lihat dan impor koleksi amalan yang dibagikan',
    },
  },
  {
    path: '/amalan/:slug',
    name: 'amalan-detail',
    component: () => import('@/views/AmalanDetail.vue'),
    meta: {
      title: 'Detail Amalan - PPTQ Asy-Syaikhoni',
      description: 'Konten amalan dalam format Markdown',
    },
  },
  // Redirect any unknown routes to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  // SSR/prerender has no window — vue-router memory history is required there.
  history: import.meta.env.SSR
    ? createMemoryHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // Kembali ke posisi scroll sebelumnya (browser back/forward)
      return savedPosition
    } else if (to.hash) {
      // Scroll ke section berdasarkan hash dengan offset untuk header
      return new Promise((resolve) => {
        // Tunggu sebentar untuk memastikan DOM sudah ter-render
        setTimeout(() => {
          const element = document.querySelector(to.hash)
          if (element) {
            resolve({
              el: to.hash,
              behavior: 'smooth',
              top: 64,
            })
          } else {
            resolve({ top: 0, behavior: 'smooth' })
          }
        }, 100)
      })
    } else {
      // Default scroll ke top dengan smooth behavior
      return { top: 0, behavior: 'smooth' }
    }
  },
})

// Middleware setelah navigasi selesai
router.afterEach((to, from) => {
  // Scroll to top jika bukan navigation dengan hash.
  // window guard: afterEach fires during vite-ssg prerender too, where window is undefined.
  if (!to.hash && to.path === from.path && typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

export default router
