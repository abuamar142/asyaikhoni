import { createRouter, createWebHistory } from 'vue-router'
import { getSession, isAdmin } from '@/services/authService'

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
        description: 'Konten amalan dalam format Markdown dari Supabase Storage',
      },
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/Admin/Login.vue'),
      meta: {
        title: 'Admin Login - PPTQ Asy-Syaikhoni',
        description: 'Masuk sebagai admin untuk mengelola amalan',
      },
    },
    {
      path: '/admin',
      name: 'admin-index',
      component: () => import('@/views/Admin/Index.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin - Dashboard' },
    },
    {
      path: '/admin/amalan',
      name: 'admin-amalan',
      component: () => import('@/views/Admin/AmalanList.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin - Amalan' },
    },
    {
      path: '/admin/kategori',
      name: 'admin-kategori',
      component: () => import('@/views/Admin/CategoryList.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin - Kategori' },
    },
    {
      path: '/admin/amalan/new',
      name: 'admin-amalan-new',
      component: () => import('@/views/Admin/AmalanForm.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin - Tambah Amalan' },
    },
    {
      path: '/admin/amalan/:id/edit',
      name: 'admin-amalan-edit',
      component: () => import('@/views/Admin/AmalanForm.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin - Edit Amalan' },
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

  // Loading state (optional) - bisa ditambahkan jika diperlukan
  // console.log(`Navigating from ${from.path} to ${to.path}`)

  // Auth guard
  const requiresAuth = Boolean(to.meta?.requiresAuth)
  const requiresAdmin = Boolean(to.meta?.requiresAdmin)
  if (requiresAuth || requiresAdmin) {
    const session = await getSession().catch(() => null)
    if (!session) {
      return next({ name: 'admin-login', query: { redirect: to.fullPath } })
    }
    if (requiresAdmin) {
      const admin = await isAdmin().catch(() => false)
      if (!admin) {
        return next({ name: 'home' })
      }
    }
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
