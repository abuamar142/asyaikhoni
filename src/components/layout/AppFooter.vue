<template>
  <footer class="bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white">
    <!-- Main Footer -->
    <div class="section-padding">
      <div class="container-custom">
        <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          <!-- Logo & Description -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1">
                <img
                  src="/logo.png"
                  alt="PPTQ Asy-Syaikhoni Logo"
                  class="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 class="text-xl font-bold">PPTQ Asy-Syaikhoni</h3>
                <p class="text-green-200 text-sm">Tahfidzul Qur'an</p>
              </div>
            </div>

            <p class="text-green-100 leading-relaxed">
              Mencetak generasi Qur'ani yang berakhlak mulia dengan metode pembelajaran yang efektif
              dan lingkungan yang kondusif.
            </p>

            <!-- Arabic Quote -->
            <div class="bg-white/10 p-4 rounded-xl">
              <p class="text-xl font-arabic text-center text-yellow-300 mb-2">
                وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ
              </p>
              <p class="text-sm text-green-200 text-center">
                "Dan sungguh, telah Kami mudahkan Al-Qur'an untuk peringatan"
              </p>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-6">
            <h4 class="text-lg font-semibold">Navigasi</h4>
            <ul class="space-y-3">
              <li v-for="item in navigationMenu" :key="item.id">
                <a
                  :href="item.href"
                  @click="scrollToSection(item.id)"
                  class="text-green-200 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <ChevronRight
                    class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  {{ item.name }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Programs -->
          <div class="space-y-6">
            <h4 class="text-lg font-semibold">Program</h4>
            <ul class="space-y-3">
              <li v-for="program in pondokData.programs.slice(0, 4)" :key="program.id">
                <div
                  class="text-green-200 hover:text-white transition-colors duration-200 cursor-pointer group"
                >
                  <div class="flex items-start space-x-2">
                    <CheckCircle class="w-4 h-4 mt-1 opacity-60" />
                    <span>{{ program.title }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="space-y-6">
            <h4 class="text-lg font-semibold">Kontak</h4>
            <div class="space-y-4">
              <!-- Phone -->
              <div class="flex items-start space-x-3">
                <div
                  class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <Phone class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-green-200 text-sm">Telepon / WhatsApp</p>
                  <a
                    :href="'tel:' + pondokData.contact.phone.replace(/\D/g, '')"
                    class="text-white hover:text-yellow-300 transition-colors"
                  >
                    {{ pondokData.contact.phone }}
                  </a>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-start space-x-3">
                <div
                  class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <Mail class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-green-200 text-sm">Email</p>
                  <a
                    :href="'mailto:' + pondokData.contact.email"
                    class="text-white hover:text-yellow-300 transition-colors break-all"
                  >
                    {{ pondokData.contact.email }}
                  </a>
                </div>
              </div>

              <!-- Address -->
              <div class="flex items-start space-x-3">
                <div
                  class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <MapPin class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-green-200 text-sm">Alamat</p>
                  <p class="text-white leading-relaxed">{{ pondokData.contact.address }}</p>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="space-y-3">
              <h5 class="font-medium">Ikuti Kami</h5>
              <div class="flex space-x-3">
                <a
                  :href="pondokData.socialMedia.instagram"
                  target="_blank"
                  class="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors"
                >
                  <Instagram class="w-5 h-5 text-white" />
                </a>
                <a
                  :href="pondokData.socialMedia.youtube"
                  target="_blank"
                  class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <Youtube class="w-5 h-5 text-white" />
                </a>
                <a
                  :href="pondokData.socialMedia.linktree"
                  target="_blank"
                  class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
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
    <div class="border-t border-green-600/30">
      <div class="container-custom py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="flex items-center space-x-4">
            <p class="text-green-200 text-sm">
              © {{ currentYear }} PPTQ Asy-Syaikhoni. All rights reserved.
            </p>
          </div>

          <div class="flex items-center space-x-6 text-sm">
            <div class="flex items-center space-x-2 text-green-200">
              <Star class="w-4 h-4" />
              <span>Rating 5.0</span>
            </div>
            <div class="flex items-center space-x-2 text-green-200">
              <Shield class="w-4 h-4" />
              <span>Terpercaya</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Top Button -->
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
    >
      <ArrowUp class="w-6 h-6" />
    </button>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { pondokData, navigationMenu } from '@/data/pondokData'
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

const currentYear = new Date().getFullYear()
const showBackToTop = ref(false)

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

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
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
