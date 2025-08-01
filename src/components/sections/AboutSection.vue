<template>
  <section id="about" class="section-padding bg-white">
    <div class="container-custom">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Image Section -->
        <div class="relative">
          <div
            class="relative w-full h-96 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl overflow-hidden shadow-xl"
          >
            <!-- Islamic Pattern -->
            <div class="absolute inset-0 islamic-pattern opacity-10"></div>

            <!-- Content -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center space-y-4">
                <div
                  class="w-24 h-24 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"
                    />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-green-800">15+ Tahun</h3>
                <p class="text-gray-600">Pengalaman Mendidik</p>
              </div>
            </div>

            <!-- Decorative Elements -->
            <div
              class="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60 float"
            ></div>
            <div
              class="absolute bottom-4 left-4 w-6 h-6 bg-green-400 rounded-full opacity-50"
              style="animation: float 3s ease-in-out infinite 1s"
            ></div>
          </div>

          <!-- Floating Achievement Cards -->
          <div class="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 float">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-green-800">Rating 5.0</p>
                <p class="text-xs text-gray-500">6 Reviews</p>
              </div>
            </div>
          </div>

          <div
            class="absolute -bottom-6 -right-6 bg-yellow-400 rounded-xl shadow-lg p-4"
            style="animation: float 3s ease-in-out infinite 2s"
          >
            <div class="text-center">
              <p class="font-bold text-green-800 text-lg">100+</p>
              <p class="text-xs text-green-700">Santri Aktif</p>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="space-y-6">
          <!-- Section Header -->
          <div class="space-y-4">
            <div class="inline-block">
              <span
                class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold"
              >
                Tentang Kami
              </span>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
              <span class="text-green-800">Pondok Pesantren</span> yang Berkualitas dan
              Berpengalaman
            </h2>
            <p class="text-lg text-gray-600">
              Kami berkomitmen mencetak generasi Qur'ani yang berakhlak mulia dengan metode
              pembelajaran yang efektif dan lingkungan yang kondusif.
            </p>
          </div>

          <!-- Key Features -->
          <div class="space-y-4">
            <div
              v-for="feature in aboutFeatures"
              :key="feature.id"
              class="flex items-start space-x-4 p-4 rounded-lg hover:bg-green-50 transition-colors duration-200"
            >
              <div
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">{{ feature.title }}</h4>
                <p class="text-gray-600">{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div
            class="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-xl border border-green-100"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Lokasi Pondok</h4>
                <p class="text-gray-600 mb-3">{{ pondokData.contact.address }}</p>
                <a
                  :href="pondokData.contact.maps"
                  target="_blank"
                  class="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
                >
                  <span>Lihat di Google Maps</span>
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div>
            <a
              href="#programs"
              @click="scrollToSection('programs')"
              class="btn-primary inline-flex items-center"
            >
              <span>Lihat Program Kami</span>
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { pondokData } from '@/data/pondokData'

const aboutFeatures = [
  {
    id: 1,
    title: 'Lingkungan Bersih & Asri',
    description: "Suasana pondok yang nyaman dan kondusif untuk belajar Al-Qur'an",
  },
  {
    id: 2,
    title: 'Metode Pembelajaran Efektif',
    description: 'Sistem tahfidz yang terbukti berhasil dengan bimbingan intensif',
  },
  {
    id: 3,
    title: 'Pembinaan Akhlaq',
    description: 'Fokus pada pembentukan karakter islami yang kuat dan berakhlak mulia',
  },
  {
    id: 4,
    title: 'Lokasi Strategic',
    description: 'Terletak di area yang tenang dan mudah diakses di Nganjuk, Jawa Timur',
  },
]

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
