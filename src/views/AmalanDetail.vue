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
      <div class="max-w-[560px] w-full">
        <EmptyState
          :icon="SearchX"
          title="Amalan tidak ditemukan"
          description="Tautan mungkin salah atau konten telah dipindahkan."
        >
          <template #actions>
            <router-link
              :to="{ name: 'amalan-list' }"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 text-white text-[13px] font-semibold hover:bg-emerald-800 shadow-sm transition-colors"
            >
              <ArrowLeft class="w-4 h-4" /> Kembali ke daftar
            </router-link>
          </template>
        </EmptyState>
      </div>
    </div>

    <!-- Article -->
    <article v-else class="relative">
      <!-- top breadcrumb bar -->
      <div class="sticky top-0 z-30 border-b border-[#e8e6de] bg-white/80 backdrop-blur-xl">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-[52px] gap-3">
            <BaseButton
              as="router-link"
              to="/amalan"
              variant="ghost"
              pill
              size="sm"
            >
              <ArrowLeft class="w-4 h-4" />
              <span class="hidden sm:inline">Kembali ke daftar</span>
              <span class="sm:hidden">Daftar</span>
            </BaseButton>

            <div class="flex items-center gap-2">
              <span
                v-if="isSaved"
                class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold tracking-wide text-emerald-800"
              >
                <BookmarkCheck class="w-3.5 h-3.5" /> Tersimpan
              </span>
              <!-- Gear settings button (replaces Latin pill) — visible on all breakpoints -->
              <BaseButton
                :variant="showSettings ? 'primary' : 'ghost'"
                pill
                size="sm"
                class="w-9 h-9 !p-0 shrink-0"
                aria-label="Pengaturan tampilan"
                title="Pengaturan tampilan"
                @click="showSettings = true"
              >
                <Settings class="w-4 h-4 transition-transform duration-300" :class="[showSettings ? 'text-white rotate-45' : 'text-stone-500', showSettings ? '' : 'hover:rotate-12']" />
              </BaseButton>
              <BaseButton variant="secondary" pill size="sm" class="text-[13px]" @click="handleShare">
                <Share2 class="w-4 h-4 text-stone-500" />
                <span class="hidden sm:inline">Bagikan</span>
                <span class="sm:hidden">Share</span>
              </BaseButton>
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
              <BaseButton
                :variant="isSaved ? 'primary' : 'secondary'"
                pill
                size="md"
                :disabled="isSaving"
                :aria-busy="isSaving ? 'true' : 'false'"
                class="text-[13px]"
                @click="toggleOffline"
              >
                <span
                  v-if="isSaving"
                  class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"
                  aria-hidden="true"
                ></span>
                <component
                  v-else
                  :is="isSaved ? CheckCircle2 : Download"
                  class="w-4 h-4 shrink-0"
                  :class="isSaved ? 'text-white' : 'text-emerald-700'"
                />
                {{ isSaving ? 'Menyimpan…' : isSaved ? 'Tersimpan offline' : 'Simpan offline' }}
              </BaseButton>

              <BaseButton
                v-if="isSaved"
                variant="secondary"
                pill
                size="md"
                class="text-[13px]"
                @click="openSaveToFolderModal"
              >
                <FolderPlus class="w-4 h-4 shrink-0 text-emerald-700" />
                Simpan ke folder lain
              </BaseButton>

              <BaseButton
                v-if="isSaved && hasUpdateAvailable"
                variant="warning"
                pill
                size="md"
                :disabled="isSaving"
                class="text-[13px]"
                @click="updateOffline"
              >
                <span
                  v-if="isSaving"
                  class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"
                  aria-hidden="true"
                ></span>
                <RefreshCw v-else class="w-4 h-4 shrink-0" /> {{ isSaving ? 'Memperbarui…' : 'Update tersedia' }}
              </BaseButton>

              <BaseButton
                v-if="!isSaved"
                variant="secondary"
                pill
                size="md"
                class="hidden sm:inline-flex text-[13px]"
                @click="handleShare"
              >
                <Share2 class="w-4 h-4 shrink-0" /> Bagikan amalan
              </BaseButton>
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
          <div v-else-if="!hasLyrics" class="rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
            <EmptyState
              :icon="FileText"
              title="Konten belum tersedia"
              description="Naskah amalan ini sedang disiapkan oleh pengasuh."
            />
          </div>

            <!-- lyrics paper -->
            <div v-else class="relative">
              <PaperCard :dark="isDark" :font-size="fontSize">
                <template #header>
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
                </template>

                <!-- LYRIC ROWS: 1 baris = 1 LyricRow, selalu center, • = split 2-col center -->
                <div class="lyrics-container">
                  <LyricRow
                    v-for="(row, idx) in effectiveLyrics"
                    :key="(row as any).id || idx"
                    :row="row as any"
                    :showLatin="showLatin"
                    :fontSize="fontSize"
                  />
                </div>

                <template #footer>
                  <!-- bottom ornament inside paper -->
                  <div class="mt-8 sm:mt-10 flex flex-col items-center gap-3" aria-hidden="true">
                    <div class="flex items-center justify-center gap-2">
                      <span class="h-px w-10 bg-[#e8ddd0]"></span>
                      <span class="w-1.5 h-1.5 rotate-45 bg-emerald-700/50"></span>
                      <span class="h-px w-10 bg-[#e8ddd0]"></span>
                    </div>
                    <span class="text-[10px] tracking-[0.18em] uppercase font-semibold text-stone-400">— PPTQ Asy-Syaikhoni —</span>
                  </div>
                </template>
              </PaperCard>

            <!-- outside bottom ornament -->
            <div class="mt-8 flex items-center justify-center gap-3">
              <span class="h-px w-10 bg-stone-200"></span>
              <span class="w-1 h-1 rounded-full bg-emerald-600"></span>
              <span class="text-stone-400 text-[10px] tracking-[0.16em] uppercase font-semibold">selesai</span>
              <span class="w-1 h-1 rounded-full bg-emerald-600"></span>
              <span class="h-px w-10 bg-stone-200"></span>
            </div>

            <!-- latin hint when hidden -->
            <p v-if="!showLatin && hasAnyLatin" class="mt-4 text-center text-[11px] tracking-wide text-stone-400">
              Transliterasi Latin disembunyikan — buka <span class="inline-flex items-center gap-1 font-medium text-stone-600"><Settings class="w-3 h-3" /> Pengaturan</span> untuk menampilkan kembali.
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

    <!-- Gear Settings Modal — migrated to BaseModal -->
    <BaseModal :open="showSettings" title="Pengaturan Tampilan" title-id="settings-title" @close="showSettings = false">
      <template #headerIcon>
        <span class="w-8 h-8 rounded-full bg-emerald-700 inline-flex items-center justify-center shadow-[0_2px_8px_rgba(21,128,61,0.25)]">
          <Settings class="w-4 h-4 text-white" />
        </span>
      </template>

      <div class="p-5 space-y-3">
        <!-- Row1: Tampilkan Latin Switch -->
        <div class="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-white border border-[#e8e6de] shadow-sm">
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 inline-flex items-center justify-center shrink-0">
              <component :is="showLatin ? Eye : EyeOff" class="w-4 h-4 text-emerald-700" />
            </span>
            <div class="min-w-0">
              <div class="text-[13px] font-semibold text-[#0f2318] leading-none">Tampilkan Latin</div>
              <div class="text-[11px] text-stone-500 mt-1 leading-none">Transliterasi di bawah Arab</div>
            </div>
          </div>
          <BaseButton
            :variant="showLatin ? 'primary' : 'ghost'"
            pill
            class="relative h-[28px] w-[48px] !p-0 shrink-0 cursor-pointer !justify-start !gap-0"
            :class="showLatin ? '!bg-emerald-700 !border-emerald-700' : '!bg-stone-200 !border-stone-200'"
            role="switch"
            :aria-checked="showLatin ? 'true' : 'false'"
            :aria-label="showLatin ? 'Sembunyikan Latin' : 'Tampilkan Latin'"
            @click="toggleLatin"
          >
            <span
              class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200"
              :class="showLatin ? 'translate-x-[22px]' : 'translate-x-[3px]'"
            ></span>
          </BaseButton>
        </div>

        <!-- Row2: Ukuran Huruf -->
        <div class="p-3.5 rounded-2xl bg-white border border-[#e8e6de] shadow-sm">
          <div class="flex items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 inline-flex items-center justify-center shrink-0">
                <Type class="w-4 h-4 text-amber-700" />
              </span>
              <div>
                <div class="text-[13px] font-semibold text-[#0f2318] leading-none">Ukuran Huruf</div>
                <div class="text-[11px] text-stone-500 mt-1">
                  <span class="font-semibold text-stone-700">{{ fontSize }}px</span> • Arab
                </div>
              </div>
            </div>
            <BaseButton
              variant="ghost"
              pill
              size="sm"
              class="text-[11px] !bg-stone-50 hover:!bg-white"
              aria-label="Reset ukuran huruf"
              @click="resetFontSize"
            >
              <RotateCcw class="w-3 h-3" /> Reset
            </BaseButton>
          </div>

          <div class="flex items-center gap-2">
            <BaseButton
              variant="ghost"
              pill
              class="w-8 h-8 !p-0 shrink-0"
              :disabled="fontSize <= 8"
              aria-label="Kecilkan huruf"
              @click="decrease"
            >
              <span class="text-[12px] font-bold leading-none">A-</span>
            </BaseButton>

            <input
              type="range"
              min="8"
              max="36"
              step="1"
              :value="fontSize"
              class="lyric-range flex-1 accent-emerald-700 h-1 cursor-pointer"
              aria-label="Ukuran huruf Arab"
              @input="setFontSize(Number(($event.target as HTMLInputElement).value))"
            />

            <BaseButton
              variant="ghost"
              pill
              class="w-8 h-8 !p-0 shrink-0"
              :disabled="fontSize >= 36"
              aria-label="Besarkan huruf"
              @click="increase"
            >
              <span class="text-[13px] font-bold leading-none">A+</span>
            </BaseButton>
          </div>

          <!-- live preview -->
          <div class="mt-3 rounded-xl bg-[#fdfcf8] border border-[#e8e6de]/70 px-3 py-2.5 flex items-center justify-between gap-3">
            <span class="text-[11px] tracking-wide font-medium text-stone-500 shrink-0">Pratinjau</span>
            <span dir="rtl" lang="ar" class="font-amiri text-[#0f2318] leading-none text-center flex-1" :style="{ fontSize: fontSize + 'px' }" style="font-family: 'Amiri', serif">اَللّٰهُ</span>
            <span class="text-[11px] italic text-stone-500 shrink-0" :style="{ fontSize: Math.round(fontSize * 0.58) + 'px' }">Allāh</span>
          </div>
        </div>

        <!-- Row3: Mode Switch -->
        <div class="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-white border border-[#e8e6de] shadow-sm">
          <div class="flex items-center gap-3 min-w-0">
            <span
              class="w-9 h-9 rounded-full border inline-flex items-center justify-center shrink-0 transition-colors"
              :class="isDark ? 'bg-[#1a2420] border-[#2a3a32]' : 'bg-amber-50 border-amber-100'"
            >
              <component :is="isDark ? Moon : Sun" class="w-4 h-4" :class="isDark ? 'text-amber-300' : 'text-amber-600'" />
            </span>
            <div class="min-w-0">
              <div class="text-[13px] font-semibold text-[#0f2318] leading-none">Mode</div>
              <div class="text-[11px] text-stone-500 mt-1 leading-none">
                {{ isDark ? 'Gelap' : 'Terang' }} • {{ isDark ? 'Nyaman di malam' : 'Kertas terang' }}
              </div>
            </div>
          </div>
          <BaseButton
            :variant="isDark ? 'primary' : 'ghost'"
            pill
            class="relative h-[28px] w-[48px] !p-0 shrink-0 cursor-pointer !justify-start !gap-0"
            :class="isDark ? '!bg-[#1a2420] !border-[#1a2420]' : '!bg-stone-200 !border-stone-200'"
            role="switch"
            :aria-checked="isDark ? 'true' : 'false'"
            aria-label="Toggle mode gelap"
            @click="toggleDark"
          >
            <span
              class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 flex items-center justify-center"
              :class="isDark ? 'translate-x-[22px]' : 'translate-x-[3px]'"
            >
              <component :is="isDark ? Moon : Sun" class="w-3 h-3" :class="isDark ? 'text-[#1a2420]' : 'text-amber-600'" />
            </span>
          </BaseButton>
        </div>
      </div>

      <template #footer>
        <p class="text-[11px] leading-relaxed text-stone-400 text-center">Pengaturan disimpan otomatis di perangkat ini.</p>
      </template>
    </BaseModal>

    <!-- Fase 6: Simpan ke folder lain — unified FolderPicker -->
    <FolderPicker
      :open="showSaveToFolderModal"
      :folders="allFolders"
      v-model:selectedId="saveTargetFolderId as any"
      v-model:navId="saveNavId"
      title="Simpan ke folder"
      :subtitle="`Pilih folder tujuan untuk “${effectiveAmalan?.judul ?? ''}”. Tap baris untuk pilih, tap > untuk masuk.`"
      confirm-label="Simpan"
      @close="closeSaveToFolderModal"
      @confirm="confirmSaveToFolder"
    />
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
  Settings,
  Sun,
  Moon,
  Type,
  X,
  RotateCcw,
  FolderPlus,
} from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { useLyricSettings } from '@/composables/useLyricSettings'
import FolderPicker from '@/components/FolderPicker.vue'
import { getFolderDepth } from '@/utils/folderTree'
import { useOfflineAmalan } from '@/composables/useOfflineAmalan'
import { useBodyLock } from '@/composables/useBodyLock'
import { useEsc } from '@/composables/useEsc'
import EmptyState from '@/components/ui/EmptyState.vue'
import PaperCard from '@/components/ui/PaperCard.vue'
import LyricRow from '@/components/LyricRow.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const toast = useToast()
const { showLatin, toggleLatin, fontSize, isDark, increase, decrease, setFontSize, resetFontSize, toggleDark } = useLyricSettings()

