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
                <svg
                  class="w-64 h-64 text-green-700 opacity-20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C10.9 2 10 2.9 10 4V6H8C6.9 6 6 6.9 6 8V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V8C18 6.9 17.1 6 16 6H14V4C14 2.9 13.1 2 12 2M12 4C12 4 12 4 12 4V6H12V4M8 8H16V20H8V8M10 10V18H12V10H10M14 10V18H16V14H14V10Z"
                  />
                </svg>
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
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.2L18.8 12H17v6H7v-6H5.2L12 5.2zM9 13h6v5H9v-5z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Floating Cards -->
            <div
              class="absolute -top-4 -left-4 w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center float"
            >
              <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.2L18.8 12H17v6H7v-6H5.2L12 5.2z" />
              </svg>
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
      <svg class="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
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
