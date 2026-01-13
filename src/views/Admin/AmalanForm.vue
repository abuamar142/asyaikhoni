<template>
  <AdminLayout>
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
          :categories="categoryOptions"
          @update:model="onUpdateModel"
          @update:mdContent="onUpdateMd"
        />
        <div class="flex items-center gap-3 pt-4 border-t border-green-100">
          <BaseButton :disabled="loading" type="submit" variant="primary">
            {{ loading ? 'Menyimpan...' : 'Simpan' }}
          </BaseButton>
          <BaseButton
            as="router-link"
            variant="ghost"
            :to="{ name: 'admin-amalan-list' }"
            class="text-text-primary"
          >
            Batal
          </BaseButton>
        </div>
        <p v-if="error" class="text-text-error text-body-md">{{ error }}</p>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AmalanFormFields from '@/components/admin/AmalanFormFields.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCategoryListQuery } from '@/composables/useCategoryQueries'
import type { Category } from '@/services/categoryService'
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

const form = ref<Partial<Amalan>>({ aktif: true, kategori_ids: [] })
const mdContent = ref('')
const loading = ref(false)
const error = ref('')
const { data: categories } = useCategoryListQuery()

const categoryOptions = computed<Category[]>(() => categories?.value ?? [])

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
      form.value.kategori_ids = data.kategori_ids || []
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
      await updateAmalan(id, {
        ...form.value,
        kategoriIds: form.value.kategori_ids || [],
        mdFile: file,
      })
    } else {
      await createAmalan({
        judul: (form.value.judul as string) || '',
        slug: (form.value.slug as string) || '',
        ringkasan: (form.value.ringkasan as string) || '',
        ikon_url: (form.value.ikon_url as string) || '',
        urutan: (form.value.urutan as number) || undefined,
        aktif: Boolean(form.value.aktif),
        kategoriIds: form.value.kategori_ids || [],
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