const showSettings = ref(false)
const settingsCardRef = ref<HTMLElement | null>(null)

const slug = computed(() => route.params.slug as string)

const {
  data: amalan,
  isLoading: loadingAmalan,
  isError: amalanError,
} = useAmalanBySlugQuery(slug)

// offline composable — encapsulates IndexedDB logic (ora-2)
const {
  isSaved,
  localData,
  hasUpdate: hasUpdateAvailable,
  allFolders,
  isSaving,
  isSavingToFolder,
  loadFolders,
  checkStatus: checkOfflineStatus,
  toggleRoot,
  saveToFolder,
  updateAllCopies,
} = useOfflineAmalan(amalan as any, slug)

// effective amalan: online or offline fallback — also checks content JSON for old v1 records (HP)
const hasOfflineFallback = computed(() => {
  if (!localData.value) return false
  if (localData.value.lyrics?.length) return true
  if (localData.value.content) {
    try {
      const parsed = JSON.parse(localData.value.content)
      return Array.isArray(parsed) && parsed.length > 0 && !!parsed[0]?.arab
    } catch {
      return false
    }
  }
  return false
})
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

const effectiveLyrics = computed(() => {
  const online = (amalan.value as any)?.lyrics
  if (online && Array.isArray(online) && online.length > 0) return online
  const offline = localData.value?.lyrics
  if (offline && Array.isArray(offline) && offline.length > 0) return offline
  if (localData.value?.content) {
    try {
      const parsed = JSON.parse(localData.value.content)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.arab) return parsed
    } catch {}
  }
  return []
})

