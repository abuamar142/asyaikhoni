<template>
  <section id="testimonials" class="section-padding gradient-bg islamic-pattern">
    <div class="container-custom">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-block mb-4">
          <span
            class="bg-white/80 text-green-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
          >
            Testimoni
          </span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Apa Kata <span class="text-green-800">Mereka</span> Tentang Kami?
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Kepuasan dan kepercayaan dari santri, alumni, dan wali santri adalah motivasi terbesar
          kami dalam terus memberikan pelayanan terbaik.
        </p>
      </div>

      <!-- Rating Summary -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-12">
        <div class="grid md:grid-cols-3 gap-8 items-center">
          <!-- Overall Rating -->
          <div class="text-center">
            <div class="text-5xl font-bold text-green-800 mb-2">5.0</div>
            <div class="flex justify-center space-x-1 mb-2">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <p class="text-gray-600">Berdasarkan 6 ulasan</p>
          </div>

          <!-- Rating Breakdown -->
          <div class="space-y-2">
            <div
              v-for="(rating, index) in ratingBreakdown"
              :key="index"
              class="flex items-center space-x-3"
            >
              <span class="text-sm text-gray-600 w-8">{{ rating.stars }}★</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  :style="{ width: rating.percentage + '%' }"
                ></div>
              </div>
              <span class="text-sm text-gray-600 w-8">{{ rating.count }}</span>
            </div>
          </div>

          <!-- Trust Indicators -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Terpercaya</p>
                <p class="text-sm text-gray-600">15+ tahun pengalaman</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Berkualitas</p>
                <p class="text-sm text-gray-600">Metode terbukti efektif</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div
          v-for="(testimonial, index) in pondokData.testimonials"
          :key="testimonial.id"
          class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
          :class="index % 3 === 0 ? 'slide-up' : index % 3 === 1 ? 'fade-in' : 'slide-up'"
        >
          <!-- Quote Icon -->
          <div class="p-6 pb-4">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
                />
              </svg>
            </div>

            <!-- Review Content -->
            <p class="text-gray-700 mb-6 leading-relaxed">"{{ testimonial.content }}"</p>

            <!-- Rating -->
            <div class="flex space-x-1 mb-4">
              <svg
                v-for="i in testimonial.rating"
                :key="i"
                class="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>

            <!-- Reviewer Info -->
            <div class="flex items-center space-x-3 pt-4 border-t border-gray-100">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center"
              >
                <span class="text-white font-semibold text-lg">
                  {{
                    testimonial.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                  }}
                </span>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
                <p class="text-sm text-gray-600">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
        <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Bergabunglah dengan <span class="text-green-800">Keluarga Besar</span> Kami
        </h3>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Menjadi bagian dari komunitas santri yang berakhlak mulia dan memiliki kemampuan menghafal
          Al-Qur'an yang baik.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" @click="scrollToSection('contact')" class="btn-primary">
            Daftar Sekarang
          </a>
          <a
            :href="pondokData.socialMedia.instagram"
            target="_blank"
            class="btn-secondary inline-flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C24.005 5.367 18.638.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348 0-1.297 1.051-2.348 2.348-2.348 1.297 0 2.348 1.051 2.348 2.348 0 1.297-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348 0-1.297 1.051-2.348 2.348-2.348 1.297 0 2.348 1.051 2.348 2.348 0 1.297-1.051 2.348-2.348 2.348z"
              />
            </svg>
            Lihat Instagram
          </a>
        </div>

        <!-- Contact Info -->
        <div class="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-100">
          <div class="flex items-center justify-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-gray-900">Hubungi Kami</p>
              <p class="text-gray-600">{{ pondokData.contact.phone }}</p>
            </div>
          </div>

          <div class="flex items-center justify-center space-x-3">
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-gray-900">Email Kami</p>
              <p class="text-gray-600">{{ pondokData.contact.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { pondokData } from '@/data/pondokData'

const ratingBreakdown = [
  { stars: 5, count: 6, percentage: 100 },
  { stars: 4, count: 0, percentage: 0 },
  { stars: 3, count: 0, percentage: 0 },
  { stars: 2, count: 0, percentage: 0 },
  { stars: 1, count: 0, percentage: 0 },
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
