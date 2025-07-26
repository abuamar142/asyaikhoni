<template>
  <footer class="bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white">
    <!-- Main Footer -->
    <div class="section-padding">
      <div class="container-custom">
        <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          <!-- Logo & Description -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <svg class="w-7 h-7 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.2L18.8 12H17v6H7v-6H5.2L12 5.2zM9 13h6v5H9v-5z"
                  />
                </svg>
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
                  <svg
                    class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
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
                    <svg class="w-4 h-4 mt-1 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                    />
                  </svg>
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
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    />
                  </svg>
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
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    />
                  </svg>
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
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C24.005 5.367 18.638.001 12.017.001z"
                    />
                  </svg>
                </a>
                <a
                  :href="pondokData.socialMedia.youtube"
                  target="_blank"
                  class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
                </a>
                <a
                  :href="pondokData.socialMedia.linktree"
                  target="_blank"
                  class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M13.736 5.853L12 4.117 10.264 5.853 8.111 3.7 12 -0.189l3.889 3.889-2.153 2.153zM4.117 12l1.736-1.736L3.7 8.111 -0.189 12l3.889 3.889 2.153-2.153L4.117 12zM10.264 18.147L12 19.883l1.736-1.736 2.153 2.153L12 24.189l-3.889-3.889 2.153-2.153zM19.883 12l-1.736 1.736 2.153 2.153L24.189 12l-3.889-3.889-2.153 2.153L19.883 12z"
                    />
                  </svg>
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
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
              <span>Rating 5.0</span>
            </div>
            <div class="flex items-center space-x-2 text-green-200">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
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
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { pondokData, navigationMenu } from '@/data/pondokData'

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
