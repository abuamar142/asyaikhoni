<template>
  <AdminLayout>
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-50 to-white border-b border-green-100 py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-heading-xl text-brand mb-1">Amalan</h1>
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

      <div v-if="isLoading" class="text-body-md text-muted py-8 text-center">Sedang memuat...</div>
      <div v-else-if="itemsList.length === 0" class="text-body-md text-muted py-8 text-center">
        Belum ada amalan.
      </div>
      <AmalanTable v-else :items="itemsList" @delete="onDelete" @toggle="onToggle" />
      <p v-if="error" class="text-text-error text-body-md mt-6">{{ error }}</p>
      <p v-if="actionError" class="text-text-error text-body-md mt-3">{{ actionError }}</p>
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
import { useToast } from '@/composables/useToast'

const q = ref('')
const qDebounced = useDebouncedRef(q, 400)
const queryParams = computed(() => ({ q: qDebounced.value || undefined }))

const { data: items, error, refetch, isLoading } = useAdminAmalanListQuery(queryParams)
const itemsList = computed(() => items.value || [])
const showDeleteConfirm = ref(false)
const deleteTarget = ref<Amalan | null>(null)
const actionError = ref('')
const { showToast } = useToast()

async function onDelete(item: Amalan) {
  deleteTarget.value = item
  showDeleteConfirm.value = true
}

function resetDelete() {
  deleteTarget.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  actionError.value = ''
  try {
    await deleteAmalan(deleteTarget.value.id)
    resetDelete()
    await refetch()
    showToast({ type: 'success', title: 'Amalan dihapus', message: 'Amalan berhasil dihapus.' })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Gagal menghapus amalan'
    actionError.value = message
    showToast({ type: 'error', title: 'Gagal menghapus', message })
  }
}

async function onToggle(item: Amalan) {
  actionError.value = ''
  try {
    await toggleAktif(item.id, !item.aktif)
    await refetch()
    showToast({
      type: 'success',
      title: 'Status diperbarui',
      message: `Amalan ${item.aktif ? 'dinonaktifkan' : 'diaktifkan'}.`,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Gagal memperbarui status'
    actionError.value = message
    showToast({ type: 'error', title: 'Gagal memperbarui', message })
  }
}

watch(qDebounced, () => {
  refetch()
})
</script>
