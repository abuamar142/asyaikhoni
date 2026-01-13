<template>
  <div class="min-h-screen bg-white flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-primary-900 text-white w-64 flex-shrink-0 border-r border-primary-800 flex flex-col',
        open ? 'flex' : 'hidden md:flex',
      ]"
    >
      <div
        class="px-4 py-5 border-b border-primary-800 flex items-center justify-between md:block bg-gradient-to-r from-primary-800 via-primary-900 to-primary-800"
      >
        <div class="space-y-1">
          <p class="text-caption text-primary-200 uppercase tracking-[0.2em]">Admin Panel</p>
          <p class="text-body-lg font-semibold text-white">PPTQ Asy-Syaikhoni</p>
        </div>
        <button
          class="md:hidden text-white/80 hover:text-white"
          aria-label="Tutup menu"
          @click="toggle"
        >
          ✕
        </button>
      </div>

      <nav class="py-4">
        <RouterLink
          v-for="item in navItems"
          :key="item.to.name"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 text-body-md hover:bg-primary-800"
          :class="{ 'bg-primary-800 font-semibold': route.name === item.to.name }"
        >
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="mt-auto px-4 py-4 border-t border-primary-800">
        <BaseButton block variant="danger" @click="onLogout">Logout</BaseButton>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col">
      <header
        class="md:hidden bg-white border-b border-green-100 px-4 py-3 flex items-center justify-between"
      >
        <button class="text-primary-700 font-semibold" aria-label="Buka menu" @click="toggle">
          ☰ Menu
        </button>
      </header>
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import * as authService from '@/services/authService'

const route = useRoute()
const router = useRouter()
const open = ref(false)

const navItems = [
  { label: 'Dashboard', to: { name: 'admin-index' } },
  { label: 'Kelola Amalan', to: { name: 'admin-amalan-list' } },
  { label: 'Kategori', to: { name: 'admin-kategori' } },
]

function toggle() {
  open.value = !open.value
}

async function onLogout() {
  await authService.logout()
  router.push({ name: 'admin-login' })
}
</script>
