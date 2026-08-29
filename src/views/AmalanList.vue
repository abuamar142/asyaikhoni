<template>
  <div class="min-h-screen bg-[#fdfcf8] selection:bg-emerald-100 selection:text-emerald-900">
    <AppHeader />
    <!-- offset for fixed header h-16 (64px) -->
    <div class="pt-16">
      <!-- subtle paper texture -->
      <div aria-hidden="true" class="pointer-events-none fixed inset-0">
        <div class="absolute inset-0 opacity-[0.025]" style="background-image: radial-gradient(circle at 1px 1px, #0f2e1c 1px, transparent 0); background-size: 22px 22px"></div>
      </div>

      <!-- Masthead -->
      <header class="relative border-b border-[#e8e6de] bg-white/85 backdrop-blur-[8px]">
      <div aria-hidden="true" class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -right-16 -top-16 w-[420px] h-[420px] rounded-full border border-emerald-100/70 hidden lg:block"></div>
        <div class="absolute -right-16 -top-16 w-[320px] h-[320px] rounded-full border border-emerald-100/50 hidden lg:block"></div>
        <div class="absolute -right-10 top-10 hidden lg:flex w-20 h-20 rounded-full bg-white border border-[#ece9e0] shadow-[0_8px_24px_rgba(20,40,20,0.06)] items-center justify-center">
          <span class="font-serif text-emerald-800 text-xl leading-none">۞</span>
        </div>
        <!-- thin accent line top -->
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent"></div>
      </div>

      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="pt-10 pb-8 md:pt-14 md:pb-10">
          <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div class="max-w-[44rem]">
              <!-- eyebrow -->
              <div class="inline-flex flex-wrap items-center gap-3 mb-4">
                <span class="h-px w-8 bg-emerald-700 hidden sm:block"></span>
                <span class="text-[11px] tracking-[0.18em] font-semibold text-emerald-800 uppercase"
                  >Khazanah · PPTQ Asy-Syaikhôni</span
                >
                <span class="hidden sm:inline-flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-amber-400"></span>
                  <span class="text-[11px] tracking-[0.14em] font-medium text-stone-500 uppercase">Nganjuk · Est</span>
                </span>
              </div>

              <h1
                class="font-serif text-[34px] sm:text-[42px] lg:text-[48px] font-[600] tracking-[-0.03em] leading-[0.95] text-[#0f2418]"
                style="font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif"
              >
                Kumpulan
                <span class="font-[300] italic text-emerald-800">Amalan</span>
              </h1>

              <p
                class="mt-3.5 text-[15px] sm:text-[16px] leading-[1.7] text-[#5b6b5f] max-w-[38rem] text-pretty"
              >
                Khazanah doa, wirid, dan tuntunan ibadah yang diamalkan di lingkungan Pondok
                Pesantren — tersusun rapi untuk dibaca, dihafal, dan diamalkan sehari-hari.
              </p>

              <div class="mt-6 flex flex-wrap items-center gap-3">
                <div
                  class="inline-flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-emerald-50 border border-emerald-100"
                >
                  <span
                    class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-700 text-white"
                  >
                    <Library class="w-3.5 h-3.5" />
                  </span>
                  <span class="text-[13px] font-medium text-emerald-900"
                    ><span class="font-semibold">{{ itemsList.length }}</span>
                    <span class="text-emerald-700/80"> amalan</span>
                  </span>
                  <span class="w-px h-4 bg-emerald-200"></span>
                  <span class="text-[12px] text-emerald-700">{{ categoryOptions.length }} kategori</span>
                </div>

                <router-link
                  :to="{ name: 'amalan-offline' }"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e7e5e0] text-[13px] font-semibold text-[#1a2e1f] hover:border-emerald-200 hover:bg-emerald-50/60 hover:text-emerald-800 shadow-sm transition-all"
                >
                  <Bookmark class="w-4 h-4 text-emerald-700" />
                  Koleksi Saya
                  <ArrowUpRight class="w-3.5 h-3.5 text-stone-400" />
                </router-link>
              </div>
            </div>

            <!-- right stat - desktop only -->
            <div class="hidden lg:flex flex-col items-end text-right shrink-0">
              <div
                class="text-[11px] tracking-[0.16em] uppercase font-semibold text-stone-400 mb-2"
              >
                Katalog terdokumentasi
              </div>
              <div
                class="font-serif text-5xl font-[300] tracking-[-0.04em] leading-none text-[#12291a]"
                style="font-family: 'Fraunces', Georgia, serif"
              >
                {{ String(itemsList.length || 0).padStart(2, '0') }}
              </div>
              <div class="text-sm text-stone-500 mt-1.5">amalan tersimpan</div>
              <div class="mt-5 h-px w-24 bg-gradient-to-r from-transparent to-emerald-200"></div>
              <div class="mt-3 text-[11px] leading-[1.5] text-stone-500 max-w-[18rem] text-pretty">
                Diperbarui berkala oleh pengasuh. Simpan offline untuk dibaca tanpa koneksi.
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Sticky toolbar — mentok ke header (fixed h-16) -->
    <div class="sticky top-16 z-20 mt-0 -mb-px">
      <div class="bg-[#fdfcf8] border-y border-[#e8e6de] shadow-[0_1px_0_rgba(0,0,0,0.02)] supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:bg-[#fdfcf8]/95">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row md:items-center gap-4 py-4 md:py-5">
            <div class="flex-1 min-w-0">
              <SearchInput v-model="q" placeholder="Cari judul, ringkasan, atau kata kunci amalan…" />
            </div>

            <!-- kategori dropdown -->
            <div class="relative w-full md:w-[340px] shrink-0" ref="dropdownRef">
              <button
                type="button"
                class="w-full h-11 flex items-center justify-between gap-3 px-3.5 rounded-xl border bg-white text-left shadow-[0_1px_2px_rgba(16,30,20,0.06)] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all"
                :class="[
                  showCategoryDropdown ? 'border-emerald-300 ring-4 ring-emerald-500/10' : 'border-[#d7ddd7] hover:border-[#c2cdc2]',
                ]"
                @click="toggleDropdown"
                :aria-expanded="showCategoryDropdown"
                aria-haspopup="listbox"
              >
                <span class="inline-flex items-center gap-2.5 min-w-0">
                  <span
                    class="inline-flex w-8 h-8 rounded-lg items-center justify-center shrink-0"
                    :class="selectedKategoriIds.length ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-500'"
                  >
                    <Filter class="w-4 h-4" />
                  </span>
                  <span class="truncate text-[13.5px] font-medium" :class="selectedKategoriIds.length ? 'text-[#12291a]' : 'text-stone-600'">
                    {{ activeCategoryLabel || 'Semua kategori' }}
                  </span>
                </span>
                <span class="inline-flex items-center gap-2 shrink-0">
                  <span
                    v-if="selectedKategoriIds.length"
                    class="hidden sm:inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-300 text-[#14532d] text-[11px] font-bold"
                    >{{ selectedKategoriIds.length }}</span
                  >
                  <ChevronDown
                    class="w-4 h-4 text-stone-400 transition-transform duration-200"
                    :class="showCategoryDropdown ? 'rotate-180 text-emerald-700' : ''"
                  />
                </span>
              </button>

              <transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-1 scale-[0.98]"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition duration-120 ease-in"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-1 scale-[0.98]"
              >
                <div
                  v-if="showCategoryDropdown"
                  class="absolute z-20 mt-3 w-full rounded-2xl border border-[#e7e5e0] bg-white shadow-[0_16px_40px_rgba(15,35,20,0.12)] overflow-hidden"
                >
                  <div class="px-4 py-3 border-b border-stone-100 bg-stone-50/60 flex items-center justify-between">
                    <span class="text-[11px] tracking-[0.14em] font-semibold uppercase text-stone-600">Pilih kategori</span>
                    <span class="text-[11px] text-stone-500">{{ tempSelectedKategoriIds.length }} terpilih</span>
                  </div>

                  <div class="p-2">
                    <label
                      class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors"
                      :class="!tempSelectedKategoriIds.length ? 'bg-emerald-50/70' : ''"
                    >
                      <input
                        type="checkbox"
                        class="w-4 h-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600/20"
                        :checked="tempSelectedKategoriIds.length === 0"
                        @change="resetKategoriTemp"
                      />
                      <span class="text-[13.5px] font-medium" :class="!tempSelectedKategoriIds.length ? 'text-emerald-900' : 'text-stone-700'"
                        >Semua kategori</span
                      >
                      <span v-if="!tempSelectedKategoriIds.length" class="ml-auto w-2 h-2 rounded-full bg-emerald-600"></span>
                    </label>
                  </div>

                  <div class="max-h-64 overflow-auto px-2 pb-2 space-y-0.5 custom-scroll">
                    <label
                      v-for="cat in categoryOptions"
                      :key="cat.id"
                      class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors"
                      :class="tempSelectedKategoriIds.includes(cat.id) ? 'bg-emerald-50/60' : ''"
                    >
                      <input
                        type="checkbox"
                        class="w-4 h-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600/20"
                        :value="cat.id"
                        :checked="tempSelectedKategoriIds.includes(cat.id)"
                        @change="toggleKategori(cat.id, ($event.target as HTMLInputElement).checked)"
                      />
                      <span
                        class="text-[13.5px]"
                        :class="tempSelectedKategoriIds.includes(cat.id) ? 'font-medium text-emerald-900' : 'text-stone-700'"
                        >{{ cat.nama }}</span
                      >
                    </label>
                    <p v-if="!categoryOptions.length" class="text-center text-[13px] text-stone-500 py-6">
                      Belum ada kategori.
                    </p>
                  </div>

                  <div class="p-3 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      class="text-[13px] font-medium text-stone-600 hover:text-stone-800 px-3 py-1.5 rounded-full hover:bg-white border border-transparent hover:border-stone-200 transition-colors"
                      @click="closeDropdown"
                    >
                      Tutup
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-700 text-white text-[13px] font-semibold hover:bg-emerald-800 shadow-sm transition-colors"
                      @click="applyKategori"
                    >
                      <Check class="w-4 h-4" /> Terapkan
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- active filters meta row -->
          <div class="flex flex-wrap items-center gap-2 pb-4 -mt-1">
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-for="id in selectedKategoriIds"
                :key="id"
                class="inline-flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full bg-emerald-700 text-white text-[12.5px] font-medium shadow-sm"
              >
                {{ categoryName(id) }}
                <button
                  type="button"
                  class="w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 inline-flex items-center justify-center transition-colors"
                  :aria-label="`Hapus filter ${categoryName(id)}`"
                  @click="removeKategori(id)"
                >
                  <X class="w-3 h-3" />
                </button>
              </span>
              <span
                v-if="!selectedKategoriIds.length"
                class="inline-flex items-center gap-1.5 text-[12.5px] text-stone-600"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Semua kategori
              </span>
            </div>

            <span class="hidden sm:block mx-1 h-4 w-px bg-stone-200"></span>
            <span class="text-[12.5px] text-stone-500">
              <template v-if="!loading && !error">
                Menampilkan <span class="font-semibold text-stone-700">{{ itemsList.length }}</span> amalan
                <span v-if="q" class="text-stone-500">untuk “{{ q }}”</span>
              </template>
              <template v-else> Memuat katalog… </template>
            </span>

            <button
              v-if="selectedKategoriIds.length || q"
              type="button"
              class="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-800 hover:text-emerald-900 underline underline-offset-4 decoration-emerald-200 hover:decoration-emerald-700 transition-colors"
              @click="resetFilters"
            >
              <RotateCcw class="w-3.5 h-3.5" /> Bersihkan filter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <!-- Loading -->
      <div v-if="loading" class="grid gap-5 md:gap-6 md:grid-cols-2">
        <div
          v-for="i in 6"
          :key="i"
          class="rounded-[18px] border border-[#e8e6de] bg-white p-6 md:p-7 shadow-sm animate-pulse"
        >
          <div class="flex justify-between mb-4">
            <div class="h-6 w-24 bg-stone-100 rounded-full"></div>
            <div class="h-8 w-8 bg-stone-100 rounded-full"></div>
          </div>
          <div class="h-6 bg-stone-100 rounded w-3/4 mb-3"></div>
          <div class="space-y-2">
            <div class="h-4 bg-stone-50 rounded w-full"></div>
            <div class="h-4 bg-stone-50 rounded w-5/6"></div>
            <div class="h-4 bg-stone-50 rounded w-4/6"></div>
          </div>
          <div class="mt-6 h-px bg-stone-100"></div>
          <div class="mt-4 h-4 w-32 bg-stone-100 rounded-full"></div>
        </div>
      </div>

      <div
        v-else-if="error"
        class="max-w-2xl mx-auto rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center"
      >
        <div class="w-12 h-12 rounded-full bg-white border border-red-200 inline-flex items-center justify-center mb-3">
          <AlertTriangle class="w-6 h-6 text-red-600" />
        </div>
        <h3 class="font-serif text-lg font-semibold text-red-900">Gagal memuat amalan</h3>
        <p class="text-[13.5px] leading-[1.6] text-red-700/80 mt-1">{{ errorMessage || 'Terjadi kesalahan jaringan.' }}</p>
        <button
          type="button"
          class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-red-200 text-[13px] font-semibold text-red-700 hover:bg-red-50 transition-colors"
          @click="() => $router.go(0)"
        >
          <RotateCcw class="w-4 h-4" /> Coba lagi
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="isEmpty" class="max-w-[560px] mx-auto text-center py-10 md:py-16">
        <div
          class="mx-auto w-[88px] h-[88px] rounded-[22px] bg-white border border-[#e8e6de] shadow-[0_8px_24px_rgba(20,40,20,0.06)] inline-flex items-center justify-center relative"
        >
          <div class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-300 border-2 border-white flex items-center justify-center">
            <Search class="w-3 h-3 text-[#14532d]" />
          </div>
          <BookHeart class="w-9 h-9 text-emerald-700" :stroke-width="1.6" />
        </div>
        <h3
          class="mt-6 font-serif text-[22px] font-semibold tracking-[-0.015em] text-[#12291a]"
          style="font-family: 'Fraunces', Georgia, serif"
        >
          Tidak ada amalan ditemukan
        </h3>
        <p class="mt-2 text-[14px] leading-[1.7] text-stone-500 max-w-[42ch] mx-auto text-pretty">
          Coba ubah kata kunci atau kategori. Kosongkan filter untuk melihat seluruh katalog khazanah amalan.
        </p>
        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 text-white text-[13px] font-semibold hover:bg-emerald-800 shadow-sm transition-colors"
            @click="resetFilters"
          >
            <RotateCcw class="w-4 h-4" /> Reset filter
          </button>
          <span class="text-[13px] text-stone-400">atau</span>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#e7e5e0] text-[13px] font-medium text-stone-700 hover:border-emerald-200 hover:text-emerald-800 transition-colors"
            @click="q = ''"
          >
            Hapus pencarian
          </button>
        </div>
      </div>

      <!-- Grid -->
      <div v-else class="grid gap-5 md:gap-6 md:grid-cols-2 auto-rows-fr">
        <article
          v-for="(item, idx) in itemsList"
          :key="item.id"
          class="group relative flex flex-col rounded-[18px] border bg-white p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(16,40,22,0.16)] will-change-transform"
          :class="[
            idx % 5 === 0
              ? 'border-emerald-100 shadow-[0_1px_2px_rgba(16,40,22,0.06)]'
              : 'border-[#e8e6de] shadow-sm',
          ]"
          :style="{ animationDelay: `${idx * 45}ms` }"
          style="animation: cardIn 0.5s ease both"
        >
          <!-- hover accent -->
          <div
            class="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-emerald-200/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>

          <div class="flex items-start justify-between gap-3 mb-3.5">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="cat in item.categories"
                :key="cat.id"
                class="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold tracking-[0.08em] uppercase text-emerald-800"
                >{{ cat.nama }}</span
              >
              <span
                v-if="!item.categories?.length"
                class="inline-flex items-center px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-[11px] font-medium tracking-wide text-stone-500 uppercase"
                >Tanpa kategori</span
              >
            </div>
            <span
              v-if="item.urutan != null"
              class="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full border bg-stone-50 text-[11px] font-bold tracking-wide transition-colors"
              :class="idx % 5 === 0 ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-stone-200 text-stone-600 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-800'"
              >{{ String(item.urutan).padStart(2, '0') }}</span
            >
          </div>

          <h2
            class="font-serif text-[20px] md:text-[21px] leading-[1.32] font-[600] tracking-[-0.015em] text-[#13291b] group-hover:text-emerald-900 transition-colors line-clamp-2 text-pretty"
            style="font-family: 'Fraunces', Georgia, serif"
          >
            {{ item.judul }}
          </h2>

          <p
            v-if="item.ringkasan"
            class="mt-2.5 text-[13.5px] leading-[1.72] text-[#5a6d5f] line-clamp-3 text-pretty"
          >
            {{ item.ringkasan }}
          </p>
          <p v-else class="mt-2.5 text-[13px] leading-[1.6] text-stone-400 italic">Ringkasan belum tersedia.</p>

          <div class="mt-auto pt-5">
            <div class="h-px bg-[#f0ede8] group-hover:bg-emerald-50 transition-colors"></div>
            <router-link
              :to="{ name: 'amalan-detail', params: { slug: item.slug } }"
              class="mt-4 flex items-center justify-between group/link focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 rounded-lg -mx-1 px-1 py-1"
            >
              <span class="inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-800">
                Baca amalan
                <span
                  class="inline-flex w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 items-center justify-center text-emerald-700 group-hover/link:bg-emerald-700 group-hover/link:text-white group-hover/link:border-emerald-700 transition-all duration-200"
                >
                  <ArrowRight class="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                </span>
              </span>
              <span class="text-[11px] tracking-[0.08em] uppercase font-medium text-stone-400 group-hover/link:text-stone-600 transition-colors"
                >Lihat detail</span
              >
            </router-link>
          </div>
        </article>
      </div>

      <!-- bottom subtle meta -->
      <div v-if="!loading && !isEmpty && !error" class="mt-10 flex items-center justify-center gap-3 text-[11px] tracking-[0.12em] uppercase text-stone-400">
        <span class="h-px w-8 bg-stone-200 hidden sm:block"></span>
        <span>Akhir katalog</span>
        <span class="w-1 h-1 rounded-full bg-stone-300"></span>
        <span class="normal-case tracking-normal font-medium text-stone-500">PPTQ Asy-Syaikhôni · Nganjuk</span>
        <span class="h-px w-8 bg-stone-200 hidden sm:block"></span>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useAmalanListQuery } from '@/composables/useAmalanQueries'
