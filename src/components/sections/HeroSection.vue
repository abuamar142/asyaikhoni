<template>
  <section
    id="home"
    class="relative min-h-screen flex items-center gradient-bg islamic-pattern overflow-hidden"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 float"
      ></div>
      <div
        class="absolute top-40 right-20 w-16 h-16 bg-yellow-200 rounded-full opacity-30"
        style="animation: float 3s ease-in-out infinite 1s"
      ></div>
      <div
        class="absolute bottom-20 left-1/4 w-12 h-12 bg-green-300 rounded-full opacity-25"
        style="animation: float 3s ease-in-out infinite 2s"
      ></div>
    </div>

    <div class="container-custom section-padding relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="space-y-8 fade-in">
          <!-- Arabic Calligraphy -->
          <div class="text-center lg:text-left">
            <p class="text-3xl md:text-4xl font-arabic text-green-800 mb-4">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>

          <!-- Main Heading -->
          <div class="space-y-4">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span class="text-green-800">Pondok Pesantren</span><br />
              <span class="text-yellow-600">Tahfidzul Qur'an</span><br />
              <span
                class="bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent"
              >
                Asy-Syaikhoni
              </span>
            </h1>

            <p class="text-xl md:text-2xl text-gray-600 font-medium">
              {{ pondokData.tagline }}
            </p>

            <p class="text-lg text-gray-500 max-w-2xl">
              {{ pondokData.description }}
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="#about" @click="scrollToSection('about')" class="btn-primary text-center">
              Pelajari Lebih Lanjut
            </a>
            <a
              href="#contact"
              @click="scrollToSection('contact')"
              class="btn-secondary text-center"
            >
              Daftar Sekarang
            </a>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
            <div v-for="stat in pondokData.stats" :key="stat.id" class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-green-800">{{ stat.number }}</div>
              <div class="text-sm text-gray-600">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Hero Image/Visual -->
        <div class="relative slide-up">
          <div class="relative">
            <!-- Main Image Container -->
            <div
              class="w-full h-96 lg:h-[500px] bg-gradient-to-br from-green-50 to-yellow-50 rounded-3xl shadow-2xl overflow-hidden relative"
            >
              <!-- Islamic Pattern Overlay -->
              <div class="absolute inset-0 islamic-pattern opacity-10"></div>

              <!-- Mosque Silhouette -->
              <div class="absolute inset-0 flex items-center justify-center">
                <Building class="w-64 h-64 text-green-700 opacity-20" />
              </div>

              <!-- Decorative Elements -->
              <div
                class="absolute top-6 left-6 w-8 h-8 bg-yellow-400 rounded-full opacity-60"
              ></div>
              <div
                class="absolute top-12 right-8 w-6 h-6 bg-green-400 rounded-full opacity-40"
              ></div>
              <div
                class="absolute bottom-8 left-8 w-10 h-10 bg-yellow-300 rounded-full opacity-50"
              ></div>
              <div
                class="absolute bottom-6 right-6 w-4 h-4 bg-green-500 rounded-full opacity-30"
              ></div>

              <!-- Quran Icon -->
              <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div
                  class="w-16 h-16 bg-green-700 rounded-lg flex items-center justify-center shadow-lg"
                >
                  <Play class="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <!-- Floating Cards -->
            <div
              class="absolute -top-4 -left-4 w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center float"
            >
              <Users class="w-8 h-8 text-green-600" />
            </div>

            <div
              class="absolute -bottom-4 -right-4 w-24 h-16 bg-yellow-400 rounded-xl shadow-lg flex items-center justify-center"
              style="animation: float 3s ease-in-out infinite 1.5s"
            >
              <span class="text-green-800 font-bold text-lg">قرآن</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <ChevronDown class="w-6 h-6 text-green-700" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Play, Users, ChevronDown, Building } from 'lucide-vue-next'
import { pondokData } from '@/data/pondokData'

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 64
    const elementPosition = element.offsetTop - headerHeight
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}
</script>
