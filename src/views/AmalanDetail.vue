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
              <!-- Gear settings button (replaces Latin pill) — visible on all breakpoints -->
              <button
                type="button"
                class="inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                :class="
                  showSettings
                    ? 'bg-emerald-700 border-emerald-700 text-white shadow-[0_6px_16px_rgba(21,128,61,0.22)]'
                    : 'bg-white border-[#e7e5e0] text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                "
                aria-label="Pengaturan tampilan"
                title="Pengaturan tampilan"
                @click="showSettings = true"
              >
                <Settings class="w-[18px] h-[18px] transition-transform duration-300" :class="[showSettings ? 'text-white rotate-45' : 'text-stone-500', showSettings ? '' : 'hover:rotate-12']" />
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
                :disabled="isSaving"
                :aria-busy="isSaving ? 'true' : 'false'"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-[13px] font-semibold transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/15 touch-manipulation min-h-[44px] relative z-10 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] select-none"
                :class="
                  isSaved
                    ? 'bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800 shadow-[0_6px_16px_rgba(21,128,61,0.22)]'
                    : 'bg-white border-[#e7e5e0] text-stone-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800'
                "
                @click="toggleOffline"
              >
                <span
                  v-if="isSaving"
                  class="w-[18px] h-[18px] rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"
                  aria-hidden="true"
                ></span>
                <component
                  v-else
                  :is="isSaved ? CheckCircle2 : Download"
                  class="w-[18px] h-[18px] shrink-0"
                  :class="isSaved ? 'text-white' : 'text-emerald-700'"
                />
                {{ isSaving ? 'Menyimpan…' : isSaved ? 'Tersimpan offline' : 'Simpan offline' }}
              </button>

              <button
                v-if="isSaved"
                type="button"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#e7e5e0] text-[13px] font-semibold text-stone-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 transition-colors shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/15 touch-manipulation min-h-[44px] active:scale-[0.98]"
                @click="openSaveToFolderModal"
              >
                <FolderPlus class="w-4 h-4 text-emerald-700" />
                Simpan ke folder lain
              </button>

              <button
                v-if="isSaved && hasUpdateAvailable"
                type="button"
                :disabled="isSaving"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-300 border border-amber-300 text-[#14532d] text-[13px] font-semibold hover:bg-amber-200 shadow-sm transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/30 touch-manipulation min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                @click="updateOffline"
              >
                <span
                  v-if="isSaving"
                  class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                  aria-hidden="true"
                ></span>
                <RefreshCw v-else class="w-4 h-4" /> {{ isSaving ? 'Memperbarui…' : 'Update tersedia' }}
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
              <div
                class="amalan-paper"
                :class="{ 'dark-paper': isDark }"
                :style="{ '--arab': fontSize + 'px', '--latin': Math.round(fontSize * 0.58) + 'px' } as any"
              >
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

    <!-- Gear Settings Modal -->
    <Teleport to="body">
      <Transition name="settings-fade">
        <div
          v-if="showSettings"
          class="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          @keydown.esc="showSettings = false"
        >
          <!-- backdrop blur -->
          <div
            class="absolute inset-0 bg-[#0f1a16]/45 backdrop-blur-[6px]"
            @click="showSettings = false"
            aria-hidden="true"
          ></div>

          <!-- card -->
          <div
            ref="settingsCardRef"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            class="relative w-full max-w-[360px] rounded-[20px] bg-[#fdfcf8] border border-[#e8e6de] shadow-[0_20px_60px_rgba(15,35,24,0.18),0_1px_0_rgba(255,255,255,0.9)_inset] overflow-hidden flex flex-col max-h-[90vh]"
            @click.stop
          >
            <!-- header -->
            <div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#e8e6de]/70 shrink-0">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-emerald-700 inline-flex items-center justify-center shadow-[0_2px_8px_rgba(21,128,61,0.25)]">
                  <Settings class="w-4 h-4 text-white" />
                </span>
                <h2 id="settings-title" class="text-[14px] font-semibold tracking-[-0.01em] text-[#0f2318]">Pengaturan Tampilan</h2>
              </div>
              <button
                type="button"
                class="w-8 h-8 rounded-full bg-white border border-[#e7e5e0] inline-flex items-center justify-center text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 shrink-0"
                aria-label="Tutup pengaturan"
                @click="showSettings = false"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- rows -->
            <div class="p-5 space-y-3 overflow-y-auto overscroll-contain">
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
                <button
                  type="button"
                  role="switch"
                  :aria-checked="showLatin ? 'true' : 'false'"
                  :aria-label="showLatin ? 'Sembunyikan Latin' : 'Tampilkan Latin'"
                  class="relative inline-flex h-[28px] w-[48px] shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                  :class="showLatin ? 'bg-emerald-700 border-emerald-700' : 'bg-stone-200 border-stone-200'"
                  @click="toggleLatin"
                >
                  <span
                    class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200"
                    :class="showLatin ? 'translate-x-[22px]' : 'translate-x-[3px]'"
                  ></span>
                </button>
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
                  <button
                    type="button"
                    class="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-stone-600 hover:bg-white hover:border-stone-300 hover:text-stone-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 inline-flex items-center gap-1"
                    @click="resetFontSize"
                    aria-label="Reset ukuran huruf"
                  >
                    <RotateCcw class="w-3 h-3" /> Reset
                  </button>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="w-8 h-8 rounded-full bg-white border border-[#e7e5e0] inline-flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 shrink-0"
                    :disabled="fontSize <= 8"
                    aria-label="Kecilkan huruf"
                    @click="decrease"
                  >
                    <span class="text-[12px] font-bold leading-none">A-</span>
                  </button>

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

                  <button
                    type="button"
                    class="w-8 h-8 rounded-full bg-white border border-[#e7e5e0] inline-flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 shrink-0"
                    :disabled="fontSize >= 36"
                    aria-label="Besarkan huruf"
                    @click="increase"
                  >
                    <span class="text-[13px] font-bold leading-none">A+</span>
                  </button>
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
                <button
                  type="button"
                  role="switch"
                  :aria-checked="isDark ? 'true' : 'false'"
                  aria-label="Toggle mode gelap"
                  class="relative inline-flex h-[28px] w-[48px] shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                  :class="isDark ? 'bg-[#1a2420] border-[#1a2420]' : 'bg-stone-200 border-stone-200'"
                  @click="toggleDark"
                >
                  <span
                    class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 flex items-center justify-center"
                    :class="isDark ? 'translate-x-[22px]' : 'translate-x-[3px]'"
                  >
                    <component :is="isDark ? Moon : Sun" class="w-3 h-3" :class="isDark ? 'text-[#1a2420]' : 'text-amber-600'" />
                  </span>
                </button>
              </div>
            </div>

            <div class="px-5 pb-4 pt-2 shrink-0">
              <p class="text-[11px] leading-relaxed text-stone-400 text-center">Pengaturan disimpan otomatis di perangkat ini.</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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
import { db, type LocalSavedAmalan, type LocalFolder, ensureDbReady, isIndexedDBAvailable } from '@/utils/localDb'
import { useToast } from '@/composables/useToast'
import { useLyricSettings } from '@/composables/useLyricSettings'
import FolderPicker from '@/components/FolderPicker.vue'
import { toPlainLyrics, toSavedAmalanPayload } from '@/utils/lyric'

const route = useRoute()
const toast = useToast()
const { showLatin, toggleLatin, fontSize, isDark, increase, decrease, setFontSize, resetFontSize, toggleDark } = useLyricSettings()

const showSettings = ref(false)
const settingsCardRef = ref<HTMLElement | null>(null)

const slug = computed(() => route.params.slug as string)

const {
  data: amalan,
  isLoading: loadingAmalan,
  isFetching: fetchingAmalan,
  isError: amalanError,
} = useAmalanBySlugQuery(slug)

// effective amalan: online or offline fallback — also checks content JSON for old v1 records (HP)
const hasOfflineFallback = computed(() => {
  if (!localData.value) return false
  if (localData.value.lyrics?.length) return true
  // fallback for v1 DB records that only have content (JSON string)
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
const isSaving = ref(false)

// Fase 6: allow same amalan saved to different folders — secondary action state
const allFolders = ref<LocalFolder[]>([])
const showSaveToFolderModal = ref(false)
const saveTargetFolderId = ref<number | null>(0)
const saveNavId = ref<number | null>(null)
const isSavingToFolder = ref(false)

const availableFoldersForSave = computed(() => allFolders.value)

async function checkOfflineStatus() {
  try {
    if (!isIndexedDBAvailable()) {
      console.warn('[offline] IndexedDB not available (private mode / insecure context)')
      return
    }
    try {
      await ensureDbReady()
    } catch (e) {
      console.error('[offline] ensureDbReady failed', e)
      // continue — db may still be usable, or will throw below and be caught
    }

    let local: LocalSavedAmalan | undefined
    const rawId = (amalan.value as any)?.id ?? (effectiveAmalan.value as any)?.id
    const id = rawId != null ? String(rawId) : null
    if (id) {
      try {
        local = await db.saved_amalan.where('[amalan_id+folder_id]').equals([id, 0]).first()
      } catch (e) {
        console.error('[offline] where compound [amalan_id+folder_id] failed', e)
      }
      if (!local) {
        try {
          local = await db.saved_amalan.where('amalan_id').equals(id).first()
        } catch (e) {
          console.error('[offline] where amalan_id fallback failed', e)
        }
      }
    }
    // Fallback by slug — critical for offline first load (amalan.value is null, chicken-egg)
    if (!local && slug.value) {
      try {
        local = await db.saved_amalan.where('slug').equals(slug.value).first()
      } catch (e) {
        console.error('[offline] where slug failed', e)
      }
    }

    if (local) {
      isSaved.value = true
      localData.value = local
      const serverVer = (amalan.value as any)?.content_version ?? local.content_version ?? 1
      hasUpdateAvailable.value = (local.content_version ?? 1) < (serverVer ?? 1)
    } else {
      isSaved.value = false
      localData.value = null
      hasUpdateAvailable.value = false
    }
  } catch (err) {
    console.error('[offline] checkOfflineStatus failed', err)
    // Don't spam toast on every check; only if we had expected data
    // toast.error('Gagal memeriksa status offline.')
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showSettings.value) {
    showSettings.value = false
  }
  if (e.key === 'Escape' && showSaveToFolderModal.value) {
    closeSaveToFolderModal()
  }
}

watch(showSettings, (open) => {
  if (open) {
    document.addEventListener('keydown', onKeydown)
    // prevent background scroll on mobile
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', onKeydown)
    // only clear overflow if save modal not open
    if (!showSaveToFolderModal.value) document.documentElement.style.overflow = ''
  }
})

watch(showSaveToFolderModal, (open) => {
  if (open) {
    document.addEventListener('keydown', onKeydown)
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', onKeydown)
    if (!showSettings.value) document.documentElement.style.overflow = ''
  }
})

// Fase 6 helpers
async function loadFolders() {
  try {
    if (!isIndexedDBAvailable()) return
    await ensureDbReady()
    allFolders.value = await db.folders.toArray()
  } catch (e) {
    console.error('[offline] loadFolders failed', e)
  }
}

function getFolderDepth(folder: LocalFolder): number {
  let depth = 0
  let curId: number | null = folder.parent_id ?? null
  const visited = new Set<number>()
  while (curId != null && !visited.has(curId)) {
    visited.add(curId)
    const parent = allFolders.value.find((f) => f.id === curId)
    if (!parent) break
    depth += 1
    curId = parent.parent_id ?? null
    if (depth > 20) break
  }
  return depth
}

function getFolderPath(folder: LocalFolder): string {
  const parts: string[] = []
  let cur: LocalFolder | undefined = folder
  const visited = new Set<number>()
  while (cur && cur.id != null && !visited.has(cur.id)) {
    visited.add(cur.id)
    parts.unshift(cur.name)
    if (cur.parent_id == null) break
    cur = allFolders.value.find((f) => f.id === cur.parent_id)
  }
  return parts.join(' / ')
}

const orderedFoldersForSave = computed(() => {
  // sort by depth then name so parents appear before children
  return [...allFolders.value].sort((a, b) => {
    const da = getFolderDepth(a)
    const dbd = getFolderDepth(b)
    if (da !== dbd) return da - dbd
    return a.name.localeCompare(b.name)
  })
})

async function openSaveToFolderModal() {
  await loadFolders()
  // default target: prefer first folder if exists, else root (0)
  // if root already saved and folders exist, default to first folder to avoid immediate duplicate toast
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
  if (isSavingToFolder.value) return
  const src = effectiveAmalan.value as any
  const lyricsToSave = effectiveLyrics.value
  if (!src || !lyricsToSave.length) {
    toast.error('Konten belum siap untuk disimpan offline.')
    return
  }
  if (!isIndexedDBAvailable()) {
    toast.error('Penyimpanan offline tidak tersedia di browser ini.')
    return
  }
  if (saveTargetFolderId.value == null) {
    toast.error('Pilih folder tujuan terlebih dahulu.')
    return
  }
  const targetId = saveTargetFolderId.value as number
  const idStr = String(src.id ?? (src as any).amalan_id ?? localData.value?.amalan_id ?? '')
  if (!idStr) {
    toast.error('Data amalan tidak valid.')
    return
  }
  isSavingToFolder.value = true
  try {
    await ensureDbReady()
    // check duplicate in target folder via compound index
    let exists: LocalSavedAmalan | undefined
    try {
      exists = await db.saved_amalan.where('[amalan_id+folder_id]').equals([idStr, targetId]).first()
    } catch (e) {
      console.error('[offline] duplicate check compound failed', e)
      // fallback to filter
      const candidates = await db.saved_amalan.where('amalan_id').equals(idStr).toArray().catch(() => [] as LocalSavedAmalan[])
      exists = candidates.find((c) => (c.folder_id ?? 0) === targetId)
    }
    if (exists) {
      toast.error('Sudah ada di folder tersebut')
      return
    }

    const plainLyrics: LocalSavedAmalan['lyrics'] = toPlainLyrics(lyricsToSave as any)
    const plainPayload: LocalSavedAmalan = toSavedAmalanPayload(
      { ...src, id: idStr, slug: String(src.slug ?? slug.value ?? '') },
      plainLyrics,
      targetId,
    ) as LocalSavedAmalan
    await db.saved_amalan.add(plainPayload)
    toast.success(targetId === 0 ? 'Berhasil disimpan di Koleksi Utama.' : 'Berhasil disimpan ke folder.')
    closeSaveToFolderModal()
  } catch (err: any) {
    console.error('[offline] confirmSaveToFolder failed', err)
    const msg = err?.message || ''
    if (/ConstraintError|already exists|unique/i.test(msg)) {
      toast.error('Sudah ada di folder tersebut')
    } else {
      toast.error(msg || 'Gagal menyimpan ke folder.')
    }
  } finally {
    isSavingToFolder.value = false
  }
}

onMounted(async () => {
  await checkOfflineStatus()
  await loadFolders()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})

watch(amalan, async () => {
  await checkOfflineStatus()
})
watch(slug, async () => {
  await checkOfflineStatus()
})

async function toggleOffline() {
  if (isSaving.value) return
  const src = effectiveAmalan.value as any
  const lyricsToSave = effectiveLyrics.value
  if (!src || !lyricsToSave.length) {
    toast.error('Konten belum siap untuk disimpan offline.')
    return
  }
  if (!isIndexedDBAvailable()) {
    toast.error('Penyimpanan offline tidak tersedia di browser ini. Coba gunakan Chrome terbaru dan pastikan bukan mode private.')
    return
  }

  isSaving.value = true
  try {
    try {
      await ensureDbReady()
    } catch (e) {
      console.error('[offline] ensureDbReady in toggle failed', e)
    }

    if (isSaved.value) {
      // Delete only the root copy [amalan_id, 0] — allow same amalan in other folders
      try {
        const amalanIdStr = String(src.id ?? (src as any).amalan_id ?? localData.value?.amalan_id ?? '')
        if (amalanIdStr) {
          try {
            await db.saved_amalan.where('[amalan_id+folder_id]').equals([amalanIdStr, 0]).delete()
          } catch (e) {
            console.error('[offline] delete compound failed, fallback to amalan_id+folder 0', e)
            // fallback: try delete by amalan_id where folder_id 0
            const candidates = await db.saved_amalan.where('amalan_id').equals(amalanIdStr).toArray()
            for (const c of candidates) {
              if ((c.folder_id ?? 0) === 0 && c.id != null) await db.saved_amalan.delete(c.id)
            }
          }
          // fallback for legacy slug-only records
          if (amalanIdStr === '' && src.slug) {
            await db.saved_amalan.where('slug').equals(String(src.slug)).delete()
          }
          // verify still exists in root?
          const stillExists = await db.saved_amalan.where('[amalan_id+folder_id]').equals([amalanIdStr, 0]).first().catch(() => null)
          if (stillExists && (stillExists as any).id != null) {
            try {
              await db.saved_amalan.delete((stillExists as any).id)
            } catch {}
          }
        } else if (src.slug) {
          await db.saved_amalan.where('slug').equals(String(src.slug)).delete()
        }
      } catch (e) {
        console.error('[offline] delete failed', e)
        throw e
      }
      isSaved.value = false
      localData.value = null
      hasUpdateAvailable.value = false
      toast.success('Dihapus dari koleksi offline.')
    } else {
      // Prevent double-tap duplicate: check exists in root folder only (compound)
      let existing: LocalSavedAmalan | undefined
      try {
        const checkId = String(src.id ?? (src as any).amalan_id ?? '')
        if (checkId) {
          existing = await db.saved_amalan.where('[amalan_id+folder_id]').equals([checkId, 0]).first()
        }
        if (!existing && src.slug) existing = await db.saved_amalan.where('slug').equals(String(src.slug)).first()
      } catch {}
      if (existing) {
        isSaved.value = true
        localData.value = existing
        toast.success('Sudah tersimpan offline.')
        return
      }

      const plainLyrics: LocalSavedAmalan['lyrics'] = toPlainLyrics(lyricsToSave as any)
      const plainPayload: LocalSavedAmalan = toSavedAmalanPayload(src, plainLyrics, 0) as LocalSavedAmalan
      await db.saved_amalan.add(plainPayload)
      isSaved.value = true
      toast.success('Berhasil disimpan offline.')
      await checkOfflineStatus()
    }
  } catch (err: any) {
    console.error('[offline] toggleOffline failed', err)
    const name = err?.name || ''
    const msg = err?.message || ''
    // Dexie VersionError on old HP DB — try one-time delete & retry
    if (/VersionError|SchemaError|UpgradeError/i.test(name + ' ' + msg)) {
      try {
        toast.warning('Memperbaiki penyimpanan offline, coba lagi…')
        db.close()
        await db.delete()
        await db.open()
        toast.error('Penyimpanan telah diperbaiki — ketuk Simpan offline lagi.')
      } catch (e2) {
        console.error('[offline] recovery failed', e2)
        toast.error('Gagal memperbaiki penyimpanan offline. Coba hapus data situs di pengaturan browser.')
      }
      return
    }
    // Quota exceeded, SecurityError (iOS private), etc.
    if (/QuotaExceeded|Storage/i.test(name + ' ' + msg)) {
      toast.error('Penyimpanan penuh — hapus beberapa amalan offline atau bersihkan cache browser.')
      return
    }
    if (/SecurityError|NotAllowedError/i.test(name)) {
      toast.error('Browser memblokir penyimpanan offline (mode private atau izin ditolak).')
      return
    }
    toast.error(msg || 'Gagal menyimpan offline.')
  } finally {
    isSaving.value = false
  }
}

async function updateOffline() {
  if (isSaving.value) return
  const src = amalan.value as any
  const lyricsToSave = effectiveLyrics.value
  if (!src || !lyricsToSave.length) {
    toast.error('Konten belum siap untuk diperbarui.')
    return
  }
  if (!isIndexedDBAvailable()) {
    toast.error('Penyimpanan offline tidak tersedia.')
    return
  }
  isSaving.value = true
  try {
    try {
      await ensureDbReady()
    } catch {}
    const plainLyricsUpd: LocalSavedAmalan['lyrics'] = toPlainLyrics(lyricsToSave as any)
    const plainModify = {
        content: JSON.stringify(plainLyricsUpd),
        lyrics: plainLyricsUpd,
        content_version: Number(src.content_version ?? 1),
        server_updated_at: String(src.updated_at ?? (src as any).updatedAt ?? new Date().toISOString()),
        last_synced_at: Date.now(),
        has_update_available: false,
      }
    const updated = await db.saved_amalan.where('amalan_id').equals(String(src.id)).modify(plainModify)
    if (!updated) {
      // fallback by slug if amalan_id modify matched 0
      if (src.slug) {
        await db.saved_amalan.where('slug').equals(String(src.slug)).modify(plainModify)
      }
    }
    hasUpdateAvailable.value = false
    await checkOfflineStatus()
    toast.success('Konten offline diperbarui.')
  } catch (err: any) {
    console.error('[offline] updateOffline failed', err)
    toast.error(err?.message || 'Gagal memperbarui offline.')
  } finally {
    isSaving.value = false
  }
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
  // fetchingAmalan alone should not hide article when effectiveAmalan already exists (offline fallback or cached).
  // Only show skeleton while initial load is pending and no fallback available.
  () => loadingAmalan.value || (!effectiveAmalan.value && !amalanError.value && !hasOfflineFallback.value),
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
  transition:
    background-color 260ms ease,
    border-color 260ms ease,
    box-shadow 260ms ease;
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
  transition: opacity 260ms ease;
}
.amalan-paper__inner-border {
  position: absolute;
  inset: 10px;
  border: 1.35px dotted #e6ddd0;
  border-radius: 14px;
  pointer-events: none;
  transition: border-color 260ms ease;
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

/* ── Dark paper ── */
.amalan-paper.dark-paper {
  background: #1a2420;
  border-color: #2a3a32;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.14),
    0 12px 32px rgba(0, 0, 0, 0.22),
    0 1px 0 rgba(255, 255, 255, 0.04) inset;
}
.amalan-paper.dark-paper .amalan-paper__inner-border {
  border-color: rgba(232, 230, 222, 0.1);
}
.amalan-paper.dark-paper .amalan-paper__texture {
  opacity: 0.045;
}
.amalan-paper.dark-paper .title-ar,
.amalan-paper.dark-paper .lyric-arab {
  color: #e8e6d8;
}
.amalan-paper.dark-paper .title-latin,
.amalan-paper.dark-paper .lyric-latin {
  color: #9bb0a5;
}
.amalan-paper.dark-paper .lyric-title-ornament span:first-child,
.amalan-paper.dark-paper .lyric-title-ornament span:last-child {
  background: #2a3a32 !important;
}
.amalan-paper.dark-paper .lyric-title-ornament span:nth-child(2) {
  background: rgba(52, 211, 153, 0.85) !important;
  box-shadow: 0 0 0 4px #1a2420 !important;
}
.amalan-paper.dark-paper .lyric-row:hover {
  background: rgba(255, 255, 255, 0.04);
}
.amalan-paper.dark-paper .bullet {
  color: #34d399;
  opacity: 0.65;
}
.amalan-paper.dark-paper .bullet--latin {
  color: #9bb0a5;
  opacity: 0.5;
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
