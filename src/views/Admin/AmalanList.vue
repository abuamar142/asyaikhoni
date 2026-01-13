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
          <BaseButton as="router-link" :to="{ name: 'admin-amalan-new' }" variant="primary">
            + Tambah Amalan
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Search & List -->
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6 max-w-xl">
        <SearchInput v-model="q" placeholder="Cari amalan..." />
      </div>

      <AmalanTable :items="items || []" @delete="onDelete" @toggle="onToggle" />
      <p v-if="error" class="text-text-error text-body-md mt-6">{{ error }}</p>
    </div>
  </AdminLayout>

  <ConfirmDialog
    v-model="showDeleteConfirm"
    title="Hapus Amalan"
    :message="deleteTarget ? `Hapus amalan: ${deleteTarget.judul}?` : ''"
    confirm-label="Hapus"
    confirm-variant="danger"
    @confirm="confirmDelete"
    @cancel="resetDelete"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AmalanTable from '@/components/admin/AmalanTable.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { deleteAmalan, toggleAktif, type Amalan } from '@/services/amalanService'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import { useAdminAmalanListQuery } from '@/composables/useAmalanQueries'

const q = ref('')
const qDebounced = useDebouncedRef(q, 400)
const queryParams = computed(() => ({ q: qDebounced.value || undefined }))

const { data: items, error, refetch } = useAdminAmalanListQuery(queryParams)
const showDeleteConfirm = ref(false)
const deleteTarget = ref<Amalan | null>(null)

async function onDelete(item: Amalan) {
  deleteTarget.value = item
  showDeleteConfirm.value = true
}

function resetDelete() {
  deleteTarget.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  await deleteAmalan(deleteTarget.value.id)
  resetDelete()
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
