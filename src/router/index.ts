import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/amalan/:slug',
      name: 'amalan-detail',
      component: () => import('@/views/AmalanDetail.vue'),
      meta: {
        title: 'Detail Amalan - PPTQ Asy-Syaikhoni',
        description: 'Konten amalan dalam format Markdown dari Supabase Storage',
      },
    },
    // Redirect any unknown routes to home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
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

// Middleware untuk handle perpindahan halaman
router.beforeEach(async (to, from, next) => {
  // Update page title
  document.title = (to.meta.title as string) || 'PPTQ Asy-Syaikhoni'

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && to.meta.description) {
    metaDescription.setAttribute('content', to.meta.description as string)
  }

  next()
})

// Middleware setelah navigasi selesai
router.afterEach((to, from) => {
  // Scroll to top jika bukan navigation dengan hash
  if (!to.hash && to.path === from.path) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

export default router
