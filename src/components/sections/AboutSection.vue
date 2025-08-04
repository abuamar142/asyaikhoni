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
                  <User class="w-12 h-12 text-white" />
                </div>
                <h3 class="text-heading-lg text-brand">15+ Tahun</h3>
                <p class="text-body-sm text-muted">Pengalaman Mendidik</p>
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
                <Star class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-heading-sm text-brand">Rating 5.0</p>
                <p class="text-caption text-muted">6 Reviews</p>
              </div>
            </div>
          </div>

          <div
            class="absolute -bottom-6 -right-6 bg-yellow-400 rounded-xl shadow-lg p-4"
            style="animation: float 3s ease-in-out infinite 2s"
          >
            <div class="text-center">
              <p class="text-heading-sm text-brand">100+</p>
              <p class="text-caption text-brand">Santri Aktif</p>
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
            <h2 class="text-display-sm">
              <span class="text-brand">{{ pondokData.name }}</span> yang Berkualitas dan
              Berpengalaman
            </h2>
            <p class="text-body-lg text-muted">
              {{ pondokData.description }}
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
                <CheckCircle class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 class="text-heading-sm">{{ feature.title }}</h4>
                <p class="text-body-sm text-muted">{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div
            class="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-xl border border-green-100"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">
                <MapPin class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="text-heading-sm mb-2">Lokasi Pondok</h4>
                <p class="text-body-sm text-muted mb-3">{{ pondokData.contact.address }}</p>
                <a
                  :href="pondokData.contact.maps"
                  target="_blank"
                  class="inline-flex items-center text-brand hover:text-green-800 font-medium"
                >
                  <span>Lihat di Google Maps</span>
                  <ExternalLink class="w-4 h-4 ml-1" />
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
              <ArrowRight class="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { pondokData } from '@/data/pondokData'
import { User, Star, CheckCircle, MapPin, ExternalLink, ArrowRight } from 'lucide-vue-next'

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
