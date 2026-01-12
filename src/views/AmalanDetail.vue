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
        <div
          v-if="contentReady"
          class="prose prose-lg max-w-none text-text-primary"
          ref="contentRef"
          v-html="html"
        ></div>
        <div v-else class="flex items-center justify-center py-20">
          <p class="text-body-md text-muted">Memproses konten...</p>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'
import { useRoute } from 'vue-router'
import { getBySlug, downloadMarkdown, type Amalan } from '@/services/amalanService'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const route = useRoute()
const amalan = ref<Amalan | null>(null)
const loading = ref(false)
const html = ref('')
const contentRef = ref<HTMLElement>()
const contentReady = ref(false)
let styleApplied = false

const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

async function fetchDetail() {
  loading.value = true
  contentReady.value = false
  styleApplied = false
  try {
    const slug = route.params.slug as string
    amalan.value = await getBySlug(slug)
    if (amalan.value) {
      const md = await downloadMarkdown(amalan.value.md_bucket_id, amalan.value.md_path)
      const markedHtml = await marked(md)
      html.value = DOMPurify.sanitize(markedHtml)
      contentReady.value = true
    }
  } finally {
    loading.value = false
  }
}

function applyArabicStyling() {
  if (!contentRef.value || styleApplied) return

  const element = contentRef.value
  const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null)
  const nodesToWrap: Node[] = []

  let node
  while ((node = walk.nextNode())) {
    const text = node.textContent || ''
    if (arabicRegex.test(text)) {
      nodesToWrap.push(node)
    }
  }

  nodesToWrap.forEach((textNode) => {
    const span = document.createElement('span')
    span.classList.add('text-arabic')
    span.setAttribute('lang', 'ar')
    span.textContent = textNode.textContent
    textNode.parentNode?.replaceChild(span, textNode)
  })

  styleApplied = true
}

// Apply styling when content is updated
onUpdated(() => {
  if (contentReady.value && !styleApplied) {
    applyArabicStyling()
  }
})

onMounted(fetchDetail)
</script>

<style scoped>
:deep(.text-arabic) {
  font-family: 'Amiri', serif !important;
  font-size: 1.5rem !important;
  line-height: 2 !important;
  text-align: right !important;
  direction: rtl !important;
  display: block !important;
}
</style>
