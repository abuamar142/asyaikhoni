<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm"
  >
    <nav class="container-custom">
      <div class="flex items-center justify-between h-16 px-4">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center"
          >
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.2L18.8 12H17v6H7v-6H5.2L12 5.2zM9 13h6v5H9v-5z"
              />
            </svg>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-green-800">PPTQ</h1>
            <p class="text-xs text-green-600 -mt-1">Asy-Syaikhoni</p>
          </div>
        </div>

        <!-- Navigation Menu (Desktop) -->
        <div class="hidden lg:flex items-center space-x-8">
          <a
            v-for="item in navigationMenu"
            :key="item.id"
            :href="item.href"
            @click="scrollToSection(item.id)"
            class="text-gray-600 hover:text-green-700 font-medium transition-colors duration-200 relative group"
          >
            {{ item.name }}
            <span
              class="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"
            ></span>
          </a>
        </div>

        <!-- CTA Button (Desktop) -->
        <div class="hidden lg:block">
          <a href="#contact" @click="scrollToSection('contact')" class="btn-primary">
            Daftar Sekarang
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-gray-100': isMobileMenuOpen }"
        >
          <svg
            v-if="!isMobileMenuOpen"
            class="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="lg:hidden border-t border-gray-100 bg-white">
        <div class="px-4 py-4 space-y-3">
          <a
            v-for="item in navigationMenu"
            :key="item.id"
            :href="item.href"
            @click="(scrollToSection(item.id), closeMobileMenu())"
            class="block py-2 text-gray-600 hover:text-green-700 font-medium transition-colors duration-200"
          >
            {{ item.name }}
          </a>
          <div class="pt-3 border-t border-gray-100">
            <a
              href="#contact"
              @click="(scrollToSection('contact'), closeMobileMenu())"
              class="btn-primary w-full text-center block"
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
import { navigationMenu } from '@/data/pondokData'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 64 // header height
    const elementPosition = element.offsetTop - headerHeight
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}

// Close mobile menu when clicking outside
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
