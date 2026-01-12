<template>
  <footer
    class="bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white relative overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
      ></div>
      <div class="absolute top-20 left-20 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl"></div>
      <div class="absolute bottom-20 right-20 w-40 h-40 bg-green-400/10 rounded-full blur-xl"></div>
    </div>

    <!-- Main Footer -->
    <div class="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-0 relative z-10">
      <div class="container-custom">
        <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-6 sm:gap-8">
          <!-- Logo & Description -->
          <div class="space-y-4 sm:space-y-6">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center p-1.5 shadow-lg"
              >
                <img
                  src="/logo.svg"
                  :alt="`${pondokData.shortName} Logo`"
                  class="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white mb-0.5">
                  {{ pondokData.shortName }}
                </h3>
                <p class="text-emerald-200 text-base font-medium">
                  {{ pondokData.name.split(' ').slice(2, 4).join(' ') }}
                </p>
              </div>
            </div>

            <p class="text-lg text-emerald-100 leading-relaxed font-light">
              {{ pondokData.tagline }} dengan metode pembelajaran yang efektif dan lingkungan yang
              kondusif.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="space-y-3 sm:space-y-5">
            <h4 class="text-lg font-bold text-white border-b border-emerald-400/50 pb-2">
              Navigasi
            </h4>
            <ul class="space-y-3">
              <li v-for="item in navigationMenu" :key="item.id">
                <a
                  :href="item.href"
                  @click.prevent="handleNavigation(item)"
                  class="text-emerald-100 hover:text-yellow-300 transition-all duration-300 flex items-center group hover:translate-x-1 text-base font-medium"
                >
                  <ChevronRight
                    class="w-4 h-4 mr-2 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 text-yellow-400"
                  />
                  {{ item.name }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Programs -->
          <div class="space-y-3 sm:space-y-5">
            <h4 class="text-lg font-bold text-white border-b border-emerald-400/50 pb-2">
              Program
            </h4>
            <ul class="space-y-3">
              <li v-for="program in pondokData.programs.slice(0, 4)" :key="program.id">
                <div
                  class="text-emerald-100 hover:text-yellow-300 transition-all duration-300 cursor-pointer group hover:translate-x-1"
                >
                  <div class="flex items-start space-x-3">
                    <CheckCircle class="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
                    <span class="text-base font-medium">{{ program.title }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="space-y-3 sm:space-y-5">
            <h4 class="text-lg font-bold text-white border-b border-emerald-400/50 pb-2">Kontak</h4>
            <div class="space-y-3 sm:space-y-4">
              <!-- Phone -->
              <div class="flex items-start space-x-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                >
                  <Phone class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="text-emerald-200 text-xs font-medium mb-1">Telepon / WhatsApp</p>
                  <a
                    :href="'tel:' + pondokData.contact.phone.replace(/\D/g, '')"
                    class="text-white hover:text-yellow-300 transition-colors font-bold text-lg"
                  >
                    {{ pondokData.contact.phone }}
                  </a>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-start space-x-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                >
                  <Mail class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="text-emerald-200 text-xs font-medium mb-1">Email</p>
                  <a
                    :href="'mailto:' + pondokData.contact.email"
                    class="text-white hover:text-yellow-300 transition-colors font-bold text-base break-all"
                  >
                    {{ pondokData.contact.email }}
                  </a>
                </div>
              </div>

              <!-- Address -->
              <div class="flex items-start space-x-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                >
                  <MapPin class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="text-emerald-200 text-xs font-medium mb-1">Alamat</p>
                  <p class="text-white text-base leading-relaxed font-medium">
                    {{ pondokData.contact.address }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="space-y-3">
              <h5 class="text-base font-bold text-white">Ikuti Kami</h5>
              <div class="flex space-x-3">
                <a
                  :href="pondokData.socialMedia.instagram"
                  target="_blank"
                  aria-label="Kunjungi halaman Instagram PPTQ Asy-Syaikhoni"
                  class="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300"
                >
                  <Instagram class="w-5 h-5 text-white" />
                </a>
                <a
                  :href="pondokData.socialMedia.youtube"
                  target="_blank"
                  aria-label="Kunjungi channel YouTube PPTQ Asy-Syaikhoni"
                  class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300"
                >
                  <Youtube class="w-5 h-5 text-white" />
                </a>
                <a
                  :href="pondokData.socialMedia.linktree"
                  target="_blank"
                  aria-label="Kunjungi semua tautan sosial media PPTQ Asy-Syaikhoni"
                  class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300"
                >
                  <ExternalLink class="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div
      class="border-t border-emerald-400/30 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 backdrop-blur-sm"
    >
      <div class="container-custom py-4 sm:py-6 px-4 sm:px-6 lg:px-0">
        <div
          class="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-center md:text-left"
        >
          <div class="flex items-center space-x-4">
            <p class="text-emerald-200 text-sm sm:text-base font-medium">
              © {{ currentYear }} {{ pondokData.shortName }}. All rights reserved.
            </p>
          </div>

          <div class="flex items-center space-x-4 sm:space-x-6">
            <div class="flex items-center space-x-2">
              <Star class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span class="text-white text-sm sm:text-base font-bold">Rating 5.0</span>
            </div>
            <div class="flex items-center space-x-2">
              <Shield class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span class="text-white text-sm sm:text-base font-bold">Terpercaya</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Top Button -->
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      aria-label="Kembali ke atas"
      class="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110 active:scale-95"
    >
      <ArrowUp class="w-5 h-5" />
    </button>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { pondokData, navigationMenu } from '@/data/pondokData'
import { scrollToTop, handleCrossRouteNavigation } from '@/utils/navigation'
import {
  ChevronRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Youtube,
  ExternalLink,
  Star,
  Shield,
  ArrowUp,
} from 'lucide-vue-next'

const router = useRouter()
const currentYear = new Date().getFullYear()
const showBackToTop = ref(false)

const handleNavigation = (item: { name: string; href: string; id: string }) => {
  // Gunakan utility function untuk cross-route navigation
  handleCrossRouteNavigation(router, item)
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 500
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