const hasLyrics = computed(() => effectiveLyrics.value.length > 0)
const hasAnyLatin = computed(() => effectiveLyrics.value.some((r: any) => !!r.latin))

// Phase 6 UI state — folder picker modal
const showSaveToFolderModal = ref(false)
const saveTargetFolderId = ref<number | null>(0)
const saveNavId = ref<number | null>(null)

const orderedFoldersForSave = computed(() => {
  return [...allFolders.value].sort((a, b) => {
    const da = a.id != null ? getFolderDepth(a.id, allFolders.value) : 0
    const dbd = b.id != null ? getFolderDepth(b.id, allFolders.value) : 0
    if (da !== dbd) return da - dbd
    return a.name.localeCompare(b.name)
  })
})

async function openSaveToFolderModal() {
  await loadFolders()
  if (allFolders.value.length > 0) {
    const first = orderedFoldersForSave.value[0]
    if (first?.id != null) saveTargetFolderId.value = first.id
    else saveTargetFolderId.value = allFolders.value[0].id ?? 0
  } else {
    saveTargetFolderId.value = 0
  }
  saveNavId.value = null
  showSaveToFolderModal.value = true
}

function closeSaveToFolderModal() {
  showSaveToFolderModal.value = false
}

async function confirmSaveToFolder() {
  const ok = await saveToFolder(saveTargetFolderId.value as number, {
    amalan: effectiveAmalan.value as any,
    lyrics: effectiveLyrics.value as any,
  })
  if (ok) closeSaveToFolderModal()
}

