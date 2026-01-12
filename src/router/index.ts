import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Sejarah from '@/views/Sejarah.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: "PPTQ Asy-Syaikhoni | Pondok Pesantren Tahfidzul Qur'an",
        description:
          "Pondok Pesantren Tahfidzul Qur'an Asy-Syaikhoni - Pusat pendidikan Islam terpercaya dengan program tahfidz Al-Qur'an berkualitas",
      },
    },
    {
      path: '/sejarah',
      name: 'sejarah',
      component: Sejarah,
      meta: {
        title: "Sejarah - PPTQ Asy-Syaikhoni | Pondok Pesantren Tahfidzul Qur'an",
        description:
          'Sejarah dan perjalanan PPTQ Asy-Syaikhoni dari tahun 2008 hingga sekarang, visi misi, dan para pendiri pesantren',
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
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = (to.meta.title as string) || 'PPTQ Asy-Syaikhoni'

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && to.meta.description) {
    metaDescription.setAttribute('content', to.meta.description as string)
  }

  // Loading state (optional) - bisa ditambahkan jika diperlukan
  // console.log(`Navigating from ${from.path} to ${to.path}`)

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
