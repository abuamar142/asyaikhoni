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
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex-1">
              <h1 class="text-heading-xl text-brand mb-3">{{ amalan.judul }}</h1>
              <p v-if="amalan.ringkasan" class="text-body-md text-muted">{{ amalan.ringkasan }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <!-- Save Offline Button -->
              <button
                @click="toggleOffline"
                class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200"
                :class="
                  isSaved
                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-brand hover:text-brand'
                "
              >
                <component
                  :is="isSaved ? CheckCircle : Download"
                  class="w-5 h-5"
                  :class="{ 'text-green-600': isSaved }"
                />
                <span class="font-medium">{{
                  isSaved ? 'Tersimpan Offline' : 'Simpan Offline'
                }}</span>
              </button>

              <button
                v-if="isSaved && hasUpdateAvailable"
                @click="updateOffline"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition-all duration-200"
              >
                <RefreshCw class="w-5 h-5 text-orange-600" />
                <span class="font-medium">Update Tersedia</span>
              </button>
            </div>
          </div>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAmalanBySlugQuery, useMarkdownQuery } from '@/composables/useAmalanQueries'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { Download, CheckCircle, RefreshCw } from 'lucide-vue-next'
import { db, type LocalSavedAmalan } from '@/utils/localDb'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const toast = useToast()

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

// Offline Logic
const isSaved = ref(false)
const hasUpdateAvailable = ref(false)
const localData = ref<LocalSavedAmalan | null>(null)

async function checkOfflineStatus() {
  if (!amalan.value?.id) return
  const local = await db.saved_amalan.where('amalan_id').equals(amalan.value.id).first()
  if (local) {
    isSaved.value = true
    localData.value = local
    hasUpdateAvailable.value = local.content_version < (amalan.value.content_version || 1)
  } else {
    isSaved.value = false
    localData.value = null
    hasUpdateAvailable.value = false
  }
}

onMounted(() => {
  checkOfflineStatus()
})

watch(amalan, () => {
  checkOfflineStatus()
})

async function toggleOffline() {
  if (!amalan.value || !markdownText.value) {
    toast.error('Konten belum siap untuk disimpan offline.')
    return
  }

  if (isSaved.value) {
    // Remove from offline
    await db.saved_amalan.where('amalan_id').equals(amalan.value.id).delete()
    isSaved.value = false
    localData.value = null
    toast.success('Dihapus dari koleksi offline.')
  } else {
    // Save to offline
    await db.saved_amalan.add({
      amalan_id: amalan.value.id,
      judul: amalan.value.judul,
      slug: amalan.value.slug,
      ringkasan: amalan.value.ringkasan,
      content: markdownText.value,
      content_version: amalan.value.content_version || 1,
      server_updated_at: amalan.value.updated_at || new Date().toISOString(),
      saved_at: Date.now(),
      last_synced_at: Date.now(),
      has_update_available: false,
      folder_id: 0,
    })
    isSaved.value = true
    toast.success('Berhasil disimpan offline.')
    checkOfflineStatus()
  }
}

async function updateOffline() {
  if (!amalan.value || !markdownText.value) return

  await db.saved_amalan
    .where('amalan_id')
    .equals(amalan.value.id)
    .modify({
      content: markdownText.value,
      content_version: amalan.value.content_version || 1,
      server_updated_at: amalan.value.updated_at || new Date().toISOString(),
      last_synced_at: Date.now(),
      has_update_available: false,
    })

  hasUpdateAvailable.value = false
  toast.success('Konten offline diperbarui.')
}

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
    // Determine source
    let finalMd = newMd
    let finalAmalan = amalanVal

    // If network fails or is loading, and we have local data, use it!
    if ((amalanErrVal || isErrorMd || isLoadingMd || loadingAmalanVal) && localData.value) {
      finalMd = localData.value.content
      finalAmalan = {
        judul: localData.value.judul,
        ringkasan: localData.value.ringkasan,
      } as any
    }

    // If no amalan at all (neither network nor local)
    if (!finalAmalan && !loadingAmalanVal && !fetchingAmalanVal) {
      html.value = ''
      return
    }

    // Waiting for either network or local check
    if (!finalAmalan) {
      return
    }

    // Process if we have MD
    if (finalMd && finalMd.trim().length > 0) {
      try {
        const markedHtml = await marked(finalMd)
        const processedHtml = wrapArabicText(markedHtml)
        html.value = DOMPurify.sanitize(processedHtml, purifyConfig)
      } catch (error) {
        console.error('Error processing markdown:', error)
        html.value = ''
      }
    } else if (!isLoadingMd && !loadingAmalanVal) {
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
