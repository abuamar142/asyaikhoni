<template>
  <section id="facilities" class="section-padding bg-white">
    <div class="container-custom">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-block mb-4">
          <span class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            Fasilitas Pondok
          </span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          <span class="text-green-800">Fasilitas Lengkap</span> untuk Kenyamanan Belajar
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Kami menyediakan berbagai fasilitas yang mendukung kegiatan belajar mengajar dan kehidupan
          sehari-hari santri di pondok pesantren.
        </p>
      </div>

      <!-- Facilities Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div
          v-for="(facility, index) in pondokData.facilities"
          :key="facility.id"
          class="group cursor-pointer"
          :class="index % 3 === 0 ? 'slide-up' : index % 3 === 1 ? 'fade-in' : 'slide-up'"
        >
          <div
            class="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-2"
          >
            <!-- Image/Icon Area -->
            <div
              class="relative h-48 bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center"
            >
              <div class="absolute inset-0 islamic-pattern opacity-5"></div>
              <div
                class="relative z-10 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <component :is="getIconComponent(facility.icon)" class="w-10 h-10 text-green-600" />
              </div>

              <!-- Decorative Elements -->
              <div
                class="absolute top-4 right-4 w-6 h-6 bg-yellow-400 rounded-full opacity-40 float"
              ></div>
              <div
                class="absolute bottom-4 left-4 w-4 h-4 bg-green-400 rounded-full opacity-50"
                style="animation: float 3s ease-in-out infinite 1s"
              ></div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <h3
                class="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-800 transition-colors"
              >
                {{ facility.name }}
              </h3>
              <p class="text-gray-600 leading-relaxed">
                {{ facility.description }}
              </p>
            </div>

            <!-- Hover Effect Border -->
            <div
              class="absolute inset-0 border-2 border-transparent group-hover:border-green-200 rounded-2xl transition-colors duration-300"
            ></div>
          </div>
        </div>
      </div>

      <!-- Features Highlight -->
      <div
        class="bg-gradient-to-r from-green-50 via-white to-yellow-50 rounded-2xl shadow-lg overflow-hidden"
      >
        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <!-- Content -->
          <div class="p-8 lg:p-12">
            <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Lingkungan <span class="text-green-800">Bersih, Asri</span> & Nyaman
            </h3>

            <div class="space-y-4 mb-8">
              <div
                v-for="highlight in facilityHighlights"
                :key="highlight.id"
                class="flex items-start space-x-4"
              >
                <div
                  class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ highlight.title }}</h4>
                  <p class="text-gray-600 text-sm">{{ highlight.description }}</p>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                @click="scrollToSection('contact')"
                class="btn-primary text-center"
              >
                Kunjungi Pondok
              </a>
              <a
                :href="pondokData.contact.maps"
                target="_blank"
                class="btn-secondary text-center inline-flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  />
                </svg>
                Lihat Lokasi
              </a>
            </div>
          </div>

          <!-- Visual Area -->
          <div class="p-8 lg:p-12">
            <div class="relative">
              <!-- Main Visual -->
              <div
                class="w-full h-80 bg-gradient-to-br from-green-100 to-yellow-100 rounded-2xl shadow-lg overflow-hidden relative"
              >
                <div class="absolute inset-0 islamic-pattern opacity-10"></div>

                <!-- Central Icon -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center"
                  >
                    <svg class="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.2L18.8 12H17v6H7v-6H5.2L12 5.2zM9 13h6v5H9v-5z"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Floating Elements -->
                <div
                  class="absolute top-8 left-8 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center float"
                >
                  <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                    />
                  </svg>
                </div>

                <div
                  class="absolute top-8 right-8 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center"
                  style="animation: float 3s ease-in-out infinite 1s"
                >
                  <svg class="w-5 h-5 text-green-800" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    />
                  </svg>
                </div>

                <div
                  class="absolute bottom-8 left-8 w-14 h-10 bg-green-400 rounded-lg flex items-center justify-center"
                  style="animation: float 3s ease-in-out infinite 2s"
                >
                  <span class="text-white font-bold text-xs">24/7</span>
                </div>

                <div
                  class="absolute bottom-8 right-8 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center"
                  style="animation: float 3s ease-in-out infinite 0.5s"
                >
                  <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Home, Building, BookOpen, Utensils, Car, Wifi, Shield, Dumbbell } from 'lucide-vue-next'
import { pondokData } from '@/data/pondokData'
import type { Component } from 'vue'

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: Component } = {
    home: Home,
    mosque: Building,
    library: BookOpen,
    book: BookOpen,
    sports: Dumbbell,
    restaurant: Utensils,
    car: Car,
    wifi: Wifi,
    shield: Shield,
  }
  return iconMap[iconName] || Home
}

const facilityHighlights = [
  {
    id: 1,
    title: 'Kebersihan Terjaga',
    description: 'Lingkungan pondok selalu bersih dan terawat untuk kenyamanan santri',
  },
  {
    id: 2,
    title: 'Keamanan 24 Jam',
    description: 'Sistem keamanan yang baik untuk menjamin keselamatan santri',
  },
  {
    id: 3,
    title: 'Suasana Tenang',
    description: 'Lokasi yang tenang dan kondusif untuk konsentrasi belajar',
  },
  {
    id: 4,
    title: 'Fasilitas Modern',
    description: 'Dilengkapi dengan fasilitas modern yang mendukung kegiatan santri',
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
