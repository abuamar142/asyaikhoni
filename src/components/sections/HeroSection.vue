<template>
  <section
    id="home"
    class="relative min-h-screen flex items-center gradient-bg islamic-pattern overflow-hidden"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 float"
      ></div>
      <div
        class="absolute top-40 right-20 w-16 h-16 bg-yellow-200 rounded-full opacity-30"
        style="animation: float 3s ease-in-out infinite 1s"
      ></div>
      <div
        class="absolute bottom-20 left-1/4 w-12 h-12 bg-green-300 rounded-full opacity-25"
        style="animation: float 3s ease-in-out infinite 2s"
      ></div>
    </div>

    <div class="container-custom section-padding relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 lg:items-center">
        <!-- Mobile: Content takes full screen height, Desktop: normal alignment -->
        <!-- Content -->
        <div class="space-y-8 fade-in">
          <!-- Mobile: Add top spacing after header, Desktop: normal spacing -->
          <div class="pt-16 sm:pt-8 lg:pt-0"></div>

          <!-- Arabic Calligraphy -->
          <div class="text-center lg:text-left">
            <p class="text-2xl leading-relaxed font-normal text-emerald-700 mb-4">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>

          <!-- Main Heading -->
          <div class="space-y-4 text-center lg:text-left">
            <h1 class="text-display-lg leading-tight">
              <span class="text-brand">{{ pondokData.name.split(' ').slice(0, 2).join(' ') }}</span
              ><br />
              <span class="text-accent">{{ pondokData.name.split(' ').slice(2, 4).join(' ') }}</span
              ><br />
              <span
                class="bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent"
              >
                {{ pondokData.name.split(' ').slice(4).join(' ') }}
              </span>
            </h1>

            <p class="text-body-lg font-medium">
              {{ pondokData.tagline }}
            </p>

            <p class="text-body-md text-muted max-w-2xl mx-auto lg:mx-0">
              {{ pondokData.description }}
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="#about" @click="scrollToSection('about')" class="btn-primary text-center">
              Pelajari Lebih Lanjut
            </a>
            <a
              href="#contact"
              @click="scrollToSection('contact')"
              class="btn-secondary text-center"
            >
              Daftar Sekarang
            </a>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
            <div v-for="stat in pondokData.stats" :key="stat.id" class="text-center">
              <div class="text-heading-lg text-brand">{{ stat.number }}</div>
              <div class="text-body-sm text-muted">{{ stat.label }}</div>
            </div>
          </div>

          <!-- Mobile: Add bottom spacing to ensure full screen for text content -->
          <div class="pb-16 lg:pb-0"></div>
        </div>

        <!-- Hero Image/Visual -->
        <!-- Mobile: Video section starts after text content scroll -->
        <div class="relative slide-up mt-12 lg:mt-0">
          <!-- Video Info Badge - positioned above video -->
          <div class="mb-4 text-center lg:text-right">
            <div
              class="inline-flex items-center space-x-3 bg-gradient-to-r from-green-50 to-yellow-50 p-3 rounded-xl border border-green-100"
            >
              <div class="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
                <Play class="w-4 h-4 text-white" />
              </div>
              <span class="text-green-800 font-semibold text-sm">Video Profil Pondok</span>
            </div>
          </div>

          <div class="relative">
            <!-- YouTube Video Container -->
            <div
              class="w-full h-96 lg:h-[500px] bg-gradient-to-br from-green-50 to-yellow-50 rounded-3xl shadow-2xl overflow-hidden relative group cursor-pointer"
              @click="toggleVideo"
            >
              <!-- Islamic Pattern Overlay -->
              <div class="absolute inset-0 islamic-pattern opacity-10"></div>

              <!-- Video Preview/Thumbnail when not playing -->
              <div
                v-if="!isVideoPlaying"
                class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-700/10 to-yellow-400/10"
              >
                <!-- Custom Mosque Silhouette Background -->
                <div
                  class="absolute w-64 h-64 text-green-700 opacity-15 flex items-center justify-center"
                >
                  <svg viewBox="0 0 383.594 383.594" class="w-full h-full" fill="currentColor">
                    <path
                      d="M375.701,201.29c0-1.98-1.078-3.693-2.668-4.629c6.516-5.986,10.561-12.909,10.561-22.79
                      c0-29.125-35.504-34.861-35.504-48.258c0,13.397-35.504,19.133-35.504,48.258c0,9.88,4.044,16.803,10.561,22.789
                      c-1.59,0.936-2.668,2.648-2.668,4.63c0,2.875,2.253,5.201,5.09,5.355v28.777c-2.837,0.153-5.09,2.48-5.09,5.355
                      c0,2.876,2.253,5.205,5.09,5.358v15.025h-66.557v-21.915h-7.639v-15.089h-0.633c13.466-13.113,21.715-28.355,21.715-49.633
                      c0-60.061-66.449-76.349-78.719-101.6c2.155,0.536,4.375,0.826,6.614,0.826c8.364,0,16.176-3.724,21.432-10.217
                      c1.828-2.263,3.285-4.783,4.329-7.492l0.162-0.421l-0.379,0.246c-4.421,2.865-9.556,4.38-14.849,4.38
                      c-6.209,0-12.294-2.157-17.136-6.073c-9.198-7.449-12.541-19.877-8.316-30.927l0.161-0.42l-0.378,0.245
                      c-2.43,1.577-4.592,3.526-6.425,5.792c-4.631,5.72-6.758,12.9-5.987,20.219c0.77,7.319,4.347,13.9,10.068,18.53
                      c2.213,1.791,4.693,3.198,7.318,4.223c-10.849,25.883-79.213,41.769-79.213,102.688c0,21.277,8.246,36.52,21.713,49.633h-0.633
                      v15.089h-7.637v21.915H58.021v-15.092c2.84-0.153,5.1-2.481,5.1-5.355c0-2.875-2.26-5.203-5.1-5.355v-28.779
                      c2.84-0.153,5.1-2.48,5.1-5.355c0-1.979-1.082-3.691-2.675-4.626c6.514-5.984,10.561-12.907,10.561-22.788
                      c0-29.125-35.508-34.865-35.508-48.263c0,13.397-35.5,19.138-35.5,48.263c0,9.882,4.047,16.805,10.563,22.788
                      c-1.592,0.936-2.672,2.647-2.672,4.626c0,2.874,2.258,5.201,5.094,5.355v28.779c-2.836,0.154-5.094,2.481-5.094,5.355
                      c0,2.873,2.258,5.201,5.094,5.355v15.092h-0.031v99.607H57.18v-38.402c0-15.941,22.84-26.385,22.84-26.385
                      s22.838,10.443,22.838,26.385v38.402h56.912v-54.822c0-22.352,32.027-36.995,32.027-36.995s32.025,14.644,32.025,36.995v54.822
                      h56.912v-38.402c0-15.941,22.838-26.385,22.838-26.385s22.84,10.443,22.84,26.385v38.402h44.227V261.16h-0.029v-15.025
                      c2.836-0.152,5.092-2.481,5.092-5.358c0-2.875-2.256-5.203-5.092-5.355v-28.776C373.445,206.493,375.701,204.165,375.701,201.29z"
                    />
                  </svg>
                </div>

                <!-- Play Button - Centered -->
                <div class="relative z-10 flex flex-col items-center">
                  <div
                    class="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-green-800 transition-all duration-300 group-hover:scale-110 mb-4"
                  >
                    <Play class="w-8 h-8 text-white ml-1" />
                  </div>
                  <p class="text-center text-green-800 font-semibold">Tonton</p>
                </div>

                <!-- Decorative Elements - Better positioned -->
                <div
                  class="absolute top-8 left-8 w-6 h-6 bg-yellow-400 rounded-full opacity-60 float"
                ></div>
                <div
                  class="absolute top-16 right-12 w-4 h-4 bg-green-400 rounded-full opacity-40"
                  style="animation: float 3s ease-in-out infinite 1s"
                ></div>
                <div
                  class="absolute bottom-12 left-12 w-8 h-8 bg-yellow-300 rounded-full opacity-50"
                  style="animation: float 3s ease-in-out infinite 2s"
                ></div>
                <div
                  class="absolute bottom-8 right-8 w-3 h-3 bg-green-500 rounded-full opacity-30"
                ></div>
              </div>

              <!-- YouTube Embed when playing -->
              <div v-if="isVideoPlaying" class="absolute inset-0">
                <iframe
                  class="w-full h-full rounded-3xl"
                  :src="videoUrl"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>

                <!-- Close button -->
                <button
                  @click.stop="closeVideo"
                  aria-label="Tutup video"
                  class="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors z-10"
                >
                  <X class="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <!-- Floating Cards - Better positioned -->
            <div
              class="absolute -top-6 -left-6 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center float"
            >
              <Users class="w-6 h-6 text-green-600" />
            </div>

            <div
              class="absolute -bottom-6 -right-6 w-20 h-14 bg-yellow-400 rounded-xl shadow-lg flex items-center justify-center"
              style="animation: float 3s ease-in-out infinite 1.5s"
            >
              <span class="text-green-800 font-bold text-base">قرآن</span>
            </div>

            <!-- Additional decorative element -->
            <div
              class="absolute top-1/2 -right-8 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center opacity-80"
              style="animation: float 3s ease-in-out infinite 0.5s"
            >
              <div class="w-6 h-6 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <ChevronDown class="w-6 h-6 text-green-700" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Play, Users, ChevronDown, X } from 'lucide-vue-next'
import { pondokData } from '@/data/pondokData'

// Video state
const isVideoPlaying = ref(false)
const videoUrl = ref('')

// YouTube video ID from the provided URL
const youtubeVideoId = 'G34kr1IUoLg'

const toggleVideo = () => {
  if (!isVideoPlaying.value) {
    // Create YouTube embed URL with autoplay
    videoUrl.value = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`
    isVideoPlaying.value = true
  }
}

const closeVideo = () => {
  isVideoPlaying.value = false
  videoUrl.value = ''
}

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
