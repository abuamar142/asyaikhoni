<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div v-if="loadingPage" class="flex items-center justify-center py-20">
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
        <div v-if="markdownError" class="text-body-md text-text-error text-center py-12">
          Gagal memuat konten.
        </div>
        <div v-else-if="!hasMarkdownPath" class="text-body-md text-muted text-center py-12">
          Konten belum tersedia.
        </div>
        <div v-else-if="loadingMarkdown" class="flex items-center justify-center py-20">
          <p class="text-body-md text-muted">Memproses konten...</p>
        </div>
        <div
          v-else-if="html"
          class="prose prose-lg max-w-none text-text-primary"
          v-html="html"
        ></div>
        <div v-else class="text-body-md text-muted text-center py-12">Konten belum tersedia.</div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAmalanBySlugQuery, useMarkdownQuery } from '@/composables/useAmalanQueries'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const route = useRoute()

const slug = computed(() => route.params.slug as string)

const {
  data: amalan,
  isLoading: loadingAmalan,
  isFetching: fetchingAmalan,
  isError: amalanError,
} = useAmalanBySlugQuery(slug)

const hasMarkdownPath = computed(() => !!amalan.value?.md_bucket_id && !!amalan.value?.md_path)

const {
  data: markdownText,
  isLoading: loadingMarkdown,
  isError: markdownError,
  isFetching: fetchingMarkdown,
  refetch: refetchMarkdown,
} = useMarkdownQuery(
  computed(() => amalan.value?.md_bucket_id || ''),
  computed(() => amalan.value?.md_path || ''),
)

const html = ref('')
const loadingPage = computed(
  () => loadingAmalan.value || fetchingAmalan.value || (!amalan.value && !amalanError.value),
)

// Arabic Unicode ranges
const hasArabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

// Configure DOMPurify - allow span for Arabic text with lang attribute
const purifyConfig = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'a',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
    'img',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'span', // Allow span for Arabic text wrapping
  ],
  ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'lang', 'style', 'class'],
  KEEP_CONTENT: true,
}

// Trigger refetch when path becomes available
watch(hasMarkdownPath, (val) => {
  if (val) {
    refetchMarkdown()
  } else {
    html.value = ''
  }
})

// Process markdown when data is available, with logging to trace states
watch(
  [
    markdownText,
    loadingMarkdown,
    markdownError,
    fetchingMarkdown,
    amalan,
    loadingAmalan,
    fetchingAmalan,
    amalanError,
  ],
  async ([
    newMd,
    isLoadingMd,
    isErrorMd,
    isFetchingMd,
    amalanVal,
    loadingAmalanVal,
    fetchingAmalanVal,
    amalanErrVal,
  ]) => {
    // If amalan failed to load
    if (amalanErrVal) {
      html.value = ''
      return
    }

    // Waiting amalan
    if (loadingAmalanVal || fetchingAmalanVal || !amalanVal) {
      html.value = ''
      return
    }

    // No markdown path
    if (!hasMarkdownPath.value) {
      html.value = ''
      return
    }

    // Markdown error
    if (isErrorMd) {
      html.value = ''
      return
    }

    // Still loading markdown
    if (isLoadingMd || isFetchingMd) {
      return
    }

    // Markdown finished but empty
    if (!newMd || newMd.trim().length === 0) {
      html.value = ''
      return
    }

    try {
      const markedHtml = await marked(newMd)
      const processedHtml = wrapArabicText(markedHtml)
      html.value = DOMPurify.sanitize(processedHtml, purifyConfig)
    } catch (error) {
      console.error('Error processing markdown:', error)
      html.value = ''
    }
  },
  { immediate: true },
)

function wrapArabicText(htmlString: string): string {
  // Use DOM to wrap entire text nodes containing Arabic so alignment applies per sentence
  const temp = document.createElement('div')
  temp.innerHTML = htmlString

  const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT, null)
  const targets: Node[] = []

  let node: Node | null
  while ((node = walker.nextNode())) {
    const text = node.textContent || ''
    if (hasArabicRegex.test(text.trim())) {
      targets.push(node)
    }
  }

  targets.forEach((textNode) => {
    const span = document.createElement('span')
    span.className = 'ar-text'
    span.lang = 'ar'
    span.textContent = textNode.textContent
    textNode.parentNode?.replaceChild(span, textNode)
  })

  return temp.innerHTML
}
</script>

<style scoped>
:deep(.ar-text) {
  font-family: 'Amiri', serif !important;
  font-size: 1.1em;
  line-height: 2;
  text-align: right;
  direction: rtl;
  display: block;
  width: 100%;
}

:deep(.prose) {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
