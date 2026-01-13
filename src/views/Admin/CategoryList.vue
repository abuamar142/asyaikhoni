<template>
  <AdminLayout>
    <div class="bg-gradient-to-r from-primary-50 to-white border-b border-green-100 py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-heading-xl text-brand mb-1">Kategori</h1>
            <p class="text-body-md text-muted">Kelola kategori yang bisa dipakai oleh Amalan.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <form
          @submit.prevent="onSubmit"
          class="bg-white border border-green-100 rounded-lg p-6 space-y-4"
        >
          <div>
            <label class="block text-body-sm text-text-primary font-medium mb-2">Nama</label>
            <input
              v-model="form.nama"
              type="text"
              required
              class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Dzikir Pagi"
            />
          </div>
          <div>
            <label class="block text-body-sm text-text-primary font-medium mb-2"
              >Deskripsi (opsional)</label
            >
            <textarea
              v-model="form.deskripsi"
              rows="3"
              class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Keterangan singkat kategori"
            ></textarea>
          </div>
          <div class="flex items-center gap-3">
            <BaseButton type="submit" :disabled="isSaving" variant="primary">
              {{ isSaving ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Simpan' }}
            </BaseButton>
            <BaseButton type="button" variant="ghost" @click="resetForm">
              {{ isEditing ? 'Batal Edit' : 'Reset' }}
            </BaseButton>
          </div>
          <p v-if="formError" class="text-text-error text-body-sm">{{ formError }}</p>
        </form>

        <div class="lg:col-span-2">
          <div class="mb-4">
            <SearchInput v-model="search" placeholder="Cari kategori..." />
          </div>

          <div
            class="bg-white border border-green-100 rounded-lg divide-y divide-green-100"
            v-if="categories?.length"
          >
            <div
              v-for="item in categories"
              :key="item.id"
              class="px-4 py-3 flex items-center justify-between gap-4 hover:bg-primary-50/40"
            >
              <div>
                <p class="text-body-md text-text-primary font-semibold">{{ item.nama }}</p>
                <p v-if="item.deskripsi" class="text-caption text-text-secondary mt-1">
                  {{ item.deskripsi }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <BaseButton variant="secondary" size="sm" @click="onEdit(item)">Edit</BaseButton>
                <BaseButton
                  variant="danger"
                  size="sm"
                  :disabled="deleteMutation.isPending.value"
                  @click="onDelete(item)"
                >
                  Hapus
                </BaseButton>
              </div>
            </div>
          </div>
          <div v-else class="text-body-md text-muted py-6 text-center">
            {{ isLoading ? 'Memuat kategori...' : 'Belum ada kategori' }}
          </div>
          <p v-if="listError" class="text-text-error text-body-sm mt-4">{{ listError }}</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import {
  useCategoryListQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '@/composables/useCategoryQueries'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import BaseButton from '@/components/ui/BaseButton.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import type { Category } from '@/services/categoryService'

const search = ref('')
const debouncedSearch = useDebouncedRef(search, 400)
const form = ref<{ nama: string; deskripsi: string }>({ nama: '', deskripsi: '' })
const formError = ref('')
const listError = ref('')
const editId = ref<string | null>(null)

const {
  data,
  isLoading,
  error: listErr,
  refetch,
} = useCategoryListQuery(computed(() => ({ q: debouncedSearch.value || undefined })))

const categories = computed(() => data.value || [])

watch(debouncedSearch, () => {
  refetch()
})

watch(
  () => listErr?.value,
  (val) => {
    listError.value = val ? (val as Error).message : ''
  },
)

const createMutation = useCreateCategoryMutation()
const deleteMutation = useDeleteCategoryMutation()
const updateMutation = useUpdateCategoryMutation()

const isEditing = computed(() => Boolean(editId.value))
const isSaving = computed(() => createMutation.isPending.value || updateMutation.isPending.value)

function resetForm() {
  form.value = { nama: '', deskripsi: '' }
  formError.value = ''
  editId.value = null
}

async function onSubmit() {
  formError.value = ''
  try {
    if (editId.value) {
      await updateMutation.mutateAsync({ id: editId.value, data: { ...form.value } })
    } else {
      await createMutation.mutateAsync({ ...form.value })
    }
    resetForm()
    await refetch()
  } catch (e: unknown) {
    formError.value = (e as Error)?.message || 'Gagal menyimpan kategori'
  }
}

function onEdit(item: Category) {
  editId.value = item.id
  form.value = {
    nama: item.nama,
    deskripsi: item.deskripsi || '',
  }
  formError.value = ''
}

async function onDelete(item: Category) {
  if (!confirm(`Hapus kategori: ${item.nama}?`)) return
  await deleteMutation.mutateAsync(item.id)
  await refetch()
}
</script>