import { useCategoryListQuery } from '@/composables/useCategoryQueries'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import SearchInput from '@/components/ui/SearchInput.vue'
import type { Category } from '@/services/categoryService'
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Library,
  Filter,
  ChevronDown,
  Check,
  X,
  RotateCcw,
  BookHeart,
  Search,
  AlertTriangle,
} from 'lucide-vue-next'

const q = ref('')
const qDebounced = useDebouncedRef(q, 400)
const selectedKategoriIds = ref<string[]>([])
const tempSelectedKategoriIds = ref<string[]>([])
const showCategoryDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const { data: categories } = useCategoryListQuery()
const categoryOptions = computed<Category[]>(() => categories?.value || [])
const activeCategoryLabel = computed(() => {
  if (!selectedKategoriIds.value.length) return ''
  const names = categoryOptions.value
    .filter((c) => selectedKategoriIds.value.includes(c.id))
    .map((c) => c.nama)
  return names.join(', ')
})

function categoryName(id: string) {
  return categoryOptions.value.find((c) => c.id === id)?.nama || id
}

const queryParams = computed(() => ({
  q: qDebounced.value || undefined,
  kategoriIds: selectedKategoriIds.value.length ? selectedKategoriIds.value : undefined,
}))

const { data, isLoading: loading, error } = useAmalanListQuery(queryParams)
const itemsList = computed(() => data.value || [])
const isEmpty = computed(() => !loading.value && itemsList.value.length === 0)
const errorMessage = computed(() => (error?.value instanceof Error ? error.value.message : ''))

