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
        <h2 class="text-display-sm mb-4">
          Apa Kata <span class="text-brand">Mereka</span> Tentang Kami?
        </h2>
        <p class="text-body-lg text-muted max-w-3xl mx-auto">
          Kepuasan dan kepercayaan dari santri, alumni, dan wali santri adalah motivasi terbesar
          kami dalam terus memberikan pelayanan terbaik.
        </p>
      </div>

      <!-- Rating Summary -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-12">
        <div class="grid md:grid-cols-3 gap-8 items-center">
          <!-- Overall Rating -->
          <div class="text-center">
            <div class="text-display-md text-brand mb-2">5.0</div>
            <div class="flex justify-center space-x-1 mb-2">
              <Star v-for="i in 5" :key="i" class="w-6 h-6 text-yellow-400" fill="currentColor" />
            </div>
            <p class="text-body-sm text-muted">Berdasarkan 6 ulasan</p>
          </div>

          <!-- Rating Breakdown -->
          <div class="space-y-2">
            <div
              v-for="(rating, index) in ratingBreakdown"
              :key="index"
              class="flex items-center space-x-3"
            >
              <span class="text-caption text-muted w-8">{{ rating.stars }}★</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  :style="{ width: rating.percentage + '%' }"
                ></div>
              </div>
              <span class="text-caption text-muted w-8">{{ rating.count }}</span>
            </div>
          </div>

          <!-- Trust Indicators -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-heading-sm">Terpercaya</p>
                <p class="text-body-sm text-muted">15+ tahun pengalaman</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star class="w-5 h-5 text-yellow-600" fill="currentColor" />
              </div>
              <div>
                <p class="text-heading-sm">Berkualitas</p>
                <p class="text-body-sm text-muted">Metode terbukti efektif</p>
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
              <Quote class="w-5 h-5 text-green-600" />
            </div>

            <!-- Review Content -->
            <p class="text-body-md text-muted mb-6 leading-relaxed">"{{ testimonial.content }}"</p>

            <!-- Rating -->
            <div class="flex space-x-1 mb-4">
              <Star
                v-for="i in testimonial.rating"
                :key="i"
                class="w-4 h-4 text-yellow-400"
                fill="currentColor"
              />
            </div>

            <!-- Reviewer Info -->
            <div class="flex items-center space-x-3 pt-4 border-t border-gray-100">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center"
              >
                <User class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-heading-sm">{{ testimonial.name }}</h3>
                <p class="text-body-sm text-muted">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
        <h3 class="text-heading-xl mb-4">
          Bergabunglah dengan <span class="text-brand">Keluarga Besar</span> Kami
        </h3>
        <p class="text-body-lg text-muted mb-8 max-w-2xl mx-auto">
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
            <Instagram class="w-5 h-5 mr-2" />
            Lihat Instagram
          </a>
        </div>

        <!-- Contact Info -->
        <div class="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-100">
          <div class="flex items-center justify-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone class="w-5 h-5 text-green-600" />
            </div>
            <div class="text-left">
              <p class="text-heading-sm">Hubungi Kami</p>
              <p class="text-body-sm text-muted">{{ pondokData.contact.phone }}</p>
            </div>
          </div>

          <div class="flex items-center justify-center space-x-3">
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Mail class="w-5 h-5 text-yellow-600" />
            </div>
            <div class="text-left">
              <p class="text-heading-sm">Email Kami</p>
              <p class="text-body-sm text-muted">{{ pondokData.contact.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { pondokData } from '@/data/pondokData'
import { Star, Shield, Quote, Phone, Mail, Instagram, User } from 'lucide-vue-next'

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
