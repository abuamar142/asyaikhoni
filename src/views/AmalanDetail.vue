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
    <div v-else-if="!amalan && !hasOfflineFallback" class="min-h-[70vh] container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
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
                class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border text-[13px] font-medium transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                :class="
                  showLatin
                    ? 'bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800 shadow-[0_6px_16px_rgba(21,128,61,0.18)]'
                    : 'bg-white border-[#e7e5e0] text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                "
                :aria-pressed="showLatin ? 'true' : 'false'"
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
                v-for="cat in displayCategories"
                :key="cat.id || cat.nama"
                class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold tracking-[0.08em] uppercase text-emerald-800"
                >{{ cat.nama }}</span
              >
              <span
                v-if="effectiveAmalan?.urutan != null"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-semibold tracking-[0.08em] uppercase text-stone-600"
              >
                <Hash class="w-3 h-3" /> Urutan {{ String(effectiveAmalan.urutan).padStart(2, '0') }}
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
              {{ effectiveAmalan?.judul }}
            </h1>

            <p
              v-if="effectiveAmalan?.ringkasan"
              class="mt-4 text-[16px] sm:text-[17px] leading-[1.75] text-[#5a6d5f] max-w-[60ch] mx-auto text-pretty"
            >
              {{ effectiveAmalan?.ringkasan }}
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

      <!-- Body — Paper centered, lyrics only, no markdown fallback -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div class="max-w-[640px] mx-auto">
          <!-- error -->
          <div v-if="amalanError && !hasOfflineFallback" class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div class="w-10 h-10 rounded-full bg-white border border-red-200 inline-flex items-center justify-center mb-3">
              <AlertTriangle class="w-5 h-5 text-red-600" />
            </div>
            <p class="text-[14px] font-medium text-red-900">Gagal memuat konten</p>
            <p class="text-[13px] text-red-700/70 mt-1">Periksa koneksi dan coba muat ulang.</p>
          </div>

          <!-- empty: no lyrics -->
          <div v-else-if="!hasLyrics" class="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <div class="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 inline-flex items-center justify-center mx-auto mb-3">
              <FileText class="w-6 h-6 text-stone-400" />
            </div>
            <p class="text-[14px] font-medium text-stone-700">Konten belum tersedia</p>
            <p class="text-[13px] text-stone-500 mt-1">Naskah amalan ini sedang disiapkan oleh pengasuh.</p>
          </div>

            <!-- lyrics paper -->
            <div v-else class="relative">
              <div class="amalan-paper">
                <div class="amalan-paper__texture" aria-hidden="true"></div>
                <div class="amalan-paper__inner-border" aria-hidden="true"></div>

                <div class="amalan-paper__content">
                  <!-- lyric title header — now INSIDE paper: JUDUL (arab + latin) → DIVIDER → LIRIK -->
                  <div v-if="arabTitle" class="lyric-title-header text-center mb-6 sm:mb-7">
                    <div
                      class="title-ar text-center font-amiri text-[32px] sm:text-[36px] leading-[1.3] text-[#0f2318]"
                      dir="rtl"
                      lang="ar"
                      style="font-family: 'Amiri', serif"
                    >
                      {{ arabTitle }}
                    </div>
                    <div
                      v-if="hasTitleLatin"
                      v-show="showLatin"
                      class="title-latin latin text-center text-[15px] sm:text-[16px] italic leading-[1.6] text-[#6e7d71] mt-2"
                      style="font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif"
                    >
                      {{ latinTitle }}
                    </div>
                    <div class="lyric-title-ornament mt-5 flex items-center justify-center gap-3" aria-hidden="true">
                      <span class="h-px w-12 sm:w-16 bg-[#e8ddd0]"></span>
                      <span class="w-2 h-2 rotate-45 bg-emerald-700/90 shadow-[0_0_0_4px_#fdfcf8]"></span>
                      <span class="h-px w-12 sm:w-16 bg-[#e8ddd0]"></span>
                    </div>
                  </div>

                <!-- LYRIC ROWS: 1 baris = 1 row, selalu center, • = split 2-col center -->
                <div class="lyrics-container">
                  <div
                    v-for="(row, idx) in effectiveLyrics"
                    :key="row.id || idx"
                    class="lyric-row"
                  >
                    <!-- Arab: selalu center, jika ada • maka 2 kolom center dengan bullet -->
                    <div
                      class="lyric-arab"
                      dir="rtl"
                      lang="ar"
                    >
                      <template v-if="hasBullet(row.arab)">
                        <div class="lyric-split">
                          <span class="arab-cell">{{ splitBullet(row.arab)[0] }}</span>
                          <span class="bullet" aria-hidden="true">•</span>
                          <span class="arab-cell">{{ splitBullet(row.arab)[1] }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <span class="arab-single">{{ row.arab }}</span>
                      </template>
                    </div>

                    <!-- Latin: di bawah Arab, juga split jika ada •, hide via showLatin -->
                    <div
                      v-if="row.latin && showLatin"
                      class="lyric-latin"
                    >
                      <template v-if="hasBullet(row.latin!)">
                        <div class="lyric-split lyric-split--latin">
                          <span class="latin-cell">{{ splitBullet(row.latin!)[0] }}</span>
                          <span class="bullet bullet--latin" aria-hidden="true">•</span>
                          <span class="latin-cell">{{ splitBullet(row.latin!)[1] }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <span class="latin-single">{{ row.latin }}</span>
                      </template>
                    </div>
                  </div>
                </div>

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

            <!-- outside bottom ornament -->
            <div class="mt-8 flex items-center justify-center gap-3">
              <span class="h-px w-10 bg-stone-200"></span>
              <span class="text-stone-400 text-[10px] tracking-[0.16em] uppercase font-semibold">selesai</span>
              <span class="w-1 h-1 rounded-full bg-emerald-600"></span>
              <span class="h-px w-10 bg-stone-200"></span>
            </div>

            <!-- latin hint when hidden -->
            <p v-if="!showLatin && hasAnyLatin" class="mt-4 text-center text-[11px] tracking-wide text-stone-400">
              Transliterasi Latin disembunyikan — ketuk <span class="font-medium text-stone-600">Latin • Tampilkan</span> untuk melihat.
            </p>
          </div>
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAmalanBySlugQuery } from '@/composables/useAmalanQueries'
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
const { showLatin, toggleLatin } = useLatinToggle()

const slug = computed(() => route.params.slug as string)

const {
  data: amalan,
  isLoading: loadingAmalan,
  isFetching: fetchingAmalan,
  isError: amalanError,
} = useAmalanBySlugQuery(slug)

// effective amalan: online or offline fallback
const hasOfflineFallback = computed(() => !!localData.value && !!localData.value.lyrics?.length)
const effectiveAmalan = computed(() => {
  if (amalan.value) return amalan.value
  if (localData.value) {
    return {
      id: localData.value.amalan_id,
      judul: localData.value.judul,
      slug: localData.value.slug,
      ringkasan: localData.value.ringkasan,
      lyrics: localData.value.lyrics || [],
      kategori_ids: [],
      categories: [],
      urutan: null,
      aktif: true,
      content_version: localData.value.content_version,
    } as any
  }
  return null
})

const displayCategories = computed(() => {
  return (effectiveAmalan.value?.categories as any[]) || []
})

// lyrics helpers: 1 row = 1 baris, • = split 2-col center
function hasBullet(text: string | null | undefined): boolean {
  return !!text && text.includes('•')
}
function splitBullet(text: string): [string, string] {
  const parts = text.split('•').map((s) => s.trim())
  // join extra parts beyond 2 with • again (future-proof)
  if (parts.length > 2) {
    const mid = Math.floor(parts.length / 2)
    return [parts.slice(0, mid).join(' • '), parts.slice(mid).join(' • ')]
  }
  return [parts[0] || '', parts[1] || '']
}

const effectiveLyrics = computed(() => {
  // prefer online lyrics, fallback to offline
  const online = amalan.value?.lyrics
  if (online && Array.isArray(online) && online.length > 0) return online
  const offline = localData.value?.lyrics
  if (offline && Array.isArray(offline) && offline.length > 0) return offline
  // also try to parse offline content JSON if lyrics not stored separately (backwards compat)
  if (localData.value?.content) {
    try {
      const parsed = JSON.parse(localData.value.content)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.arab) return parsed
    } catch {}
  }
  return []
})

