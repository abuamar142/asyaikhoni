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
        <div class="max-w-[640px] mx-auto animate-pulse space-y-6">
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
      <!-- top breadcrumb bar - unchanged toolbar -->
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
                class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border text-[13px] font-medium transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                :class="
                  showLatin
                    ? 'bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800 shadow-[0_6px_16px_rgba(21,128,61,0.18)]'
                    : 'bg-white border-[#e7e5e0] text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                "
                :aria-pressed="String(showLatin)"
                :aria-label="showLatin ? 'Sembunyikan transliterasi Latin' : 'Tampilkan transliterasi Latin'"
                :title="showLatin ? 'Sembunyikan transliterasi Latin' : 'Tampilkan transliterasi Latin'"
                @click="toggleLatin"
              >
                <component :is="showLatin ? Eye : EyeOff" class="w-4 h-4" :class="showLatin ? 'text-white' : 'text-stone-500'" />
                <span class="hidden sm:inline">Latin</span>
                <span class="hidden sm:inline text-[11px] font-normal opacity-80">{{ showLatin ? 'Sembunyikan' : 'Tampilkan' }}</span>
                <span class="sm:hidden text-[11px]">{{ showLatin ? 'On' : 'Off' }}</span>
              </button>
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
          <div class="max-w-[640px] mx-auto pt-10 sm:pt-12 md:pt-14 pb-10 md:pb-12 text-center">
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
              class="font-serif text-[30px] sm:text-[36px] md:text-[40px] font-[600] tracking-[-0.025em] leading-[1.05] text-[#0f2318] text-balance"
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

      <!-- Body — Paper centered stacked layout -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div class="max-w-[640px] mx-auto">
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
            <div class="h-4 bg-stone-100 rounded w-3/4 mx-auto"></div>
            <div class="h-4 bg-stone-100 rounded w-full"></div>
            <div class="h-4 bg-stone-100 rounded w-5/6 mx-auto"></div>
            <div class="h-32 bg-stone-50 rounded-xl border border-stone-100 mt-6"></div>
            <div class="h-4 bg-stone-100 rounded w-full"></div>
            <div class="h-4 bg-stone-100 rounded w-4/5 mx-auto"></div>
          </div>

          <div v-else-if="html" class="relative">
            <!-- paper card -->
            <div class="amalan-paper">
              <!-- subtle paper texture overlay -->
              <div class="amalan-paper__texture" aria-hidden="true"></div>
              <!-- inner dotted border -->
              <div class="amalan-paper__inner-border" aria-hidden="true"></div>

              <div class="amalan-paper__content">
                <!-- top ornament inside paper -->
                <div class="flex items-center justify-center gap-2 mb-6 sm:mb-7" aria-hidden="true">
                  <span class="h-px w-8 bg-[#e8ddd0]"></span>
                  <span class="w-[18px] h-[1.5px] bg-emerald-700/30 rounded-full"></span>
                  <span class="w-1.5 h-1.5 rotate-45 bg-emerald-700/80"></span>
                  <span class="w-[18px] h-[1.5px] bg-emerald-700/30 rounded-full"></span>
                  <span class="h-px w-8 bg-[#e8ddd0]"></span>
                </div>

                <div
                  ref="contentRef"
                  :class="[
                    'prose-amalan prose prose-stone max-w-none',
                    !showLatin && 'hide-latin',
                  ]"
                  v-html="html"
                ></div>

                <!-- bottom ornament inside paper -->
                <div class="mt-8 sm:mt-10 flex flex-col items-center gap-3" aria-hidden="true">
                  <div class="flex items-center justify-center gap-2">
                    <span class="h-px w-10 bg-[#e8ddd0]"></span>
                    <span class="w-1.5 h-1.5 rotate-45 bg-emerald-700/50"></span>
                    <span class="h-px w-10 bg-[#e8ddd0]"></span>
                  </div>
                  <span class="text-[10px] tracking-[0.18em] uppercase font-semibold text-stone-400">— PPTQ Asy-Syaikhoni —</span>
                </div>
              </div>
            </div>

            <!-- outside bottom ornament — subtle -->
            <div class="mt-8 flex items-center justify-center gap-3">
              <span class="h-px w-10 bg-stone-200"></span>
              <span class="text-stone-400 text-[10px] tracking-[0.16em] uppercase font-semibold">selesai</span>
              <span class="w-1 h-1 rounded-full bg-emerald-600"></span>
              <span class="h-px w-10 bg-stone-200"></span>
            </div>

            <!-- latin hint when hidden -->
            <p v-if="!showLatin" class="mt-4 text-center text-[11px] tracking-wide text-stone-400">
              Transliterasi Latin disembunyikan — ketuk <span class="font-medium text-stone-600">Latin • Tampilkan</span> untuk melihat.
            </p>
          </div>

          <div v-else class="rounded-2xl border border-stone-200 bg-white p-10 text-center text-stone-500">Konten belum tersedia.</div>
        </div>
      </div>

      <!-- bottom bar -->
      <div class="border-t border-[#e8e6de] bg-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="max-w-[640px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
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
  Eye,
  EyeOff,
} from 'lucide-vue-next'
import { db, type LocalSavedAmalan } from '@/utils/localDb'
import { useToast } from '@/composables/useToast'
import { useLatinToggle } from '@/composables/useLatinToggle'

