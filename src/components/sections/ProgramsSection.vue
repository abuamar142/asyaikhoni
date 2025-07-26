<template>
  <section id="programs" class="section-padding gradient-bg islamic-pattern">
    <div class="container-custom">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-block mb-4">
          <span
            class="bg-white/80 text-green-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
          >
            Program Unggulan
          </span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Program <span class="text-green-800">Pendidikan</span> yang Komprehensif
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Kami menyediakan berbagai program pendidikan Islam yang dirancang untuk mengembangkan
          kemampuan spiritual, intelektual, dan karakter santri.
        </p>
      </div>

      <!-- Programs Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
        <div
          v-for="(program, index) in pondokData.programs"
          :key="program.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
          :class="index % 2 === 0 ? 'slide-up' : 'fade-in'"
        >
          <!-- Card Header -->
          <div class="p-6 pb-4">
            <div class="flex items-center space-x-4 mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
              >
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    v-if="program.icon === 'book-open'"
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                  />
                  <path
                    v-else-if="program.icon === 'academic-cap'"
                    d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6z"
                  />
                  <path
                    v-else-if="program.icon === 'heart'"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                  <path
                    v-else-if="program.icon === 'users'"
                    d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7c-.8 0-1.54.37-2.01.97L12 11.5l-3.05-3.53A2.996 2.996 0 0 0 6.94 7c-1.05 0-1.99.54-2.54 1.37L1.5 16H4v6h3v-6h2v6h3v-6h2v6h4z"
                  />
                  <path
                    v-else
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  class="text-xl font-bold text-gray-900 group-hover:text-green-800 transition-colors"
                >
                  {{ program.title }}
                </h3>
              </div>
            </div>

            <p class="text-gray-600 mb-6">
              {{ program.description }}
            </p>

            <!-- Features List -->
            <div class="space-y-3">
              <h4 class="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                Program Meliputi:
              </h4>
              <div class="grid grid-cols-1 gap-2">
                <div
                  v-for="feature in program.features"
                  :key="feature"
                  class="flex items-center space-x-3"
                >
                  <div
                    class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span class="text-gray-700">{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="px-6 pb-6">
            <div class="border-t border-gray-100 pt-4">
              <button
                class="w-full bg-green-50 hover:bg-green-100 text-green-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 group-hover:bg-green-700 group-hover:text-white"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Info Section -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
        <div class="grid lg:grid-cols-3 gap-8 items-center">
          <!-- Info Content -->
          <div class="lg:col-span-2 space-y-4">
            <h3 class="text-2xl font-bold text-gray-900">
              Metode Pembelajaran <span class="text-green-800">Modern & Efektif</span>
            </h3>
            <p class="text-gray-600">
              Kami menggunakan metode pembelajaran yang telah terbukti efektif dalam menghafal
              Al-Qur'an, dengan bimbingan yang intensif dan personal dari para ustadz yang
              berpengalaman.
            </p>
            <div class="flex flex-wrap gap-3">
              <span
                v-for="method in teachingMethods"
                :key="method"
                class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ method }}
              </span>
            </div>
          </div>

          <!-- CTA Section -->
          <div class="text-center lg:text-right">
            <div class="space-y-4">
              <div class="text-3xl font-bold text-green-800">24/7</div>
              <div class="text-gray-600">Bimbingan Tersedia</div>
              <a
                href="#contact"
                @click="scrollToSection('contact')"
                class="btn-primary inline-block"
              >
                Konsultasi Gratis
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { pondokData } from '@/data/pondokData'

const teachingMethods = [
  'Talaqqi Langsung',
  "Sistem Muraja'ah",
  'Bimbingan Personal',
  'Evaluasi Berkala',
  'Metode Visual',
  'Audio Learning',
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
