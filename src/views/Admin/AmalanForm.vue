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
    <div class="container mx-auto px-4 py-8 max-w-8xl">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <AmalanFormFields
          :model="form"
          :md-content="mdContent"
          @update:model="onUpdateModel"
          @update:mdContent="onUpdateMd"
        />
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
import {
  createAmalan,
  getById,
  updateAmalan,
  type Amalan,
  downloadMarkdown,
} from '@/services/amalanService'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string | undefined
const isEdit = computed(() => Boolean(id))

const form = ref<Partial<Amalan>>({ aktif: true })
const mdContent = ref('')
const loading = ref(false)
const error = ref('')

const onUpdateModel = (payload: Partial<Amalan>) => {
  form.value = { ...form.value, ...payload }
}

const onUpdateMd = (v: string) => {
  mdContent.value = v
}

onMounted(async () => {
  if (isEdit.value && id) {
    const data = await getById(id)
    if (data) {
      form.value = { ...data }
      try {
        const md = await downloadMarkdown(data.md_bucket_id, data.md_path)
        mdContent.value = md
      } catch (err) {
        console.error('Gagal memuat markdown', err)
      }
    }
  }
})

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    const content = mdContent.value?.trim()
    if (!content) throw new Error('Konten Markdown wajib diisi')

    const fileName = `${(form.value.slug || 'amalan').toString()}.md`
    const blob = new Blob([content], { type: 'text/markdown' })
    const file = new File([blob], fileName, { type: 'text/markdown' })

    if (isEdit.value && id) {
      await updateAmalan(id, { ...form.value, mdFile: file })
    } else {
      await createAmalan({
        judul: (form.value.judul as string) || '',
        slug: (form.value.slug as string) || '',
        ringkasan: (form.value.ringkasan as string) || '',
        kategori: (form.value.kategori as string) || '',
        ikon_url: (form.value.ikon_url as string) || '',
        urutan: (form.value.urutan as number) || undefined,
        aktif: Boolean(form.value.aktif),
        mdFile: file,
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
