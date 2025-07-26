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
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                <p class="text-gray-600 mb-3">Hubungi kami langsung untuk konsultasi</p>
                <a
                  :href="pondokData.socialMedia.whatsapp"
                  class="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
                >
                  {{ pondokData.contact.phone }}
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
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
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Email</h3>
                <p class="text-gray-600 mb-3">Kirim pertanyaan atau pesan Anda</p>
                <a
                  :href="'mailto:' + pondokData.contact.email"
                  class="inline-flex items-center text-yellow-700 hover:text-yellow-800 font-medium"
                >
                  {{ pondokData.contact.email }}
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
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
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  />
                </svg>
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
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
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
                  <svg class="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C24.005 5.367 18.638.001 12.017.001z"
                    />
                  </svg>
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
                  <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
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
                <svg
                  class="w-4 h-4 text-gray-400 group-hover:text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="https://forms.gle/GjtXGUQWE3bUKbbA6"
                target="_blank"
                class="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-50 transition-colors group"
              >
                <span class="text-gray-700 group-hover:text-green-800">Form Saran</span>
                <svg
                  class="w-4 h-4 text-gray-400 group-hover:text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="https://lynk.id/payme/pptq-asyaikhoni"
                target="_blank"
                class="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-yellow-50 transition-colors group"
              >
                <span class="text-gray-700 group-hover:text-yellow-800">Infaq Pondok</span>
                <svg
                  class="w-4 h-4 text-gray-400 group-hover:text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
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
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Mengirim...
              </span>
            </button>
          </form>

          <!-- Success Message -->
          <div v-if="showSuccess" class="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg">
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
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