async function toggleOffline() {
  await toggleRoot({
    amalan: effectiveAmalan.value as any,
    lyrics: effectiveLyrics.value as any,
  })
}

async function updateOffline() {
  await updateAllCopies(effectiveLyrics.value as any, amalan.value as any)
}

const isAnyModalOpen = computed(() => showSettings.value || showSaveToFolderModal.value)
useBodyLock(isAnyModalOpen)
// Esc is handled inside BaseModal; no additional useEsc needed for these modals

onMounted(async () => {
  await checkOfflineStatus()
  await loadFolders()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(amalan, async () => {
  await checkOfflineStatus()
})
watch(slug, async () => {
  await checkOfflineStatus()
})

const progress = ref(0)
function onScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
  progress.value = Math.min(100, Math.max(0, pct))
}

// lyric title header — single split via titleParts (dedup arabTitle/latinTitle + cheap computed churn)
const arabicRe = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
const latinReHeader = /[A-Za-z]/
const titleSplitRe = /\s*[—–]\s*|\s+-\s+/
const rawTitle = computed(() => (effectiveAmalan.value?.judul || '').trim())
const titleParts = computed(() => {
  const raw = rawTitle.value
  if (!raw) return { arab: '', latin: '' }
  const parts = raw.split(titleSplitRe)
  if (parts.length < 2) return { arab: raw, latin: '' }
  const a = parts[0].trim()
  const b = parts.slice(1).join(' — ').trim()
  if (!a || !b) return { arab: raw, latin: '' }
  const aIsArab = arabicRe.test(a)
  const bIsArab = arabicRe.test(b)
  const aIsLatin = latinReHeader.test(a) && !aIsArab
  const bIsLatin = latinReHeader.test(b) && !bIsArab

  let arab = ''
  let latin = ''
  // arab selection (preserved)
  if (aIsArab && !bIsArab) arab = a
  else if (!aIsArab && bIsArab) arab = b
  else if (aIsArab && bIsArab) arab = raw
  else if (!aIsArab && !bIsArab) arab = raw
  else arab = a
  // latin selection (preserved)
  if (aIsArab && bIsLatin) latin = b
  else if (aIsLatin && bIsArab) latin = a
  else if (aIsArab && bIsArab) latin = ''
  else if (!aIsArab && !bIsArab) latin = ''
  else if (bIsLatin) latin = b
  else if (aIsLatin) latin = a
  else latin = ''

  return { arab, latin }
})
const arabTitle = computed(() => titleParts.value.arab)
const latinTitle = computed(() => titleParts.value.latin)
const hasTitleLatin = computed(() => !!latinTitle.value)

const readingMinutes = computed(() => {
  const lyrics = effectiveLyrics.value
  if (!lyrics.length) return 0
  const text = lyrics.map((r: any) => `${r.arab} ${r.latin || ''}`).join(' ')
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
  () => loadingAmalan.value || (!effectiveAmalan.value && !amalanError.value && !hasOfflineFallback.value),
)
</script>

<style scoped>
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

/* Arab: uses CSS var --arab (18-36px), rtl, center */
.lyric-arab {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Amiri', serif;
  font-size: var(--arab, 24px);
  line-height: 1.95;
  color: #0f2318;
  font-weight: 400;
  direction: rtl;
  transition:
    font-size 180ms ease,
    color 260ms ease;
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
  transition: color 260ms ease;
}

/* Latin: uses CSS var --latin (58% of --arab), DM Sans italic muted, center */
.lyric-latin {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  font-size: var(--latin, 14px);
  line-height: 1.65;
  font-style: italic;
  font-weight: 400;
  color: #6e7d71;
  letter-spacing: 0.006em;
  margin-top: 2px;
  transition:
    font-size 180ms ease,
    color 260ms ease;
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
  transition: color 260ms ease;
}
.title-latin {
  text-wrap: balance;
  transition:
    opacity 200ms ease,
    transform 200ms ease,
    color 260ms ease;
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

/* ── Settings modal transition ── */
.settings-fade-enter-active,
.settings-fade-leave-active {
  transition: opacity 220ms ease;
}
.settings-fade-enter-active .relative,
.settings-fade-leave-active .relative {
  transition:
    opacity 260ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}
.settings-fade-enter-from,
.settings-fade-leave-to {
  opacity: 0;
}
.settings-fade-enter-from .relative {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.settings-fade-leave-to .relative {
  opacity: 0;
  transform: translateY(8px) scale(0.99);
}

/* ── Range slider polish ── */
.lyric-range {
  -webkit-appearance: none;
  appearance: none;
  background: #e7e5e0;
  height: 4px;
  border-radius: 9999px;
}
.lyric-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #15803d;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  transition:
    transform 120ms ease,
    box-shadow 120ms ease;
}
.lyric-range::-webkit-slider-thumb:hover {
  transform: scale(1.08);
  box-shadow: 0 2px 8px rgba(21, 128, 61, 0.25);
}
.lyric-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #15803d;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  cursor: pointer;
}
.lyric-range::-moz-range-track {
  background: #e7e5e0;
  height: 4px;
  border-radius: 9999px;
}
</style>