const route = useRoute()
const toast = useToast()
const { showLatin, toggleLatin, annotateLatin } = useLatinToggle()
const contentRef = ref<HTMLElement | null>(null)

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
    'div',
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
        const markedHtml = await marked(finalMd)
        const processedHtml = wrapArabicText(markedHtml as string)
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

// Latin toggle + couplet annotation after each html render
watch(html, async () => {
  await nextTick()
  if (!contentRef.value) return
  annotateLatin(contentRef.value)
  annotateCouplets(contentRef.value)
})

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

/**
 * After render: tag each paragraph that contains Arabic as a couplet.
 * Adds `couplet` class to p containing .ar-text so CSS can style stacked center.
 * Also splits h1 title "Arabic — Latin" (either order, em/en/hyphen dash) into
 * two stacked centered rows: Arabic (Amiri) on row 1 and Latin (DM Sans) on row 2
 * with class `latin` so existing `.hide-latin .latin{display:none}` hides the Latin row.
 */
function annotateCouplets(container: HTMLElement) {
  // headings that are titles — split into 2 rows when title contains " — "
  container.querySelectorAll('h1').forEach((h) => {
    h.classList.add('couplet-title')
    const raw = (h.textContent || '').trim()
    if (!raw) return
    const hasAr = hasArabicRegex.test(raw)
    const hasLatin = /[A-Za-z]/.test(raw)
    let arabicPart = ''
    let latinPart = ''
    let splitFound = false
    const dashRes: RegExp[] = [/\s*—\s*/, /\s*–\s*/, /\s+-\s+/]
    for (const re of dashRes) {
      if (re.test(raw)) {
        const parts = raw.split(re)
        if (parts.length >= 2) {
          let foundForThisRe = false
          for (let i = 1; i < parts.length; i++) {
            const left = parts.slice(0, i).join(' — ').trim()
            const right = parts.slice(i).join(' — ').trim()
            const lHasAr = hasArabicRegex.test(left)
            const rHasAr = hasArabicRegex.test(right)
            if (lHasAr !== rHasAr) {
              if (lHasAr) {
                arabicPart = left
                latinPart = right
              } else {
                arabicPart = right
                latinPart = left
              }
              splitFound = true
              foundForThisRe = true
              break
            }
          }
          if (foundForThisRe) break
          const first = parts[0].trim()
          const rest = parts.slice(1).join(' — ').trim()
          const fAr = hasArabicRegex.test(first)
          const rAr = hasArabicRegex.test(rest)
          if (fAr && !rAr) {
            arabicPart = first
            latinPart = rest
            splitFound = true
            break
          }
          if (!fAr && rAr) {
            arabicPart = rest
            latinPart = first
            splitFound = true
            break
          }
        }
      }
    }
    if (!splitFound && hasAr && hasLatin) {
      const firstArIdx = raw.search(hasArabicRegex)
      const firstLatinIdx = raw.search(/[A-Za-z]/)
      if (firstArIdx !== -1 && firstLatinIdx !== -1) {
        if (firstArIdx < firstLatinIdx) {
          const a = raw.slice(0, firstLatinIdx).trim()
          const l = raw.slice(firstLatinIdx).trim()
          if (hasArabicRegex.test(a) && /[A-Za-z]/.test(l) && !hasArabicRegex.test(l)) {
            arabicPart = a
            latinPart = l
            splitFound = true
          }
        } else {
          const l = raw.slice(0, firstArIdx).trim()
          const a = raw.slice(firstArIdx).trim()
          if (hasArabicRegex.test(a) && /[A-Za-z]/.test(l)) {
            arabicPart = a
            latinPart = l
            splitFound = true
          }
        }
      }
    }
    if (splitFound && arabicPart && latinPart) {
      h.textContent = ''
      h.classList.add('couplet-title--split')
      const arSpan = document.createElement('span')
      arSpan.className = 'ar-text title-ar'
      arSpan.lang = 'ar'
      arSpan.textContent = arabicPart
      const laSpan = document.createElement('span')
      laSpan.className = 'latin title-latin'
      laSpan.textContent = latinPart
      h.appendChild(arSpan)
      h.appendChild(laSpan)
    } else if (hasAr && !hasLatin) {
      const txt = raw
      h.textContent = ''
      const arSpan = document.createElement('span')
      arSpan.className = 'ar-text title-ar'
      arSpan.lang = 'ar'
      arSpan.textContent = txt
      h.appendChild(arSpan)
    } else if (!hasAr && hasLatin) {
      const txt = raw
      h.textContent = ''
      const laSpan = document.createElement('span')
      laSpan.className = 'title-latin-plain'
      laSpan.textContent = txt
      h.appendChild(laSpan)
    }
  })
  const allPs = Array.from(container.querySelectorAll('p'))
  const hrs = Array.from(container.querySelectorAll('hr'))
  const hasHr = hrs.length > 0

  allPs.forEach((p, idx) => {
    const hasAr = !!p.querySelector('.ar-text')
    const hasLatinEm = !!p.querySelector('em.latin')
    const hasAnyEm = !!p.querySelector('em')
    const txt = (p.textContent || '').trim()
    const isLast = idx === allPs.length - 1
    const afterHr = hasHr && hrs.some((hr) => {
      // check if this p follows an hr in DOM order
      let n: Element | null = hr.nextElementSibling
      while (n) {
        if (n === p) return true
        // skip over non-p? but footer is first p after hr normally
        if (n.tagName === 'P') break
        n = n.nextElementSibling
      }
      return false
    })

    if (hasAr) {
      p.classList.add('couplet')
      if (hasLatinEm) p.classList.add('couplet--with-latin')
      else p.classList.add('couplet--arab-only')
      return
    }

    // Non-arab paragraphs after hr or at the end are treated as footer attribution
    // even when they contain Latin (e.g., "*Al-Musthafa pembawa cahaya hidayah...*")
    if (hasAnyEm && (afterHr || (isLast && txt.length > 18 && txt.length < 320))) {
      // Distinguish true footer from stray Latin orphan that is immediate follow-up to Arabic
      // If this p immediately follows a couplet and is short, keep as orphan; else footer
      const prev = idx > 0 ? allPs[idx - 1] : null
      const prevIsCouplet = prev?.classList.contains('couplet')
      if (afterHr || !prevIsCouplet || txt.length > 60 || !hasLatinEm) {
        p.classList.add('couplet-footer')
        return
      }
    }

    if (hasLatinEm) {
      p.classList.add('couplet-latin-orphan')
    } else if (hasAnyEm && txt.length > 20 && txt.length < 240) {
      // fallback footer for non-latin italic
      p.classList.add('couplet-footer')
    }
  })

  // hr separators -> style as dotted
  container.querySelectorAll('hr').forEach((hr) => hr.classList.add('couplet-hr'))
}
</script>

