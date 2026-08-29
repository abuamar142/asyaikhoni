<template>
  <div class="min-h-screen bg-[#fdfcf8] selection:bg-emerald-100 selection:text-emerald-900">
    <!-- reading progress -->
    <div
      v-if="amalan"
      class="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        class="h-full bg-emerald-700 transition-[width] duration-150 ease-out will-change-[width]"
        :style="{ width: progress + '%' }"
      ></div>
    </div>

    <!-- Loading page skeleton -->
    <div v-if="loadingPage" class="min-h-[70vh] flex flex-col">
      <div class="h-[52px] border-b border-[#e8e6de] bg-white/70"></div>
      <div class="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="max-w-[720px] mx-auto animate-pulse space-y-6">
          <div class="flex gap-2 justify-center"><div class="h-6 w-20 bg-stone-100 rounded-full"></div><div class="h-6 w-16 bg-stone-100 rounded-full"></div></div>
          <div class="h-10 bg-stone-100 rounded w-3/4 mx-auto"></div>
          <div class="h-4 bg-stone-50 rounded w-full"></div>
          <div class="h-4 bg-stone-50 rounded w-5/6 mx-auto"></div>
          <div class="h-px bg-stone-100 my-8"></div>
          <div class="space-y-3">
            <div class="h-4 bg-stone-100 rounded w-full"></div>
            <div class="h-4 bg-stone-100 rounded w-full"></div>
            <div class="h-4 bg-stone-100 rounded w-4/5"></div>
          </div>
        </div>
      </div>
      <p class="text-center text-[13px] tracking-wide text-stone-400 pb-10">Memuat khazanah…</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!amalan" class="min-h-[70vh] container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
      <div class="max-w-[560px] w-full text-center">
        <div class="mx-auto w-[88px] h-[88px] rounded-[22px] bg-white border border-[#e8e6de] shadow-sm inline-flex items-center justify-center">
          <SearchX class="w-9 h-9 text-stone-400" :stroke-width="1.6" />
        </div>
        <h1 class="mt-6 font-serif text-[24px] font-semibold tracking-[-0.015em] text-[#12291a]" style="font-family: 'Fraunces', Georgia, serif">Amalan tidak ditemukan</h1>
        <p class="mt-2 text-[14px] leading-[1.7] text-stone-500">Tautan mungkin salah atau konten telah dipindahkan.</p>
        <router-link
          :to="{ name: 'amalan-list' }"
          class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 text-white text-[13px] font-semibold hover:bg-emerald-800 shadow-sm transition-colors"
        >
          <ArrowLeft class="w-4 h-4" /> Kembali ke daftar
        </router-link>
      </div>
    </div>

    <!-- Article -->
    <article v-else class="relative">
      <!-- top breadcrumb bar -->
      <div class="sticky top-0 z-30 border-b border-[#e8e6de] bg-white/80 backdrop-blur-xl">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-[52px] gap-3">
            <router-link
              :to="{ name: 'amalan-list' }"
              class="inline-flex items-center gap-2 text-[13px] font-medium text-stone-600 hover:text-emerald-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 rounded-full px-2 -ml-2 py-1"
            >
              <span class="w-7 h-7 rounded-full bg-stone-50 border border-stone-200 inline-flex items-center justify-center">
                <ArrowLeft class="w-3.5 h-3.5" />
              </span>
              <span class="hidden sm:inline">Kembali ke daftar</span>
              <span class="sm:hidden">Daftar</span>
            </router-link>

            <div class="flex items-center gap-2">
              <span
                v-if="isSaved"
                class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold tracking-wide text-emerald-800"
              >
                <BookmarkCheck class="w-3.5 h-3.5" /> Tersimpan
              </span>
              <button
                type="button"
                class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e7e5e0] text-[13px] font-medium text-stone-700 hover:border-stone-300 hover:bg-stone-50 transition-colors shadow-sm"
                @click="handleShare"
              >
                <Share2 class="w-4 h-4 text-stone-500" />
                <span class="hidden sm:inline">Bagikan</span>
                <span class="sm:hidden">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero -->
      <div class="relative overflow-hidden border-b border-[#e8e6de] bg-white">
        <div aria-hidden="true" class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-0 opacity-[0.04]" style="background-image: radial-gradient(circle at 1px 1px, #15803d 1px, transparent 0); background-size: 24px 24px"></div>
          <div class="absolute -top-28 -right-28 w-[560px] h-[560px] rounded-full border border-emerald-100 opacity-30 hidden md:block"></div>
          <div class="absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full border border-amber-100 opacity-20 hidden md:block"></div>
          <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent"></div>
        </div>

        <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-[720px] mx-auto pt-10 sm:pt-12 md:pt-14 pb-10 md:pb-12 text-center">
            <!-- meta pills -->
            <div class="flex flex-wrap items-center justify-center gap-2 mb-5">
              <span
                v-for="cat in amalan.categories"
                :key="cat.id"
                class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold tracking-[0.08em] uppercase text-emerald-800"
                >{{ cat.nama }}</span
              >
              <span
                v-if="amalan.urutan != null"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-semibold tracking-[0.08em] uppercase text-stone-600"
              >
                <Hash class="w-3 h-3" /> Urutan {{ String(amalan.urutan).padStart(2, '0') }}
              </span>
              <span
                v-if="readingMinutes"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-[11px] font-medium text-amber-800"
              >
                <Clock3 class="w-3 h-3" /> {{ readingMinutes }} menit baca
              </span>
            </div>

            <h1
              class="font-serif text-[30px] sm:text-[36px] md:text-[42px] font-[600] tracking-[-0.025em] leading-[1.05] text-[#0f2318] text-balance"
              style="font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif"
            >
              {{ amalan.judul }}
            </h1>

            <p
              v-if="amalan.ringkasan"
              class="mt-4 text-[16px] sm:text-[17px] leading-[1.75] text-[#5a6d5f] max-w-[60ch] mx-auto text-pretty"
            >
              {{ amalan.ringkasan }}
            </p>

            <!-- ornament divider -->
            <div class="mt-8 flex items-center justify-center gap-3">
              <span class="h-px w-12 sm:w-16 bg-emerald-200"></span>
              <span class="w-1.5 h-1.5 rotate-45 bg-emerald-700"></span>
              <span class="w-1 h-1 rounded-full bg-amber-400"></span>
              <span class="w-1.5 h-1.5 rotate-45 bg-emerald-700"></span>
              <span class="h-px w-12 sm:w-16 bg-emerald-200"></span>
            </div>

            <!-- actions -->
            <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-[13px] font-semibold transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/15"
                :class="
                  isSaved
                    ? 'bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800 shadow-[0_6px_16px_rgba(21,128,61,0.22)]'
                    : 'bg-white border-[#e7e5e0] text-stone-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800'
                "
                @click="toggleOffline"
              >
                <component :is="isSaved ? CheckCircle2 : Download" class="w-[18px] h-[18px]" :class="isSaved ? 'text-white' : 'text-emerald-700'" />
                {{ isSaved ? 'Tersimpan offline' : 'Simpan offline' }}
              </button>

              <button
                v-if="isSaved && hasUpdateAvailable"
                type="button"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-300 border border-amber-300 text-[#14532d] text-[13px] font-semibold hover:bg-amber-200 shadow-sm transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/30"
                @click="updateOffline"
              >
                <RefreshCw class="w-4 h-4" /> Update tersedia
              </button>

              <button
                v-if="!isSaved"
                type="button"
                class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#e7e5e0] text-stone-600 text-[13px] font-medium hover:bg-stone-50 transition-colors"
                @click="handleShare"
              >
                <Share2 class="w-4 h-4" /> Bagikan amalan
              </button>
            </div>

            <p v-if="isSaved && localData" class="mt-3 text-[11px] tracking-wide text-stone-500">
              Disimpan {{ formatDate(localData.saved_at) }} · Versi {{ localData.content_version }}
              <span v-if="hasUpdateAvailable" class="text-amber-700 font-medium">· Pembaruan tersedia</span>
            </p>

            <p v-else class="mt-3 text-[11px] tracking-wide text-stone-400">Simpan untuk akses tanpa koneksi di Koleksi Saya</p>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div class="max-w-[720px] mx-auto">
          <!-- error / empty -->
          <div v-if="markdownError" class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div class="w-10 h-10 rounded-full bg-white border border-red-200 inline-flex items-center justify-center mb-3">
              <AlertTriangle class="w-5 h-5 text-red-600" />
            </div>
            <p class="text-[14px] font-medium text-red-900">Gagal memuat konten</p>
            <p class="text-[13px] text-red-700/70 mt-1">Periksa koneksi dan coba muat ulang.</p>
            <button type="button" class="mt-4 px-4 py-2 rounded-full bg-white border border-red-200 text-[13px] font-semibold text-red-700 hover:bg-red-50" @click="refetchMarkdown">Muat ulang</button>
          </div>

          <div v-else-if="!hasMarkdownPath" class="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <div class="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 inline-flex items-center justify-center mx-auto mb-3">
              <FileText class="w-6 h-6 text-stone-400" />
            </div>
            <p class="text-[14px] font-medium text-stone-700">Konten belum tersedia</p>
            <p class="text-[13px] text-stone-500 mt-1">Naskah amalan ini sedang disiapkan oleh pengasuh.</p>
          </div>

          <div v-else-if="loadingMarkdown" class="py-8 space-y-4 animate-pulse">
            <div class="h-4 bg-stone-100 rounded w-3/4"></div>
            <div class="h-4 bg-stone-100 rounded w-full"></div>
            <div class="h-4 bg-stone-100 rounded w-5/6"></div>
            <div class="h-32 bg-stone-50 rounded-xl border border-stone-100 mt-6"></div>
            <div class="h-4 bg-stone-100 rounded w-full"></div>
            <div class="h-4 bg-stone-100 rounded w-4/5"></div>
          </div>

          <div v-else-if="html" class="relative">
            <!-- decorative side line on desktop -->
            <div aria-hidden="true" class="hidden lg:block absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-stone-200 to-transparent"></div>

            <div
              class="prose prose-stone max-w-none
                prose-headings:font-serif prose-headings:tracking-[-0.015em] prose-headings:text-[#0f2318]
                prose-h1:text-[26px] prose-h1:leading-tight prose-h1:font-semibold
                prose-h2:text-[22px] prose-h2:leading-tight prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-[#eee9dd]
                prose-h3:text-[18px] prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-[15.6px] prose-p:leading-[1.88] prose-p:text-[#2b3a2e] prose-p:tracking-[-0.01em]
                prose-a:text-emerald-700 prose-a:font-medium prose-a:underline prose-a:decoration-emerald-200 prose-a:underline-offset-4 hover:prose-a:decoration-emerald-700 hover:prose-a:text-emerald-800
                prose-strong:text-[#0f2318] prose-strong:font-semibold
                prose-blockquote:border-l-[3px] prose-blockquote:border-emerald-600 prose-blockquote:bg-emerald-50/40 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:my-6 prose-blockquote:text-[#2b3a2e] prose-blockquote:not-italic
                prose-ul:my-6 prose-ol:my-6 prose-li:text-[15.2px] prose-li:leading-[1.75] prose-li:text-[#2b3a2e] prose-li:marker:text-emerald-700
                prose-code:text-[13px] prose-code:bg-stone-100 prose-code:text-stone-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#0f2318] prose-pre:text-stone-100 prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10
                prose-img:rounded-xl prose-img:border prose-img:border-stone-200 prose-img:shadow-sm
                prose-table:text-[14px] prose-th:bg-stone-50 prose-th:text-stone-700 prose-th:font-semibold prose-td:border-stone-200 prose-th:border-stone-200"
              v-html="html"
            ></div>

            <!-- bottom ornament -->
            <div class="mt-12 flex items-center justify-center gap-3">
              <span class="h-px w-10 bg-stone-200"></span>
              <span class="text-stone-400 text-[11px] tracking-[0.16em] uppercase font-semibold">selesai</span>
              <span class="w-1 h-1 rounded-full bg-emerald-600"></span>
              <span class="h-px w-10 bg-stone-200"></span>
            </div>
          </div>

          <div v-else class="rounded-2xl border border-stone-200 bg-white p-10 text-center text-stone-500">Konten belum tersedia.</div>
        </div>
      </div>

      <!-- bottom bar -->
      <div class="border-t border-[#e8e6de] bg-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="max-w-[720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <router-link
              :to="{ name: 'amalan-list' }"
              class="inline-flex items-center gap-2 text-[13px] font-medium text-stone-600 hover:text-emerald-800 transition-colors"
            >
              <ArrowLeft class="w-4 h-4" /> Kembali ke daftar amalan
            </router-link>
            <div class="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-stone-400">
              <span class="w-6 h-px bg-stone-200 hidden sm:block"></span>
              <span>PPTQ Asy-Syaikhôni</span>
              <span class="w-1 h-1 rounded-full bg-stone-300"></span>
              <span class="normal-case tracking-normal font-medium text-stone-500">Nganjuk</span>
            </div>
          </div>
        </div>
      </div>
    </article>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAmalanBySlugQuery, useMarkdownQuery } from '@/composables/useAmalanQueries'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import {
  Download,
  CheckCircle2,
  RefreshCw,
  Share2,
  ArrowLeft,
  Hash,
  Clock3,
  BookmarkCheck,
  SearchX,
  AlertTriangle,
  FileText,
} from 'lucide-vue-next'
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

const hasMarkdownPath = computed(() => !!amalan.value?.id)

const {
  data: markdownText,
  isLoading: loadingMarkdown,
  isError: markdownError,
  isFetching: fetchingMarkdown,
  refetch: refetchMarkdown,
} = useMarkdownQuery(computed(() => amalan.value?.id || ''))

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
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
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
    await db.saved_amalan.where('amalan_id').equals(amalan.value.id).delete()
    isSaved.value = false
    localData.value = null
    toast.success('Dihapus dari koleksi offline.')
  } else {
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

const progress = ref(0)
function onScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
  progress.value = Math.min(100, Math.max(0, pct))
}

const readingMinutes = computed(() => {
  const text = markdownText.value || localData.value?.content || ''
  if (!text) return 0
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 180))
})

function formatDate(ts?: number | null) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function handleShare() {
  const url = window.location.href
  const title = amalan.value?.judul || 'Amalan'
  try {
    if (navigator.share) {
      await navigator.share({ title, url })
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      toast.success('Tautan disalin ke clipboard.')
    } else {
      toast.success('Tautan: ' + url)
    }
  } catch {
    // user cancelled
  }
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
    'span',
  ],
  ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'lang', 'style', 'class', 'id'],
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
    let finalMd = newMd
    let finalAmalan: any = amalanVal

    if ((amalanErrVal || isErrorMd || isLoadingMd || loadingAmalanVal) && localData.value) {
      finalMd = localData.value.content
      finalAmalan = {
        judul: localData.value.judul,
        ringkasan: localData.value.ringkasan,
      } as any
    }

    if (!finalAmalan && !loadingAmalanVal && !fetchingAmalanVal) {
      html.value = ''
      return
    }

    if (!finalAmalan) {
      return
    }

    if (finalMd && finalMd.trim().length > 0) {
      try {
        // add ids to headings for TOC before purify? marked can generate ids via headerIds, but we do simple
        const markedHtml = await marked(finalMd)
        const processedHtml = wrapArabicText(markedHtml as string)
        // add heading ids if missing
        const withIds = addHeadingIds(processedHtml)
        html.value = DOMPurify.sanitize(withIds, purifyConfig)
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

function addHeadingIds(htmlString: string): string {
  const temp = document.createElement('div')
  temp.innerHTML = htmlString
  const headings = temp.querySelectorAll('h2, h3')
  headings.forEach((h) => {
    if (!h.id) {
      const text = (h.textContent || '').trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '')
      h.id = text || 'heading-' + Math.random().toString(36).slice(2, 6)
    }
  })
  return temp.innerHTML
}

function wrapArabicText(htmlString: string): string {
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
  font-size: 1.35em;
  line-height: 2.05;
  text-align: right;
  direction: rtl;
  display: block;
  width: 100%;
  background: linear-gradient(to bottom, transparent 0, transparent 100%);
  color: #0f2a1a;
  font-weight: 400;
  letter-spacing: 0;
  padding: 0.2em 0;
}

:deep(.prose h2) {
  font-family: 'Fraunces', Georgia, serif !important;
}

:deep(.prose h3) {
  font-family: 'Fraunces', Georgia, serif !important;
}

:deep(.prose blockquote p) {
  margin: 0;
  font-size: 15px;
}

:deep(.prose hr) {
  border-color: #eee9dd;
  margin: 2.2rem 0;
}

@media (prefers-reduced-motion: reduce) {
  .transition-\[width\] {
    transition: none !important;
  }
}
</style>
