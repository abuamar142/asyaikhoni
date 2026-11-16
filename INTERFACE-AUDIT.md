# Interface Audit — PPTQ Asy-Syaikhoni

> Cross-discipline review menjalankan skill **`better-interface`** dari [jakubkrehel/skills](https://github.com/jakubkrehel/skills), merutekan antarmuka ke enam domain (`better-accessibility`, `better-layout`, `better-writing`, `better-typography`, `better-colors`, `better-ui`) lalu dikonsolidasikan jadi satu verdict berperingkat.
>
> - **Tanggal:** 2026-11-16
> - **Branch diaudit:** `development`
> - **Bar pelaporan:** bukti (evidence), bukan selera. Pilihan desain sengaja dibiarkan; yang dilaporkan hanya pelanggaran trigger / aturan domain yang bisa ditunjukkan.

---

## Scope & stack

| Aspek | Detail |
| --- | --- |
| **Scope** | Alur **Khazanah Amalan** (`/amalan`, `/amalan/:slug`, `/amalan/koleksi`, `/amalan/share/:id`) + shared UI + chrome (header/footer). Inilah tempat interaksi berada. |
| **Boundary** | Landing marketing (`Home.vue` + `sections/*`) **tidak** diinspeksi mendalam (konten statis); `AppHeader`/`AppFooter` diinspeksi karah dipakai lintas halaman amalan. Jangan anggap landing sudah di-review. |
| **Stack** | Vue 3.5 (`<script setup>`) · Vite 7 · vite-ssg (prerender) · Tailwind CSS v4 · TS 5.8 · `lucide-vue-next` · Dexie (offline) · PWA |
| **Styling** | Token di `tailwind.config.js` (`primary`/`accent`/`islamic`/`text` + `fontSize` semantik) dan `src/assets/main.css` (`.text-*` classes, `.btn-primary/.btn-secondary`). Font: Fraunces (serif display) + DM Sans (sans) + Amiri (Arab). |
| **Dokumen konvensi** | Hanya `README.md` + `PRODUCT.md` (warna `#15803d`/`#fde047`/`#fdfcf8`). **Tidak ada** `AGENTS.md`/`CLAUDE.md`/`CONTRIBUTING.md`/design-system doc. |

### Coverage

| Domain | Evidence diinspeksi | Hasil |
| --- | --- | --- |
| Accessibility | BaseModal, ConfirmDialog, FolderPicker, SearchInput, ToastContainer, useToast, AppHeader, AmalanDetail/Offline/List/SharePreview, LyricRow; tree role check live | 7 temuan |
| Layout | PageHero, grid list/offline, toolbar sticky, modal, hover-reveal actions | 2 temuan (digabung ke a11y/ui) |
| Writing | Label tombol, empty states, error copy, ConfirmDialog default, ellipsis | 2 temuan |
| Typography | `tailwind.config` fontSize scale, main.css `.text-*`, LyricRow, input sizing, punctuation | 3 temuan |
| Colors | Diukur (WCAG ratio) pasangan token pada bg `#fff`/`#fdfcf8`; dicek render oklch | 2 temuan |
| UI polish | BaseButton, transitions, will-change, dual token system, spinners | 4 temuan |

---

## Findings

Satu tabel, diurut severity lalu reach. Trigger eskalasi (`HIGH on sight`) di atas. **15 temuan** (konsolidasi; satu root cause = satu baris).

| # | Sev | Domain | Lokasi | Sekarang | Perbaikan | Kenapa |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **HIGH** | Colors / A11y | `src/components/AmalanCard.vue:119,124,138,148` · `AmalanDetail.vue:32,229,304,318,332,486` · `AmalanList.vue:44,282,303,320` · `AmalanOffline.vue:56,142,213` · `SearchInput.vue:15` (placeholder) | `text-stone-400` (#a8a29e) untuk teks bermakna kecil (10–13px): "Lihat detail", "N amalan ditampilkan", "Akhir katalog", "Simpan untuk akses tanpa koneksi…", "Pengaturan disimpan otomatis…", footer meta, badge "Tersimpan", placeholder input | Ganti teks jadi `text-stone-500` (#78716c, 4.67:1) atau lebih gelap; sisakan `text-stone-400` hanya untuk ikon dekoratif | **Diukur 2.46–2.52:1** pada bg `#fff`/`#fdfcf8` (render: `oklch(0.709 0.01 56.259)`) — gagal **WCAG 1.4.3** (teks butuh 4.5:1; teks besar 3:1). Teks informasi tak terbaca pengguna low-vision. Systemic. |
| 2 | **HIGH** | A11y | `src/components/FolderPicker.vue:56-75` (baris Root), `86-129` (baris folder) | Baris pemilih folder = `<div @click>` + "radio" palsu (`<div class="rounded-full">`), tanpa `tabindex`/`role`/`@keydown` | Pakai `<button>` (atau `<input type="radio" name>` dalam `<label>`) per baris; drill-in tetap tombol terpisah | **WCAG 2.1.1** — memilih folder tujuan **hanya bisa via pointer**, tak terjangkau keyboard. Trigger eskalasi. (Bandingkan `AmalanOffline.vue:149-154` yang sudah benar: `role="button" tabindex=0 @keydown`.) |
| 3 | MEDIUM | A11y | `src/components/ui/BaseModal.vue:87` (`trapFocus` default `false`), dipakai oleh ConfirmDialog, FolderPicker, modal Pengaturan, Buat Folder, Share | Fokus tidak di-trap (default off), background tidak `inert`, fokus tidak dikembalikan ke trigger saat close | Jadikan trap default `true`, set `inert` pada konten di belakang saat open, simpan `document.activeElement` saat open & restore saat close | **WCAG 2.4.3** — Tab bisa keluar ke konten di belakang modal; setelah close fokus hilang ke `<body>`. |
| 4 | MEDIUM | A11y | `src/components/ui/ToastContainer.vue:3` · `AmalanList.vue:205-211` / `AmalanOffline.vue:115-123` (hitungan hasil) | Container toast & teks "Menampilkan N amalan" bukan live region (render: `[role=status]`/`[aria-live]` = **NONE** di seluruh app) | Bungkus toast dalam `role="status"` (region kosong stabil yang di-update), hitungan hasil juga `role="status"` | **WCAG 4.1.3** — pengguna screen-reader tak pernah mendengar sukses/error simpan maupun perubahan jumlah hasil pencarian. |
| 5 | MEDIUM | A11y | `src/composables/useToast.ts:21,52,56` | `DEFAULT_DURATION = 3500` → **semua** toast termasuk `error` auto-hilang 3.5 dtk | Toast ber-tipe `error` (atau yang membawa aksi) `duration: 0` / persist sampai di-dismiss manual | Error yang hilang otomatis = pesan pemulihan tak terbaca. (`better-accessibility`: toast error bertahan sampai di-dismiss.) |
| 6 | MEDIUM | A11y / Layout | `src/views/AmalanOffline.vue:145-195` | Kartu folder `role="button" tabindex=0` **membungkus** tombol Share/Edit/Hapus; aksi reveal `sm:opacity-0 sm:group-hover:opacity-100` tanpa varian focus | Kartu jadi `<div>` biasa dengan satu link/tombol "Buka"; atau keluarkan aksi dari elemen role=button. Tambah `focus-within:opacity-100` | Interactive bersarang di dalam `role="button"` = ARIA invalid; aksi hover-only **tak muncul saat fokus keyboard** di desktop (kontrol di balik disclosure tanpa cue). |
| 7 | MEDIUM | A11y / Typography | `src/components/ui/SearchInput.vue:8-19` · input modal `AmalanOffline.vue:303-311,364,368` | `<input>` `text-[14px]` tanpa override mobile; SearchInput tanpa `<label>`/`aria-label` (hanya placeholder) | `text-base sm:text-sm` (≥16px di mobile) + beri `aria-label="Cari amalan"` (placeholder ≠ label) | iOS Safari zoom paksa saat input <16px (`better-typography`); input tanpa nama aksesibel = SR tak tahu fungsinya (**WCAG 4.1.2**). |
| 8 | MEDIUM | Colors | `src/components/LyricRow.vue:177` (`.lyric-latin` #6e7d71) · `AmalanDetail.vue:272` (title latin #6e7d71) | Transliterasi Latin italic kecil (~14px) warna #6e7d71 di atas `#fdfcf8` | Turunkan lightness (mis. #5f6d62 → ~5:1) | **Diukur 4.23:1** — di bawah ambang 4.5:1 untuk teks normal (**WCAG 1.4.3**). Marginal tapi teks baca inti. |
| 9 | MEDIUM | Writing | `src/views/AmalanOffline.vue:335-341` (ConfirmDialog hapus folder) · default di `ConfirmDialog.vue:33-35` | Konfirmasi hapus memakai tombol default `confirmLabel="Ya"` / `cancelLabel="Batal"`, title default `"Konfirmasi"` | Lewatkan `confirm-label="Hapus folder"` (dan hindari default `Ya`/`Konfirmasi`) | Tombol dialog harus **verb + objek**, bukan `Ya`/`No`; title menamai aksi + objek. Dialog harus bisa dijawab tanpa baca body. |
| 10 | MEDIUM | UI | `src/views/AmalanSharePreview.vue` (seluruh) · `AppHeader.vue:52,124` · `AppFooter.vue` · `main.css:254-284` | Dua sistem token paralel: SharePreview/Header/Footer pakai legacy `.btn-primary`/`.text-brand`/`.text-heading-*`/`.text-muted`; AmalanList/Detail/Offline pakai inline `emerald-*`/`stone-*`/`#fdfcf8` | Satukan — pindahkan SharePreview/Header/Footer ke sistem emerald/stone yang dipakai alur amalan, atau sebaliknya | Detail yang sama dikerjakan dua cara di dalam proyek = temuan konsistensi (`better-ui`). SharePreview terasa beda halaman. |
| 11 | MEDIUM | UI | `src/components/ui/BaseButton.vue:7` · `main.css:260,277` (`transition: all`) · `AppHeader.vue:3,38,61` | `transition-all` / `transition: all 0.3s` pada komponen shared | Sebut properti eksplisit: `transition-[color,background-color,box-shadow,transform]` | `transition: all` menganimasi properti tak terduga & memukul layout; `better-ui` minta properti yang berubah disebut. Reach: tombol dasar seluruh app. |
| 12 | MEDIUM | A11y | `src/components/layout/AppHeader.vue:59-66` | Tombol hamburger tanpa `aria-expanded`/`aria-controls`; `aria-label="Toggle mobile menu"` (Inggris di UI berbahasa Indonesia) | Tambah `:aria-expanded="isMobileMenuOpen"`, `aria-controls="mobile-menu"` (beri `id`), label "Buka menu" | **WCAG 4.1.2** — status buka/tutup menu tak diumumkan ke SR. |
| 13 | LOW | UI | `src/components/AmalanCard.vue:3` (`will-change-transform`) · `AmalanDetail.vue:10` (`will-change-[width]`) · toggles `:374,476` | `will-change` permanen di tiap kartu & knob; progress menganimasi `width` | Hapus `will-change` (pasang hanya jika terlihat stutter); progress pakai `transform: scaleX()` bukan `width` | `will-change` permanen boros memori (per-kartu); `width` memicu layout, bukan compositor-friendly (`better-ui`). |
| 14 | LOW | Typography | `src/views/AmalanSharePreview.vue:10` ("dibagikan...") · `:135` (`Mengimpor...`) | Literal `...` tiga titik, bukan karakter ellipsis `…`; tak konsisten dengan "Memuat katalog…" di tempat lain | Ganti ke `…` | `better-typography`: teks ter-render pakai karakter tipografis, bukan pengganti keyboard. |
| 15 | LOW | UI / A11y / Colors | Spinner `animate-spin` (`AmalanList.vue:313`, `AmalanSharePreview.vue:9`, dll) tanpa `prefers-reduced-motion` · `main.css:120` `.text-light` (dead, 2.54:1) · `AppHeader.vue:22` h1 logo + `PageHero` h1 (dua h1 di list/offline) | — | Gate spinner di `motion-safe:` atau kecilkan; hapus token `.text-light` yang tak dipakai; logo header jadikan `<p>`/`<span>`, biarkan hero sebagai satu-satunya `<h1>` | Kumpulan polish kecil: motion tak hormati reduced-motion, token mati, outline heading ganda (rekomendasi, non-blokir). |

---

## Verification

**Dijalankan:**
- **Kontras diukur** (rumus WCAG relative-luminance, bukan ditebak) untuk semua pasangan token pada bg `#ffffff`/`#fdfcf8`/`#ecfdf5`/`#fafaf9`. Hasil kunci: `stone-400` **2.46–2.52:1** (gagal), `text-light` 2.54:1, `lyric-latin #6e7d71` **4.23:1** (gagal), `stone-500` 4.67:1 (lolos), `text-muted #6b7280` 4.71:1 (lolos), excerpt `#5a6d5f` 5.40:1, body `#374151` 10.0:1, white-on-`emerald-700` 5.48:1 (lolos), white-on-`emerald-600` 3.77:1.
- **Render live** (prod `asyaikhoni.abuamar.online`, berbagi alur amalan): `document.querySelector('[role=status],[aria-live]')` → **NONE** (konfirmasi temuan #4); warna render "Lihat detail" = `oklch(0.709 0.01 56.259)` = #a8a29e (konfirmasi #1); `h1` pada detail = 1.
- **Inspeksi sumber** per domain dengan sitasi `path:line` (tabel di atas).

**Not verified:**
- **Reflow 320px & zoom 200%** — override lebar viewport headless tidak terpasang; layout responsif secara konstruksi (grid `md:` collapse, `flex-col`, input `w-full`, `truncate`) tanpa bukti clip, tapi belum diverifikasi runtime.
- **Perilaku Tab aktual** pada FolderPicker — temuan #2 dari kode (div tanpa `tabindex`/handler = pasti pointer-only); urutan tab tidak di-walk di browser.
- **Lingkungan dev** (`asyaikhoni-dev.abuamar.online`) sudah **NXDOMAIN** (dihapus sejak sesi lalu); verifikasi render jatuh ke prod yang tertinggal di `main`.
- **Screen reader nyata** (NVDA/VoiceOver) tidak dijalankan.

---

## Verdict

**`Block`** — ada temuan `HIGH`:

1. **#1** `text-stone-400` teks bermakna gagal kontras 4.5:1 (terukur 2.46–2.52:1), systemic lintas alur amalan.
2. **#2** Baris pemilih di FolderPicker pointer-only, tak terjangkau keyboard.

Perbaiki keduanya sebelum rilis. Temuan `MEDIUM`/`LOW` tetap sebagai pekerjaan di tabel.

`Approve` hanya mencakup domain yang tertera "diinspeksi" di tabel coverage. **Landing page (`Home.vue` + `sections/*`) `Not reviewed`** — di luar scope.