<style scoped>
/* ── Paper card ── */
.amalan-paper {
  position: relative;
  background: #fdfcf8;
  border: 1px solid #e8e6de;
  border-radius: 20px;
  box-shadow:
    0 1px 2px rgba(31, 33, 26, 0.04),
    0 8px 24px rgba(31, 33, 26, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.9) inset;
  overflow: hidden;
}
.amalan-paper__texture {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.028;
  background-image:
    radial-gradient(circle at 1px 1px, #8a7a5a 1.2px, transparent 0),
    radial-gradient(circle at 1px 1px, #c2b59b 0.9px, transparent 0);
  background-size:
    22px 22px,
    22px 22px;
  background-position:
    0 0,
    11px 11px;
}
.amalan-paper__inner-border {
  position: absolute;
  inset: 10px;
  border: 1.35px dotted #e6ddd0;
  border-radius: 14px;
  pointer-events: none;
}
.amalan-paper__content {
  position: relative;
  padding: 28px 20px 26px;
}
@media (min-width: 640px) {
  .amalan-paper__content {
    padding: 40px 40px 36px;
  }
}
@media (min-width: 768px) {
  .amalan-paper__content {
    padding: 44px 48px 40px;
  }
}

/* ── Prose base ── */
:deep(.prose-amalan) {
  color: #2b3a2e;
  font-size: 15px;
  line-height: 1.85;
}

/* Title: first h1 centered — two stacked rows: Arabic (Amiri 28px) + Latin (DM Sans 16px) — dash removed */
:deep(.prose-amalan h1),
:deep(.prose-amalan .couplet-title) {
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif !important;
  text-align: center !important;
  font-size: 28px !important;
  line-height: 1.22 !important;
  font-weight: 600 !important;
  letter-spacing: -0.022em !important;
  color: #0f2318 !important;
  margin: 0 0 0.55em 0 !important;
  padding: 0 0 0.7em 0 !important;
  border-bottom: none !important;
  text-wrap: balance;
}
@media (min-width: 640px) {
  :deep(.prose-amalan h1),
  :deep(.prose-amalan .couplet-title) {
    font-size: 30px !important;
  }
}
/* Split title: flex column — gap 6px, Arabic row + Latin row centered */
:deep(.prose-amalan h1.couplet-title) {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
}
:deep(.prose-amalan h1 .title-ar) {
  display: block !important;
  width: 100% !important;
  font-family: 'Amiri', Georgia, serif !important;
  font-size: 28px !important;
  line-height: 1.35 !important;
  color: #14532d !important;
  font-weight: 400 !important;
  direction: rtl !important;
  text-align: center !important;
}
@media (min-width: 640px) {
  :deep(.prose-amalan h1 .title-ar) {
    font-size: 30px !important;
  }
}
:deep(.prose-amalan h1 .title-latin) {
  display: block !important;
  width: 100% !important;
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
  font-style: italic !important;
  font-weight: 400 !important;
  color: #6e7d71 !important;
  letter-spacing: 0.01em !important;
  text-align: center !important;
  margin-top: 0 !important;
}
:deep(.prose-amalan h1 .title-latin-plain) {
  display: block !important;
  width: 100% !important;
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif !important;
  font-size: inherit !important;
  font-style: normal !important;
  color: #0f2318 !important;
  text-align: center !important;
}
/* when Latin hidden, gap collapses — Arabic stays centered */
:deep(.hide-latin h1.couplet-title) {
  gap: 0 !important;
}
:deep(.prose-amalan h1 em),
:deep(.prose-amalan h1 .ar-text:not(.title-ar)) {
  text-align: center !important;
}
/* fallback for h1 that wasn't split (original inline case) — keep inline if not title-ar */
:deep(.prose-amalan h1:not(.couplet-title--split) .ar-text) {
  display: inline !important;
  width: auto !important;
  font-family: 'Amiri', Georgia, serif !important;
  font-size: 1em !important;
  color: #14532d !important;
  font-weight: 400 !important;
  direction: rtl !important;
  vertical-align: baseline;
}
/* when h1 is purely Arabic or mixed with dash, keep inline; if author puts Arabic on new line via markdown, br will break */
:deep(.prose-amalan h1:not(.couplet-title--split) br + .ar-text) {
  display: block !important;
  width: 100% !important;
  margin-top: 0.28em;
  font-size: 1.05em !important;
}

/* Section headings still centered but with subtle divider */
:deep(.prose-amalan h2) {
  font-family: 'Fraunces', Georgia, serif !important;
  text-align: center !important;
  font-size: 19px !important;
  line-height: 1.3 !important;
  font-weight: 600 !important;
  color: #0f2318 !important;
  margin: 2.2em 0 0.9em 0 !important;
  padding-bottom: 0.7em !important;
  border-bottom: 1px solid #eee9dd !important;
}
:deep(.prose-amalan h3) {
  font-family: 'Fraunces', Georgia, serif !important;
  text-align: center !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #1a3523 !important;
  margin: 1.8em 0 0.6em 0 !important;
}

/* ── Couplet: each p containing Arabic → stacked center ── */
:deep(.prose-amalan p) {
  text-align: center;
  margin: 0;
  color: #2b3a2e;
}

:deep(.prose-amalan p.couplet) {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  margin: 20px 0 !important;
  padding: 14px 10px 12px !important;
  text-align: center !important;
  border-radius: 12px;
  transition: background-color 180ms ease;
}
:deep(.prose-amalan p.couplet br) {
  display: none !important;
}
:deep(.prose-amalan p.couplet strong) {
  display: block !important;
  width: 100% !important;
  font-weight: 600 !important;
}
:deep(.prose-amalan p.couplet:hover) {
  background: rgba(232, 230, 222, 0.22);
}
@media (min-width: 640px) {
  :deep(.prose-amalan p.couplet) {
    margin: 22px 0 !important;
    padding: 14px 16px 12px !important;
  }
}

/* Arabic line — top of stack */
:deep(.ar-text) {
  font-family: 'Amiri', serif !important;
  font-size: 1.5rem !important; /* 24px */
  line-height: 1.95 !important;
  text-align: center !important;
  direction: rtl !important;
  display: block !important;
  width: 100% !important;
  color: #0f2318 !important;
  font-weight: 400 !important;
  letter-spacing: 0 !important;
  padding: 0 !important;
}
@media (min-width: 640px) {
  :deep(.ar-text) {
    font-size: 1.55rem !important;
  }
}

/* Latin — directly below arabic, DM Sans 14px italic muted */
:deep(.latin) {
  display: block !important;
  width: 100% !important;
  text-align: center !important;
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif !important;
  font-size: 14px !important;
  line-height: 1.65 !important;
  font-style: italic !important;
  font-weight: 400 !important;
  color: #6e7d71 !important; /* muted */
  letter-spacing: 0.006em !important;
  margin-top: 2px !important;
  transition: opacity 150ms ease;
}
:deep(.prose-amalan em:not(.latin)) {
  /* keep non-latin em (maybe footer) not styled as latin */
  font-style: italic;
}

/* When hide-latin, remove latin lines and tighten couplet rhythm */
:deep(.hide-latin .latin) {
  display: none !important;
}
:deep(.hide-latin p.couplet) {
  gap: 0 !important;
  margin: 16px 0 !important;
  padding: 10px 10px 8px !important;
}

/* Latim orphan (separate p with only latin after arab p) — center italic muted, tucked up */
:deep(.prose-amalan p.couplet-latin-orphan) {
  text-align: center !important;
  font-family: 'DM Sans', sans-serif !important;
  font-size: 14px !important;
  font-style: italic !important;
  color: #6e7d71 !important;
  margin: -10px 0 20px 0 !important;
  padding: 0 10px !important;
}

/* Footer attribution — last italic line centered emerald */
:deep(.prose-amalan p.couplet-footer) {
  text-align: center !important;
  font-style: italic !important;
  color: #4a6353 !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
  max-width: 36ch;
  margin: 26px auto 0 auto !important;
  padding: 12px 16px 0 !important;
  border-top: 1px dashed #e6ddd0;
  font-family: 'DM Sans', sans-serif !important;
}
:deep(.prose-amalan p.couplet-footer em) {
  color: #355a44 !important;
}

/* HR — dotted, centered, short */
:deep(.prose-amalan hr),
:deep(.prose-amalan .couplet-hr) {
  border: none !important;
  border-top: 1.5px dotted #e6ddd0 !important;
  margin: 28px auto !important;
  width: 72% !important;
  max-width: 320px;
  opacity: 1;
}

/* Blockquote — centered, soft emerald wash */
:deep(.prose-amalan blockquote) {
  text-align: center !important;
  border-left: none !important;
  border: 1px solid #dfe8dc !important;
  background: #f4f8f5 !important;
  border-radius: 14px !important;
  padding: 16px 20px !important;
  margin: 24px auto !important;
  max-width: 560px;
  font-style: italic;
  color: #2f4a38 !important;
}
:deep(.prose-amalan blockquote p) {
  margin: 0 !important;
  text-align: center !important;
  font-size: 14.5px !important;
}
:deep(.prose-amalan blockquote .ar-text) {
  color: #0f2318 !important;
}

/* Lists — keep centered but with left-aligned bullets inside max-w */
:deep(.prose-amalan ul),
:deep(.prose-amalan ol) {
  max-width: 520px;
  margin: 20px auto !important;
  text-align: left;
  color: #2b3a2e;
}
:deep(.prose-amalan li) {
  font-size: 14.8px !important;
  line-height: 1.7 !important;
  color: #2b3a2e !important;
  margin: 6px 0 !important;
}
:deep(.prose-amalan li::marker) {
  color: #15803d !important;
}

/* Links, strong, code */
:deep(.prose-amalan a) {
  color: #15803d !important;
  font-weight: 500 !important;
  text-decoration: underline !important;
  text-decoration-color: #bbf7d0 !important;
  text-underline-offset: 4px !important;
}
:deep(.prose-amalan a:hover) {
  color: #166534 !important;
  text-decoration-color: #15803d !important;
}
:deep(.prose-amalan strong) {
  color: #0f2318 !important;
  font-weight: 600 !important;
}
:deep(.prose-amalan code) {
  font-size: 13px !important;
  background: #f4f2ec !important;
  color: #3a3a2e !important;
  padding: 1px 6px !important;
  border-radius: 6px !important;
  font-weight: 500 !important;
}
:deep(.prose-amalan code)::before,
:deep(.prose-amalan code)::after {
  content: none !important;
}
:deep(.prose-amalan pre) {
  background: #0f2318 !important;
  color: #eef4e8 !important;
  border-radius: 14px !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
:deep(.prose-amalan img) {
  border-radius: 14px !important;
  border: 1px solid #e8e6de !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
  margin: 22px auto !important;
}
:deep(.prose-amalan table) {
  font-size: 14px !important;
  margin: 22px auto !important;
}
:deep(.prose-amalan th) {
  background: #f7f5f0 !important;
  color: #33403a !important;
  font-weight: 600 !important;
  border-color: #e8e6de !important;
}
:deep(.prose-amalan td),
:deep(.prose-amalan th) {
  border-color: #e8e6de !important;
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  :deep(.latin),
  .amalan-paper,
  :deep(.prose-amalan p.couplet) {
    transition: none !important;
  }
}
</style>
