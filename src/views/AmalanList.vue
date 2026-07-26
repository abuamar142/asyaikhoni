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
    <div class="container mx-auto px-4 py-12 max-w-8xl">
      <!-- Search & Filter -->
      <div
        class="mb-10 w-full max-w-8xl rounded-xl border border-green-100 bg-white/80 shadow-sm px-4 py-4 md:px-6 md:py-5"
      >
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div class="flex-1">
              <SearchInput v-model="q" placeholder="Cari amalan..." />
            </div>
            <div class="w-full md:w-80">
              <div class="relative">
                <button
                  type="button"
                  class="w-full flex items-center justify-between gap-3 px-3 py-2 border border-green-200 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
                  @click="toggleDropdown"
                >
                  <span class="truncate text-body-sm text-text-primary">
                    {{ activeCategoryLabel || 'Semua kategori' }}
                  </span>
                  <span class="text-text-secondary">▾</span>
                </button>
                <div
                  v-if="showCategoryDropdown"
                  class="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-lg border border-green-200 bg-white shadow-lg"
                >
                  <div class="p-2 border-b border-green-100">
                    <label
                      class="flex items-center gap-2 text-body-sm text-text-primary cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        class="w-4 h-4 text-primary-600"
                        :checked="selectedKategoriIds.length === 0"
                        @change="resetKategori"
                      />
                      Semua kategori
                    </label>
                  </div>
                  <div class="p-2 flex flex-col gap-2">
                    <label
                      v-for="cat in categoryOptions"
                      :key="cat.id"
                      class="flex items-center gap-2 text-body-sm text-text-primary cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        class="w-4 h-4 text-primary-600"
                        :value="cat.id"
                        :checked="selectedKategoriIds.includes(cat.id)"
                        @change="
                          toggleKategori(cat.id, ($event.target as HTMLInputElement).checked)
                        "
                      />
                      {{ cat.nama }}
                    </label>
                  </div>
                  <div class="p-2 border-t border-green-100 flex justify-end gap-2 text-body-sm">
                    <button type="button" class="text-text-secondary" @click="closeDropdown">
                      Tutup
                    </button>
                    <button
                      type="button"
                      class="text-primary-700 font-semibold"
                      @click="applyKategori"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-caption text-text-secondary">
            <span v-if="activeCategoryLabel">Filter: {{ activeCategoryLabel }}</span>
            <span v-else>Menampilkan semua kategori</span>
            <button
              v-if="selectedKategoriIds.length || q"
              type="button"
              class="text-primary-700 hover:underline"
              @click="resetFilters"
            >
              Reset filter
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-body-md text-muted py-8 text-center">Sedang memuat...</div>

      <div v-else-if="error" class="text-body-md text-text-error py-8 text-center">
        Gagal memuat amalan. {{ errorMessage }}
      </div>

      <!-- Empty State -->
      <div v-else-if="isEmpty" class="text-body-md text-muted py-8 text-center">
        Tidak ada amalan yang ditemukan.
      </div>

      <!-- List -->
      <div class="grid gap-4 md:gap-6 md:grid-cols-2" v-else>
        <article
          v-for="item in itemsList"
          :key="item.id"
          class="h-full p-6 border border-green-100 rounded-lg bg-white transition-all duration-300 hover:shadow-lg hover:border-primary-300"
        >
          <router-link
            :to="{ name: 'amalan-detail', params: { slug: item.slug } }"
            class="flex h-full flex-col gap-3 group"
          >
            <div class="flex items-start justify-between gap-3">
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
              </div>
            </div>
            <p v-if="item.ringkasan" class="text-body-sm text-muted leading-relaxed">
              {{ item.ringkasan }}
            </p>
            <div class="mt-auto text-primary-700 text-body-sm font-semibold">Lihat detail →</div>
          </router-link>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAmalanListQuery } from '@/composables/useAmalanQueries'
import { useCategoryListQuery } from '@/composables/useCategoryQueries'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import SearchInput from '@/components/ui/SearchInput.vue'
import type { Category } from '@/services/categoryService'

const q = ref('')
const qDebounced = useDebouncedRef(q, 400)
const selectedKategoriIds = ref<string[]>([])
const tempSelectedKategoriIds = ref<string[]>([])
const showCategoryDropdown = ref(false)
const { data: categories } = useCategoryListQuery()
const categoryOptions = computed<Category[]>(() => categories?.value || [])
const activeCategoryLabel = computed(() => {
  if (!selectedKategoriIds.value.length) return ''
  const names = categoryOptions.value
    .filter((c) => selectedKategoriIds.value.includes(c.id))
    .map((c) => c.nama)
  return names.join(', ')
})

const queryParams = computed(() => ({
  q: qDebounced.value || undefined,
  kategoriIds: selectedKategoriIds.value.length ? selectedKategoriIds.value : undefined,
}))

const { data, isLoading: loading, error } = useAmalanListQuery(queryParams)
const itemsList = computed(() => data.value || [])
const isEmpty = computed(() => !loading.value && itemsList.value.length === 0)
const errorMessage = computed(() => (error?.value instanceof Error ? error.value.message : ''))

function resetFilters() {
  q.value = ''
  selectedKategoriIds.value = []
  tempSelectedKategoriIds.value = []
}

function resetKategori() {
  selectedKategoriIds.value = []
  tempSelectedKategoriIds.value = []
}

function toggleKategori(id: string, checked: boolean) {
  const set = new Set(tempSelectedKategoriIds.value)
  if (checked) set.add(id)
  else set.delete(id)
  tempSelectedKategoriIds.value = Array.from(set)
}

function toggleDropdown() {
  showCategoryDropdown.value = !showCategoryDropdown.value
  tempSelectedKategoriIds.value = [...selectedKategoriIds.value]
}

function closeDropdown() {
  showCategoryDropdown.value = false
}

function applyKategori() {
  selectedKategoriIds.value = [...tempSelectedKategoriIds.value]
  showCategoryDropdown.value = false
}
</script>
