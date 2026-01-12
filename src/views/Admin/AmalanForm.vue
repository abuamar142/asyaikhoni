<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-50 to-white border-b border-green-100 py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-heading-xl text-brand">
          {{ isEdit ? 'Edit Amalan' : 'Tambah Amalan Baru' }}
        </h1>
      </div>
    </div>

    <!-- Form -->
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <AmalanFormFields :model="form" @file="(f) => (mdFile = f)" />
        <div class="flex items-center gap-3 pt-4 border-t border-green-100">
          <button
            :disabled="loading"
            type="submit"
            class="btn-primary inline-flex items-center gap-2 text-body-md disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Menyimpan...' : 'Simpan' }}
          </button>
          <router-link
            :to="{ name: 'admin-amalan-list' }"
            class="px-6 py-2 rounded-lg border border-green-200 hover:bg-primary-50 text-text-primary font-medium transition-all duration-200"
            >Batal</router-link
          >
        </div>
        <p v-if="error" class="text-text-error text-body-md">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AmalanFormFields from '@/components/admin/AmalanFormFields.vue'
import { createAmalan, getById, updateAmalan, type Amalan } from '@/services/amalanService'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string | undefined
const isEdit = computed(() => Boolean(id))

const form = ref<Partial<Amalan>>({ aktif: true })
let mdFile: File | undefined
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  if (isEdit.value && id) {
    const data = await getById(id)
    if (data) form.value = { ...data }
  }
})

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    if (isEdit.value && id) {
      await updateAmalan(id, { ...form.value, mdFile })
    } else {
      if (!mdFile) throw new Error('File Markdown wajib diunggah')
      await createAmalan({
        judul: (form.value.judul as string) || '',
        slug: (form.value.slug as string) || '',
        ringkasan: (form.value.ringkasan as string) || '',
        kategori: (form.value.kategori as string) || '',
        ikon_url: (form.value.ikon_url as string) || '',
        urutan: (form.value.urutan as number) || undefined,
        aktif: Boolean(form.value.aktif),
        mdFile,
      })
    }
    router.push({ name: 'admin-amalan-list' })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Gagal menyimpan'
  } finally {
    loading.value = false
  }
}
</script>
