<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-50 to-white border-b border-green-100 py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-heading-xl text-brand mb-1">Kelola Amalan</h1>
            <p class="text-body-md text-muted">Kelola semua amalan di pondok</p>
          </div>
          <router-link :to="{ name: 'admin-amalan-new' }" class="btn-primary"
            >+ Tambah Amalan</router-link
          >
        </div>
      </div>
    </div>

    <!-- Search & List -->
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6 flex items-center gap-3">
        <input
          v-model="q"
          type="text"
          placeholder="Cari amalan..."
          class="flex-1 max-w-md px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          @click="fetchList"
          class="px-6 py-2 rounded-lg bg-primary-700 hover:bg-primary-800 text-white font-medium transition-all duration-200"
        >
          Cari
        </button>
      </div>

      <AmalanTable :items="items" @delete="onDelete" @toggle="onToggle" />
      <p v-if="error" class="text-text-error text-body-md mt-6">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AmalanTable from '@/components/admin/AmalanTable.vue'
import { listAll, deleteAmalan, toggleAktif, type Amalan } from '@/services/amalanService'

const items = ref<Amalan[]>([])
const q = ref('')
const error = ref('')

async function fetchList() {
  error.value = ''
  try {
    items.value = await listAll({ q: q.value })
  } catch (e: any) {
    error.value = e?.message || 'Gagal memuat data'
  }
}

async function onDelete(item: Amalan) {
  if (!confirm(`Hapus amalan: ${item.judul}?`)) return
  await deleteAmalan(item.id)
  await fetchList()
}

async function onToggle(item: Amalan) {
  await toggleAktif(item.id, !item.aktif)
  await fetchList()
}

onMounted(fetchList)
</script>
