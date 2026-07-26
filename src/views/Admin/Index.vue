<template>
  <AdminLayout>
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-50 to-white border-b border-green-100 py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-heading-xl text-brand mb-2">Dashboard</h1>
        <p class="text-body-md text-muted">Selamat datang. Pilih menu untuk mengelola konten.</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <router-link
          :to="{ name: 'admin-amalan' }"
          class="block p-6 border border-green-100 rounded-lg hover:shadow-md hover:border-primary-300 transition-all duration-300 bg-white"
        >
          <h2 class="text-heading-md text-brand mb-2 font-semibold">Amalan</h2>
          <p class="text-body-sm text-muted">
            Tambah, ubah, hapus, dan toggle status amalan dengan mudah.
          </p>
        </router-link>
        <router-link
          :to="{ name: 'admin-kategori' }"
          class="block p-6 border border-green-100 rounded-lg hover:shadow-md hover:border-primary-300 transition-all duration-300 bg-white"
        >
          <h2 class="text-heading-md text-brand mb-2 font-semibold">Kategori</h2>
          <p class="text-body-sm text-muted">Kelola kategori amalan yang tersedia di pondok.</p>
        </router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/admin/AdminLayout.vue'

defineOptions({
  name: 'AdminIndexPage',
})
</script>
