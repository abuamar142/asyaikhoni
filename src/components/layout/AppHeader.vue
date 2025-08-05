<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm transition-all duration-300"
    :class="{ 'shadow-lg': isMobileMenuOpen }"
  >
    <nav class="container-custom">
      <div class="flex items-center justify-between h-16 px-4">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center">
            <img
              src="/logo.svg"
              :alt="`${pondokData.shortName} Logo`"
              class="w-10 h-10 object-contain"
            />
          </div>
          <div class="hidden sm:block">
            <h1 class="text-heading-lg text-brand">
              {{ pondokData.shortName.split(' ')[0] }}
            </h1>
            <p class="text-caption text-brand -mt-1">
              {{ pondokData.shortName.split(' ').slice(1).join(' ') }}
            </p>
          </div>
        </div>

        <!-- Navigation Menu (Desktop) -->
        <div class="hidden lg:flex items-center space-x-8">
          <a
            v-for="item in navigationMenu"
            :key="item.id"
            :href="item.href"
            @click.prevent="handleNavigation(item)"
            class="text-body-md text-muted hover:text-brand font-medium transition-all duration-200 relative group"
          >
            {{ item.name }}
            <span
              class="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"
            ></span>
          </a>
        </div>

        <!-- CTA Button (Desktop) -->
        <div class="hidden lg:block">
          <a
            href="#contact"
            @click="handleNavigation({ name: 'Kontak', href: '#contact', id: 'contact' })"
            class="btn-primary"
          >
            Daftar Sekarang
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="lg:hidden relative p-3 rounded-xl hover:bg-green-50 active:bg-green-100 transition-all duration-200 transform active:scale-95"
          :class="{
            'bg-green-50 shadow-sm': isMobileMenuOpen,
            'hover:shadow-md': !isMobileMenuOpen,
          }"
          aria-label="Toggle mobile menu"
        >
          <div class="relative w-6 h-6 flex items-center justify-center">
            <!-- Hamburger Icon with Animation -->
            <span
              class="absolute w-6 h-0.5 bg-green-700 rounded-full transition-all duration-300 ease-in-out transform origin-center"
              :class="{
                'rotate-45 translate-y-0': isMobileMenuOpen,
                'rotate-0 -translate-y-2': !isMobileMenuOpen,
              }"
            ></span>
            <span
              class="absolute w-6 h-0.5 bg-green-700 rounded-full transition-all duration-300 ease-in-out transform"
              :class="{
                'opacity-0 scale-0': isMobileMenuOpen,
                'opacity-100 scale-100': !isMobileMenuOpen,
              }"
            ></span>
            <span
              class="absolute w-6 h-0.5 bg-green-700 rounded-full transition-all duration-300 ease-in-out transform origin-center"
              :class="{
                '-rotate-45 translate-y-0': isMobileMenuOpen,
                'rotate-0 translate-y-2': !isMobileMenuOpen,
              }"
            ></span>
          </div>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-show="isMobileMenuOpen"
        class="lg:hidden border-t border-green-100 bg-white/95 backdrop-blur-sm shadow-lg"
      >
        <div class="px-4 py-6 space-y-1">
          <a
            v-for="item in navigationMenu"
            :key="item.id"
            :href="item.href"
            @click.prevent="(handleNavigation(item), closeMobileMenu())"
            class="flex items-center py-3 px-4 text-body-md text-muted hover:text-brand hover:bg-green-50 font-medium transition-all duration-200 rounded-lg group"
          >
            <span class="relative">
              {{ item.name }}
              <span
                class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"
              ></span>
            </span>
          </a>

          <!-- Mobile CTA Button -->
          <div class="pt-4 mt-4 border-t border-green-100">
            <a
              href="#contact"
              @click="
                (handleNavigation({ name: 'Kontak', href: '#contact', id: 'contact' }),
                closeMobileMenu())
              "
              class="btn-primary w-full text-center block py-3 transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { navigationMenu, pondokData } from '@/data/pondokData'
import { handleCrossRouteNavigation } from '@/utils/navigation'

const router = useRouter()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleNavigation = (item: { name: string; href: string; id: string }) => {
  // Tutup mobile menu terlebih dahulu
  isMobileMenuOpen.value = false

  // Gunakan utility function untuk cross-route navigation
  handleCrossRouteNavigation(router, item)
} // Close mobile menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('header') && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
