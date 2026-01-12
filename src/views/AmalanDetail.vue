<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <p class="text-body-md text-muted">Sedang memuat konten...</p>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!amalan" class="container mx-auto px-4 py-12">
      <div class="text-center">
        <h1 class="text-heading-lg text-brand mb-2">Amalan Tidak Ditemukan</h1>
        <p class="text-body-md text-muted mb-6">Maaf, amalan yang Anda cari tidak tersedia.</p>
        <router-link :to="{ name: 'amalan-list' }" class="btn-primary"
          >Kembali ke Daftar</router-link
        >
      </div>
    </div>

    <!-- Content -->
    <article v-else>
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-50 to-white border-b border-green-100 py-12">
        <div class="container mx-auto px-4">
          <h1 class="text-heading-xl text-brand mb-3">{{ amalan.judul }}</h1>
          <p v-if="amalan.ringkasan" class="text-body-md text-muted">{{ amalan.ringkasan }}</p>
        </div>
      </div>

      <!-- Content Body -->
      <div class="container mx-auto px-4 py-12">
        <div class="prose prose-lg max-w-none text-text-primary" v-html="html"></div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getBySlug, downloadMarkdown, type Amalan } from '@/services/amalanService'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const route = useRoute()
const amalan = ref<Amalan | null>(null)
const loading = ref(false)
const html = ref('')

async function fetchDetail() {
  loading.value = true
  try {
    const slug = route.params.slug as string
    amalan.value = await getBySlug(slug)
    if (amalan.value) {
      const md = await downloadMarkdown(amalan.value.md_bucket_id, amalan.value.md_path)
      html.value = DOMPurify.sanitize(marked(md))
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchDetail)
</script>