const hasLyrics = computed(() => effectiveLyrics.value.length > 0)
const hasAnyLatin = computed(() => effectiveLyrics.value.some((r) => !!r.latin))

// Offline Logic
const isSaved = ref(false)
const hasUpdateAvailable = ref(false)
const localData = ref<LocalSavedAmalan | null>(null)

async function checkOfflineStatus() {
  const id = amalan.value?.id || effectiveAmalan.value?.id
  if (!id) return
  const local = await db.saved_amalan.where('amalan_id').equals(id).first()
  if (local) {
    isSaved.value = true
    localData.value = local
    const serverVer = amalan.value?.content_version ?? local.content_version
    hasUpdateAvailable.value = local.content_version < serverVer
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
  const src = effectiveAmalan.value
  const lyricsToSave = effectiveLyrics.value
  if (!src || !lyricsToSave.length) {
    toast.error('Konten belum siap untuk disimpan offline.')
    return
  }

  if (isSaved.value) {
    await db.saved_amalan.where('amalan_id').equals(src.id).delete()
    isSaved.value = false
    localData.value = null
    toast.success('Dihapus dari koleksi offline.')
  } else {
    await db.saved_amalan.add({
      amalan_id: src.id,
      judul: src.judul,
      slug: src.slug,
      ringkasan: src.ringkasan,
      content: JSON.stringify(lyricsToSave),
      lyrics: lyricsToSave,
      content_version: (src as any).content_version || 1,
      server_updated_at: (src as any).updated_at || (src as any).updatedAt || new Date().toISOString(),
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
  const src = amalan.value
  const lyricsToSave = effectiveLyrics.value
  if (!src || !lyricsToSave.length) return

  await db.saved_amalan
    .where('amalan_id')
    .equals(src.id)
    .modify({
      content: JSON.stringify(lyricsToSave),
      lyrics: lyricsToSave,
      content_version: src.content_version || 1,
      server_updated_at: src.updated_at || (src as any).updatedAt || new Date().toISOString(),
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

// — Lyric title header: split `judul` into Arab + Latin (e.g. "حَلَّ الرَّبِيع — Halla Rabi") —
const arabicRe = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
const latinReHeader = /[A-Za-z]/
// em/en dash may appear without spaces ("A—B"), hyphen must have spaces to avoid "Asy-Syaikhoni"
const titleSplitRe = /\s*[—–]\s*|\s+-\s+/
const rawTitle = computed(() => (effectiveAmalan.value?.judul || '').trim())
const arabTitle = computed(() => {
  const raw = rawTitle.value
  if (!raw) return ''
  const parts = raw.split(titleSplitRe)
  if (parts.length >= 2) {
    const a = parts[0].trim()
    const b = parts.slice(1).join(' — ').trim()
    if (!a || !b) return raw
    const aIsArab = arabicRe.test(a)
    const bIsArab = arabicRe.test(b)
    if (aIsArab && !bIsArab) return a
    if (!aIsArab && bIsArab) return b
    if (aIsArab && bIsArab) return raw // both arabic — keep original
    if (!aIsArab && !bIsArab) return raw // both latin — keep original as single line
    return a
  }
  return raw
})
const latinTitle = computed(() => {
  const raw = rawTitle.value
  if (!raw) return ''
  const parts = raw.split(titleSplitRe)
  if (parts.length >= 2) {
    const a = parts[0].trim()
    const b = parts.slice(1).join(' — ').trim()
    const aIsArab = arabicRe.test(a)
    const bIsArab = arabicRe.test(b)
    const aIsLatin = latinReHeader.test(a) && !aIsArab
    const bIsLatin = latinReHeader.test(b) && !bIsArab
    if (aIsArab && bIsLatin) return b
    if (aIsLatin && bIsArab) return a
    if (aIsArab && bIsArab) return '' // no latin when both arabic
    if (!aIsArab && !bIsArab) return '' // both latin — no separate latin line
    // ambiguous: if b looks latin, treat as latin
    if (bIsLatin) return b
    if (aIsLatin) return a
    return ''
  }
  return ''
})
const hasTitleLatin = computed(() => !!latinTitle.value)

const readingMinutes = computed(() => {
  const lyrics = effectiveLyrics.value
  if (!lyrics.length) return 0
  const text = lyrics.map((r) => `${r.arab} ${r.latin || ''}`).join(' ')
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 180))
})

function formatDate(ts?: number | null) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function handleShare() {
  const url = window.location.href
  const title = effectiveAmalan.value?.judul || 'Amalan'
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

const loadingPage = computed(
  () => loadingAmalan.value || fetchingAmalan.value || (!effectiveAmalan.value && !amalanError.value && !hasOfflineFallback.value),
)
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

/* ── Lyrics: 1 baris = 1 row, selalu center, • = 2 kolom center ── */
.lyrics-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.lyric-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px 10px 12px;
  border-radius: 12px;
  transition: background-color 180ms ease;
  text-align: center;
}
.lyric-row:hover {
  background: rgba(232, 230, 222, 0.22);
}
@media (min-width: 640px) {
  .lyric-row {
    padding: 14px 16px 12px;
  }
}

/* Arab: Amiri, 24px, rtl, center */
.lyric-arab {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
  line-height: 1.95;
  color: #0f2318;
  font-weight: 400;
  direction: rtl;
}
@media (min-width: 640px) {
  .lyric-arab {
    font-size: 1.55rem;
  }
}
.arab-single {
  display: block;
  width: 100%;
  text-align: center;
}
.lyric-split {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  width: 100%;
  text-align: center;
}
@media (min-width: 640px) {
  .lyric-split {
    gap: 28px;
  }
}
.arab-cell {
  flex: 1;
  text-align: center;
  font-family: 'Amiri', serif;
}
.arab-cell:first-child {
  text-align: center;
}
.arab-cell:last-child {
  text-align: center;
}
.bullet {
  flex-shrink: 0;
  color: #15803d;
  opacity: 0.55;
  font-size: 1.1rem;
  line-height: 1;
  user-select: none;
}

/* Latin: DM Sans 14px italic muted, center */
.lyric-latin {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.65;
  font-style: italic;
  font-weight: 400;
  color: #6e7d71;
  letter-spacing: 0.006em;
  margin-top: 2px;
}
.latin-single {
  display: block;
  width: 100%;
  text-align: center;
}
.lyric-split--latin {
  gap: 14px;
}
@media (min-width: 640px) {
  .lyric-split--latin {
    gap: 22px;
  }
}
.latin-cell {
  flex: 1;
  text-align: center;
  font-family: 'DM Sans', sans-serif;
  font-style: italic;
}
.bullet--latin {
  color: #6e7d71;
  opacity: 0.45;
  font-size: 0.9rem;
}

/* when Latin hidden, tighten rhythm - handled via v-if, but keep transition */
.lyric-row:has(.lyric-latin) {
  gap: 6px;
}

/* ── Lyric title header (dedicated header above paper) ── */
.lyric-title-header {
  animation: lyricTitleIn 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.font-amiri {
  font-family: 'Amiri', serif;
}
.title-ar {
  font-family: 'Amiri', serif;
  text-wrap: balance;
}
.title-latin {
  text-wrap: balance;
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
/* when Latin is hidden via v-show (display:none), margin collapses automatically;
   this ensures no extra gap remains */
.title-latin[style*='display: none'] {
  margin-top: 0 !important;
}
.lyric-title-ornament {
  opacity: 0.95;
}
@keyframes lyricTitleIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
