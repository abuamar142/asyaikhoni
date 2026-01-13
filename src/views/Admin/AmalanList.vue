<template>
  <AdminLayout>
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
      </div>

      <AmalanTable :items="items || []" @delete="onDelete" @toggle="onToggle" />
      <p v-if="error" class="text-text-error text-body-md mt-6">{{ error }}</p>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AmalanTable from '@/components/admin/AmalanTable.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import { deleteAmalan, toggleAktif, type Amalan } from '@/services/amalanService'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import { useAdminAmalanListQuery } from '@/composables/useAmalanQueries'

const q = ref('')
const qDebounced = useDebouncedRef(q, 400)
const queryParams = computed(() => ({ q: qDebounced.value || undefined }))

const { data: items, error, refetch } = useAdminAmalanListQuery(queryParams)

async function onDelete(item: Amalan) {
  if (!confirm(`Hapus amalan: ${item.judul}?`)) return
  await deleteAmalan(item.id)
  await refetch()
}

async function onToggle(item: Amalan) {
  await toggleAktif(item.id, !item.aktif)
  await refetch()
}

watch(qDebounced, () => {
  refetch()
})
</script>
