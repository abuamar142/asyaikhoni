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
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-body-md text-muted py-8 text-center">Sedang memuat...</div>

      <!-- Empty State -->
      <div
        v-else-if="!items || items.length === 0"
        class="text-body-md text-muted py-8 text-center"
      >
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
            <div class="flex items-start justify-between gap-3 mb-2">
              <h2 class="text-heading-md text-brand group-hover:text-primary-800 transition-colors">
                {{ item.judul }}
              </h2>
              <div class="flex flex-wrap gap-2 justify-end">
                <span
                  v-for="cat in item.categories"
                  :key="cat.id"
                  class="text-caption px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium"
                  >{{ cat.nama }}</span
                >
                <span
                  v-if="!item.categories?.length && item.kategori"
                  class="text-caption px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium"
                  >{{ item.kategori }}</span
                >
              </div>
            </div>
            <p v-if="item.ringkasan" class="text-body-sm text-muted">{{ item.ringkasan }}</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAmalanListQuery } from '@/composables/useAmalanQueries'
import { useDebouncedRef } from '@/composables/useDebouncedRef'

const q = ref('')
const qDebounced = useDebouncedRef(q, 400)

const queryParams = computed(() => ({
  q: qDebounced.value || undefined,
}))

const { data: items = [], isLoading: loading } = useAmalanListQuery(queryParams)
</script>
