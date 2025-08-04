<template>
  <section id="contact" class="section-padding bg-white">
    <div class="container-custom">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-block mb-4">
          <span class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            Hubungi Kami
          </span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Mari <span class="text-green-800">Bergabung</span> dengan Kami
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Silakan hubungi kami untuk informasi lebih lanjut tentang pendaftaran dan program-program
          yang tersedia di pondok pesantren.
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Contact Information -->
        <div class="space-y-8">
          <!-- Contact Methods -->
          <div class="space-y-6">
            <!-- Phone -->
            <div
              class="flex items-start space-x-4 p-6 bg-gradient-to-r from-green-50 to-white rounded-2xl border border-green-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div
                class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Phone class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                <p class="text-gray-600 mb-3">Hubungi kami langsung untuk konsultasi</p>
                <a
                  :href="pondokData.socialMedia.whatsapp"
                  class="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
                >
                  {{ pondokData.contact.phone }}
                  <ExternalLink class="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            <!-- Email -->
            <div
              class="flex items-start space-x-4 p-6 bg-gradient-to-r from-yellow-50 to-white rounded-2xl border border-yellow-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div
                class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Mail class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Email</h3>
                <p class="text-gray-600 mb-3">Kirim pertanyaan atau pesan Anda</p>
                <a
                  :href="'mailto:' + pondokData.contact.email"
                  class="inline-flex items-center text-yellow-700 hover:text-yellow-800 font-medium"
                >
                  {{ pondokData.contact.email }}
                  <ExternalLink class="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            <!-- Address -->
            <div
              class="flex items-start space-x-4 p-6 bg-gradient-to-r from-green-50 to-white rounded-2xl border border-green-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div
                class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <MapPin class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Alamat Pondok</h3>
                <p class="text-gray-600 mb-3">{{ pondokData.contact.address }}</p>
                <a
                  :href="pondokData.contact.maps"
                  target="_blank"
                  class="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
                >
                  Lihat di Google Maps
                  <ExternalLink class="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div
            class="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100"
          >
            <h3 class="font-semibold text-gray-900 mb-4">Ikuti Media Sosial Kami</h3>
            <div class="grid grid-cols-2 gap-4">
              <a
                :href="pondokData.socialMedia.instagram"
                target="_blank"
                class="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 group"
              >
                <div
                  class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors"
                >
                  <Instagram class="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Instagram</p>
                  <p class="text-sm text-gray-600">@pptq_asyaikhoni</p>
                </div>
              </a>

              <a
                :href="pondokData.socialMedia.youtube"
                target="_blank"
                class="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 group"
              >
                <div
                  class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors"
                >
                  <Youtube class="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">YouTube</p>
                  <p class="text-sm text-gray-600">PPTQ Asy-Syaikhoni</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div
            class="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100"
          >
            <h3 class="font-semibold text-gray-900 mb-4">Link Penting</h3>
            <div class="space-y-3">
              <a
                :href="pondokData.socialMedia.linktree"
                target="_blank"
                class="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-50 transition-colors group"
              >
                <span class="text-gray-700 group-hover:text-green-800">Link Tree Pondok</span>
                <ExternalLink class="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </a>
              <a
                href="https://forms.gle/GjtXGUQWE3bUKbbA6"
                target="_blank"
                class="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-50 transition-colors group"
              >
                <span class="text-gray-700 group-hover:text-green-800">Form Saran</span>
                <ExternalLink class="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </a>
              <a
                href="https://lynk.id/payme/pptq-asyaikhoni"
                target="_blank"
                class="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-yellow-50 transition-colors group"
              >
                <span class="text-gray-700 group-hover:text-yellow-800">Infaq Pondok</span>
                <ExternalLink class="w-4 h-4 text-gray-400 group-hover:text-yellow-600" />
              </a>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div
          class="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100"
        >
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h3>
            <p class="text-gray-600">Isi form di bawah ini untuk mengirim pesan kepada kami</p>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  required
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  No. Telepon *
                </label>
                <input
                  type="tel"
                  id="phone"
                  v-model="form.phone"
                  required
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Contoh: 081234567890"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                Subjek *
              </label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              >
                <option value="">Pilih subjek</option>
                <option value="pendaftaran">Pendaftaran Santri Baru</option>
                <option value="informasi">Informasi Program</option>
                <option value="kunjungan">Kunjungan Pondok</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Pesan *
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="5"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                placeholder="Tulis pesan Anda di sini..."
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full btn-primary flex items-center justify-center"
              :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
            >
              <span v-if="!isSubmitting">Kirim Pesan</span>
              <span v-else class="flex items-center">
                <Loader2 class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Mengirim...
              </span>
            </button>
          </form>

          <!-- Success Message -->
          <div v-if="showSuccess" class="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg">
            <div class="flex items-center space-x-3">
              <CheckCircle class="w-5 h-5 text-green-600" />
              <p class="text-green-800 font-medium">
                Pesan berhasil dikirim! Kami akan menghubungi Anda segera.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Instagram,
  Youtube,
  CheckCircle,
  Loader2,
} from 'lucide-vue-next'
import { pondokData } from '@/data/pondokData'

const isSubmitting = ref(false)
const showSuccess = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
})

const submitForm = async () => {
  isSubmitting.value = true

  // Simulate form submission
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Reset form
  Object.assign(form, {
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  })

  isSubmitting.value = false
  showSuccess.value = true

  // Hide success message after 5 seconds
  setTimeout(() => {
    showSuccess.value = false
  }, 5000)
}
</script>
