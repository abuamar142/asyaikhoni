<template>
  <div class="min-h-screen h-screen bg-white flex overflow-hidden">
    <div
      v-if="open"
      class="fixed inset-0 bg-white z-30 md:hidden"
      aria-hidden="true"
      @click="toggle"
    />
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-primary-900 text-white w-64 flex-shrink-0 border-r border-[#e5e7eb] flex flex-col shadow-[4px_0_14px_-10px_rgba(0,0,0,0.2)] md:static md:h-screen md:translate-x-0 fixed inset-y-0 left-0 top-0 h-screen max-h-screen z-40 transition-transform duration-200 overflow-hidden',
        open ? 'flex translate-x-0' : 'hidden md:flex -translate-x-full md:translate-x-0',
      ]"
    >
      <div class="flex flex-col h-full overflow-hidden">
        <div
          class="px-4 py-5 border-b border-[#e5e7eb] flex items-center justify-between md:block bg-gradient-to-r from-primary-800 via-primary-900 to-primary-800"
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

        <nav class="py-4 flex-1 overflow-y-auto">
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

        <div class="px-4 py-4 border-t border-[#e5e7eb]">
          <BaseButton block variant="danger" @click="showLogoutConfirm = true">Logout</BaseButton>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="md:hidden bg-white border-b border-green-100 px-4 py-3 flex items-center justify-between"
      >
        <button class="text-primary-700 font-semibold" aria-label="Buka menu" @click="toggle">
          ☰ Menu
        </button>
      </header>
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>

  <ConfirmDialog
    v-model="showLogoutConfirm"
    title="Logout"
    message="Apakah Anda yakin ingin keluar dari admin?"
    confirm-label="Logout"
    confirm-variant="danger"
    @confirm="onLogout"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import * as authService from '@/services/authService'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const open = ref(false)
const showLogoutConfirm = ref(false)
const { showToast } = useToast()

const navItems = [
  { label: 'Dashboard', to: { name: 'admin-index' } },
  { label: 'Amalan', to: { name: 'admin-amalan' } },
  { label: 'Kategori', to: { name: 'admin-kategori' } },
]

function toggle() {
  open.value = !open.value
}

async function onLogout() {
  try {
    await authService.logout()
    showToast({ type: 'success', title: 'Logout', message: 'Anda telah keluar.' })
    router.push({ name: 'admin-login' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal logout'
    showToast({ type: 'error', title: 'Gagal logout', message })
  }
}
</script>
