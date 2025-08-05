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
        <h2 class="text-display-sm mb-4">
          Program <span class="text-brand">Pendidikan</span> yang Komprehensif
        </h2>
        <p class="text-body-lg text-muted max-w-3xl mx-auto">
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
                <component :is="getIconComponent(program.icon)" class="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 class="text-heading-lg text-brand transition-colors">
                  {{ program.title }}
                </h3>
              </div>
            </div>

            <p class="text-body-md text-muted mb-6">
              {{ program.description }}
            </p>

            <!-- Features List -->
            <div class="space-y-3">
              <h4 class="text-heading-sm uppercase tracking-wide">Program Meliputi:</h4>
              <div class="grid grid-cols-1 gap-2">
                <div
                  v-for="feature in program.features"
                  :key="feature"
                  class="flex items-center space-x-3"
                >
                  <div
                    class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <CheckCircle class="w-3 h-3 text-green-600" />
                  </div>
                  <span class="text-body-sm text-muted">{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="px-6 pb-6">
            <div class="border-t border-gray-100 pt-4">
              <button
                class="w-full bg-green-50 text-green-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:bg-green-700 hover:text-white group-hover:bg-green-600 group-hover:text-white group-hover:shadow-lg"
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
            <h3 class="text-heading-xl">
              Metode Pembelajaran <span class="text-brand">Modern & Efektif</span>
            </h3>
            <p class="text-body-md text-muted">
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
              <div class="text-heading-xl text-brand">24/7</div>
              <div class="text-body-md text-muted">Bimbingan Tersedia</div>
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
import { BookOpen, GraduationCap, Heart, Users, CheckCircle } from 'lucide-vue-next'
import { pondokData } from '@/data/pondokData'
import { scrollToSection } from '@/utils/navigation'
import type { Component } from 'vue'

const teachingMethods = [
  'Talaqqi Langsung',
  "Sistem Muraja'ah",
  'Bimbingan Personal',
  'Evaluasi Berkala',
  'Metode Visual',
  'Audio Learning',
]

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: Component } = {
    'book-open': BookOpen,
    'academic-cap': GraduationCap,
    heart: Heart,
    users: Users,
    'check-circle': CheckCircle,
  }
  return iconMap[iconName] || BookOpen
}
</script>
