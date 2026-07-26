<template>
  <section class="bg-white pt-24 sm:pt-28 lg:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="container-custom">
      <!-- Hero Header -->
      <div class="text-center mb-16">
        <div class="inline-block mb-4">
          <span class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            Sejarah Pondok
          </span>
        </div>
        <h1 class="text-display-sm mb-6">
          Perjalanan <span class="text-brand">PPTQ Asy-Syaikhoni</span>
        </h1>
        <p class="text-body-lg text-muted max-w-3xl mx-auto">
          Mengenal lebih dalam tentang perjalanan dan perkembangan Pondok Pesantren Tahfidzul Qur'an
          Asy-Syaikhoni dari masa ke masa.
        </p>
      </div>

      <!-- Timeline Container -->
      <div class="max-w-4xl mx-auto">
        <!-- Timeline Item -->
        <div v-for="(item, index) in timelineData" :key="item.id" class="relative mb-12 last:mb-0">
          <!-- Timeline Line -->
          <div
            v-if="index !== timelineData.length - 1"
            class="absolute left-6 md:left-8 top-16 w-0.5 bg-green-200 z-0"
            :class="['md:h-full', 'h-[calc(100%-4rem)]']"
          ></div>

          <!-- Timeline Content -->
          <div class="flex flex-col md:flex-row items-start gap-6 relative z-10">
            <!-- Year Circle -->
            <div
              class="flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full shadow-lg z-30 relative"
            >
              <span class="text-white font-bold text-sm md:text-base">{{ item.year }}</span>
            </div>

            <!-- Content -->
            <div
              class="flex-1 bg-gradient-to-r from-green-50 to-white rounded-2xl shadow-lg p-6 md:p-8 border border-green-100 relative z-20"
            >
              <h3 class="text-heading-lg text-brand mb-3">{{ item.title }}</h3>
              <p class="text-body-md text-muted leading-relaxed mb-4">{{ item.description }}</p>

              <!-- Highlights -->
              <div v-if="item.highlights && item.highlights.length > 0" class="space-y-2">
                <h4 class="text-heading-sm text-gray-800 mb-3">Pencapaian:</h4>
                <ul class="space-y-2">
                  <li
                    v-for="highlight in item.highlights"
                    :key="highlight"
                    class="flex items-start space-x-3"
                  >
                    <div
                      class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    >
                      <CheckCircle class="w-3 h-3 text-green-600" />
                    </div>
                    <span class="text-body-sm text-gray-700">{{ highlight }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Visi Misi Section -->
      <div class="mt-20 grid md:grid-cols-2 gap-8">
        <!-- Visi -->
        <div
          class="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-8 border border-green-100"
        >
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4">
              <Eye class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-heading-xl text-brand">Visi</h3>
          </div>
          <p class="text-body-md text-muted leading-relaxed">
            {{ visiMisi.visi }}
          </p>
        </div>

        <!-- Misi -->
        <div
          class="bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-lg p-8 border border-yellow-100"
        >
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center mr-4">
              <Target class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-heading-xl text-yellow-700">Misi</h3>
          </div>
          <ul class="space-y-3">
            <li v-for="misi in visiMisi.misi" :key="misi" class="flex items-start space-x-3">
              <div
                class="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              >
                <CheckCircle class="w-3 h-3 text-yellow-600" />
              </div>
              <span class="text-body-sm text-gray-700">{{ misi }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Pendiri Section -->
      <div class="mt-20">
        <div class="text-center mb-12">
          <h3 class="text-heading-xl text-brand mb-4">Pendiri & Pengasuh</h3>
          <p class="text-body-md text-muted max-w-2xl mx-auto">
            Tokoh-tokoh yang berperan penting dalam mendirikan dan mengembangkan pondok pesantren
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="pendiri in pendiriData"
            :key="pendiri.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <!-- Avatar Placeholder -->
            <div
              class="h-48 bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center"
            >
              <div class="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center">
                <User class="w-12 h-12 text-white" />
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <h4 class="text-heading-md text-brand mb-2">{{ pendiri.nama }}</h4>
              <p class="text-body-sm text-green-700 font-medium mb-3">{{ pendiri.jabatan }}</p>
              <p class="text-body-sm text-muted leading-relaxed">{{ pendiri.deskripsi }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-20 text-center">
        <div
          class="bg-gradient-to-r from-green-50 via-white to-yellow-50 rounded-2xl shadow-lg p-8 border border-green-100"
        >
          <h3 class="text-heading-xl text-brand mb-4">
            Bergabunglah dengan Keluarga Besar PPTQ Asy-Syaikhoni
          </h3>
          <p class="text-body-md text-muted mb-6 max-w-2xl mx-auto">
            Jadilah bagian dari perjalanan kami dalam mencetak generasi Qur'ani yang berakhlak mulia
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/#contact" class="btn-primary inline-flex items-center justify-center">
              <span>Hubungi Kami</span>
              <Phone class="w-5 h-5 ml-2" />
            </router-link>
            <router-link to="/" class="btn-secondary inline-flex items-center justify-center">
              <span>Kembali ke Beranda</span>
              <ArrowLeft class="w-5 h-5 mr-2" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckCircle, Eye, Target, User, Phone, ArrowLeft } from 'lucide-vue-next'
import { sejarahData } from '@/data/sejarahData'

const { timelineData, visiMisi, pendiriData } = sejarahData
</script>