function resetFilters() {
  q.value = ''
  selectedKategoriIds.value = []
  tempSelectedKategoriIds.value = []
}

function resetKategori() {
  selectedKategoriIds.value = []
  tempSelectedKategoriIds.value = []
}

function resetKategoriTemp() {
  tempSelectedKategoriIds.value = []
}

function toggleKategori(id: string, checked: boolean) {
  const set = new Set(tempSelectedKategoriIds.value)
  if (checked) set.add(id)
  else set.delete(id)
  tempSelectedKategoriIds.value = Array.from(set)
}

function removeKategori(id: string) {
  selectedKategoriIds.value = selectedKategoriIds.value.filter((v) => v !== id)
  tempSelectedKategoriIds.value = [...selectedKategoriIds.value]
}

function toggleDropdown() {
  showCategoryDropdown.value = !showCategoryDropdown.value
  tempSelectedKategoriIds.value = [...selectedKategoriIds.value]
}

function closeDropdown() {
  showCategoryDropdown.value = false
}

function applyKategori() {
  selectedKategoriIds.value = [...tempSelectedKategoriIds.value]
  showCategoryDropdown.value = false
}

function onClickOutside(e: MouseEvent) {
  if (!showCategoryDropdown.value) return
  const target = e.target as Node
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    showCategoryDropdown.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showCategoryDropdown.value) showCategoryDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #d6d3c4;
  border-radius: 999px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  article[style] {
    animation: none !important;
  }
  .group {
    transition: none !important;
  }
}
</style>
