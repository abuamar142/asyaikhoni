<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-50 to-white border-b border-green-100 py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-heading-xl text-brand mb-2">Amalan</h1>
        <p class="text-body-md text-muted">Kumpulan amalan-amalan penting di Pondok Pesantren</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Search -->
      <div class="mb-8 flex items-center gap-3">
        <input
          v-model="q"
          type="text"
          placeholder="Cari amalan..."
          class="flex-1 max-w-md px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <button
          @click="fetchList"
          class="px-6 py-2 rounded-lg bg-primary-700 hover:bg-primary-800 text-white font-medium transition-all duration-200"
        >
          Cari
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-body-md text-muted py-8 text-center">Sedang memuat...</div>

      <!-- Empty State -->
      <div v-else-if="items.length === 0" class="text-body-md text-muted py-8 text-center">
        Tidak ada amalan yang ditemukan.
      </div>

      <!-- List -->
      <ul class="space-y-4" v-else>
        <li
          v-for="item in items"
          :key="item.id"
          class="p-6 border border-green-100 rounded-lg hover:shadow-md hover:border-primary-300 transition-all duration-300 bg-white"
        >
          <router-link
            :to="{ name: 'amalan-detail', params: { slug: item.slug } }"
            class="block group"
          >
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-heading-md text-brand group-hover:text-primary-800 transition-colors">
                {{ item.judul }}
              </h2>
              <span
                v-if="item.kategori"
                class="text-caption px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium"
                >{{ item.kategori }}</span
              >
            </div>
            <p v-if="item.ringkasan" class="text-body-sm text-muted">{{ item.ringkasan }}</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listPublic, type Amalan } from '@/services/amalanService'

const items = ref<Amalan[]>([])
const loading = ref(false)
const q = ref('')

async function fetchList() {
  loading.value = true
  try {
    items.value = await listPublic({ q: q.value })
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)
</script>
