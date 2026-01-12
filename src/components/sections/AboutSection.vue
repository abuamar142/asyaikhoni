<template>
  <section id="about" class="section-padding bg-white">
    <div class="container-custom">
      <!-- Section Header - Centered -->
      <div class="text-center mb-16">
        <div class="inline-block mb-4">
          <span class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            Tentang Kami
          </span>
        </div>
        <h2 class="text-display-sm mb-6">
          <span class="text-brand">{{ pondokData.name }}</span> yang Berkualitas dan Berpengalaman
        </h2>
        <p class="text-body-lg text-muted mx-auto max-w-3xl">
          {{ pondokData.description }}
        </p>
      </div>

      <!-- Main Content Grid -->
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Image Section -->
        <div class="relative">
          <div
            class="relative w-full h-96 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl overflow-hidden shadow-xl"
          >
            <!-- Islamic Pattern -->
            <div class="absolute inset-0 islamic-pattern opacity-10"></div>

            <!-- Main Visual Content -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center space-y-6">
                <div
                  class="w-24 h-24 bg-green-700 rounded-full flex items-center justify-center mx-auto"
                >
                  <User class="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 class="text-heading-xl text-brand mb-2">Pendidikan Berkualitas</h3>
                  <p class="text-body-md text-muted max-w-xs mx-auto">
                    Dengan pengalaman 15+ tahun dalam mendidik generasi Qur'ani
                  </p>
                </div>
              </div>
            </div>

            <!-- Decorative Elements -->
            <div
              class="absolute top-6 right-6 w-8 h-8 bg-yellow-400 rounded-full opacity-60 float"
            ></div>
            <div
              class="absolute bottom-6 left-6 w-6 h-6 bg-green-400 rounded-full opacity-50"
              style="animation: float 3s ease-in-out infinite 1s"
            ></div>
            <div
              class="absolute top-1/3 left-6 w-4 h-4 bg-yellow-300 rounded-full opacity-40"
              style="animation: float 3s ease-in-out infinite 2s"
            ></div>
          </div>

          <!-- Floating Achievement Card - Simplified -->
          <div
            class="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 float border-2 border-green-100"
          >
            <div class="text-center">
              <div
                class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2"
              >
                <Star class="w-5 h-5 text-white" />
              </div>
              <p class="text-heading-sm text-brand">Terpercaya</p>
              <p class="text-caption text-muted">15+ Tahun</p>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="space-y-8">
          <!-- Key Features -->
          <div class="space-y-6">
            <h3 class="text-heading-lg text-center lg:text-left mb-6">Keunggulan Kami</h3>
            <div class="space-y-4">
              <div
                v-for="feature in aboutFeatures"
                :key="feature.id"
                class="flex flex-col lg:flex-row lg:items-start items-center lg:text-left text-center space-y-3 lg:space-y-0 lg:space-x-4 p-4 rounded-lg hover:bg-green-50 transition-colors duration-200"
              >
                <div
                  class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <CheckCircle class="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 class="text-heading-sm mb-2">{{ feature.title }}</h4>
                  <p class="text-body-sm text-muted">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div
            class="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-xl border border-green-100"
          >
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-6 text-center">
              <div>
                <div class="text-heading-xl text-brand mb-1">15+</div>
                <div class="text-body-sm text-muted">Tahun Pengalaman</div>
              </div>
              <div>
                <div class="text-heading-xl text-brand mb-1">100+</div>
                <div class="text-body-sm text-muted">Santri Aktif</div>
              </div>
              <div class="col-span-2 lg:col-span-1">
                <div class="text-heading-xl text-brand mb-1">5.0</div>
                <div class="text-body-sm text-muted">Rating Kepuasan</div>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div
            class="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-xl border border-green-100"
          >
            <div
              class="flex flex-col lg:flex-row lg:items-start items-center lg:text-left text-center space-y-3 lg:space-y-0 lg:space-x-4"
            >
              <div
                class="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center flex-shrink-0"
              >
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

          <!-- CTA Buttons -->
          <div class="text-center lg:text-left space-y-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <a
                href="#programs"
                @click.prevent="scrollToSection('programs')"
                class="btn-primary inline-flex items-center justify-center"
              >
                <span>Lihat Program Kami</span>
                <ArrowRight class="w-5 h-5 ml-2" />
              </a>
              <button
                @click="navigateToSejarah"
                class="btn-secondary inline-flex items-center justify-center"
              >
                <span>Sejarah Pondok</span>
                <BookOpen class="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { pondokData } from '@/data/pondokData'
import { scrollToSection } from '@/utils/navigation'
import {
  User,
  Star,
  CheckCircle,
  MapPin,
  ExternalLink,
  ArrowRight,
  BookOpen,
} from 'lucide-vue-next'

const router = useRouter()

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

const navigateToSejarah = () => {
  router.push('/sejarah')
}
</script>
