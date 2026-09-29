# PRODUCT — PPTQ Asy-Syaikhoni

Landing + Khazanah Amalan (offline-first) untuk Pondok Pesantren Tahfidzul Qur'an Asy-Syaikhoni, Nganjuk.

## Tech Stack

- **Runtime:** Bun 1.4.0 (`packageManager: bun@1.4.0`, `bun.lock`)
- **Frontend:** Vue 3.5 + Vite 7, TypeScript 5.8, Vue Router 4
- **Style:** Tailwind CSS v4 (`@tailwindcss/postcss`, aspect-ratio/forms/typography), PostCSS, Fraunces + DM Sans
- **Data:** `@tanstack/vue-query` + `query-persist` (localStorage `amalan-query-cache`, buster `v2`, 5m stale / 10m gc)
- **Offline:** Dexie 4 (IndexedDB) + `vite-plugin-pwa` (autoUpdate, Workbox)
- **Lain:** `lucide-vue-next`, `marked`, `dompurify`, `workbox-window`

## Arsitektur

```
src/
  assets/main.css        # Tailwind base + global styles
  components/
    AmalanCard.vue       # card list/offline (bookmark, kategori pills)
    FolderPicker.vue     # drill-down picker + breadcrumb
    LyricRow.vue         # 1 baris lirik: Arab center • split, Latin italic
    layout/AppHeader.vue, AppFooter.vue
    sections/            # Hero, About, Programs, Facilities, Sejarah, Testimonials, Contact
    ui/                   # BaseButton, BaseModal, PageHero, PaperCard, LyricRow, EmptyState, SearchInput, ConfirmDialog, ToastContainer
  composables/
    useAmalanQueries     # list + bySlug (ById/markdown removed exp-12)
    useCategoryQueries   # list kategori
    useOfflineAmalan     # IndexedDB CRUD + folder logic (detail + offline)
    useOfflineSync       # removed — dead code
    useBodyLock/useEsc   # modal a11y
    useLatinToggle → useLyricSettings  # showLatin + fontSize + isDark
    useDebouncedRef, useToast
  utils/
    localDb.ts           # Dexie v4 — saved_amalan &[amalan_id+folder_id], folders parent_id
    lyric.ts             # toPlainLyrics, toSavedAmalanPayload, parseLegacyContent
    folderTree.ts        # hasChildren, getFolderDepth/Path, buildBreadcrumb, collectDescendants
    httpClient.ts        # ApiClient VITE_API_BASE_URL + data-unwrap
    navigation.ts        # scrollToSection, handleCrossRouteNavigation
    queryClient.ts
  services/              # amalanService, categoryService, shareService (local + REST fallback)
  views/ Home, Sejarah, AmalanList, AmalanDetail, AmalanOffline, AmalanSharePreview
  router/index.ts        # /, /sejarah, /amalan, /amalan/koleksi, /amalan/share/:share_id, /amalan/:slug
  data/ pondokData, sejarahData
```

## Reusable Components (canonical)

| Komponen | Lokasi | Pakai di |
|----------|--------|----------|
| **BaseButton** | `ui/BaseButton.vue` | semua CTA/pill (pill `rounded-full`, `h-10` md default, `!p-0` icon-square) |
| **BaseModal** | `ui/BaseModal.vue` | FolderPicker, settings (Teleport, backdrop blur, Esc + focus trap) |
| **PageHero** | `ui/PageHero.vue` | AmalanList, AmalanOffline (eyebrow, title/accent, arc, actions-left/right, stats-right) |
| **PaperCard** | `ui/PaperCard.vue` | AmalanDetail (paper `#fdfcf8`, inner dotted border, dark variant) |
| **LyricRow** | `LyricRow.vue` | AmalanDetail (Arab RTL center, `•` → split 2-col, Latin toggle) |
| **AmalanCard** | `AmalanCard.vue` | AmalanList + AmalanOffline (kategori pills, bookmark corner) |
| **FolderPicker** | `FolderPicker.vue` | AmalanDetail + AmalanOffline (breadcrumb, chevron drill-down) |
| **EmptyState** | `ui/EmptyState.vue` | list/detail/offline (88px rounded-[22px] + amber dot) |
| **SearchInput** | `ui/SearchInput.vue` | AmalanList toolbar |
| **ConfirmDialog** | `ui/ConfirmDialog.vue` | AmalanOffline delete confirm |
| **ToastContainer** | `ui/ToastContainer.vue` | global `useToast()` |

## Utils & Composables

- **lyric.ts** — `toPlainLyrics(rows)`, `toSavedAmalanPayload(src, lyrics, folderId)`, `parseLegacyContent(content)` (v1 JSON fallback).
- **folderTree.ts** — `hasChildren`, `getFolderDepth`, `getFolderPath`, `buildBreadcrumb`, `collectDescendants` (BFS, cycle-safe).
- **localDb.ts v4** — `MyDatabase` Dexie: `saved_amalan ++id, &[amalan_id+folder_id]` + `folders ++id, parent_id`; upgrades v1→v4 (lyrics migration, parent_id, dedupe compound key); helpers `ensureDbReady()`, `isIndexedDBAvailable()`.
- **useOfflineAmalan(amalan, slug)** — `isSaved/localData/hasUpdate, allFolders, isSaving`, `loadFolders/checkStatus/saveToFolder/remove/update`.
- **useBodyLock(isOpen)** / **useEsc(isOpen, onClose)** — scroll lock + Esc listener (watch + onBeforeUnmount).
- **useLyricSettings** — `showLatin/toggleLatin` (via `useLatinToggle`), `fontSize/isDark` (+ increase/decrease/clamp 8–36), persist localStorage.

## Dev / Build / Deploy

```bash
bun install          # install (bun.lock)
bun run dev          # vite dev (http://localhost:5173)
bun run build        # run-p type-check + vite build → dist/
bun run build-only   # vite build saja
bun run type-check   # vue-tsc --build
bun run lint         # eslint . --fix
bun run format       # prettier --write src/
bun run preview      # vite preview
```

- **Env:** `VITE_API_BASE_URL` (lihat `.env.example`, lokal `.env.local` sudah `.gitignore`). Default `https://backend.abuamar.online`.
- **API:** `backend.abuamar.online` dilayani container `portfolio-cms` (Next.js + Payload, `/opt/portfolio-cms`, port 3001) lewat vhost nginx `backend`; datanya MongoDB di container `portfolio-db`. Endpoint publik ada di `app/api/v1/asyaikhoni/*` repo **portfolio-cms** — bukan repo ini.
- **PWA:** `VitePWA` autoUpdate, manifest `PPTQ Asy-Syaikhoni`, theme `#16a34a`, ikon PNG 192/512 (+ maskable), Workbox `globPatterns` + `runtimeCaching` google fonts CacheFirst 365d dan `api-cache` (hanya respons `application/json`), chunk `vendor`/`icons`.
- **SSG:** `vite-ssg` prerender `/`, `/sejarah`, `/amalan`, tiap `/amalan/:slug` (slug dari API), sitemap + robots; `onFinished` menyaring slug yang sudah ter-render agar sitemap tidak duplikat.

### Deploy produksi (VPS)

Push ke `main` → GitHub Actions (`.github/workflows/deploy.yml`) → SSH ke VPS →
`/opt/ops/bin/deploy-asyaikhoni.sh main`:

1. `git fetch` + checkout/pull branch, `bun install --frozen-lockfile`, `bun run build`
2. rsync `dist/` ke staging, lalu swap atomik ke `/var/www/asyaikhoni`
3. `chown www-data`, `nginx -t`, reload, health check HTTPS, notifikasi Telegram

| Branch | Web root | Domain |
|---|---|---|
| `main` | `/var/www/asyaikhoni` | `asyaikhoni.abuamar.online` |
| `development` | `/var/www/dev-asyaikhoni` | `asyaikhoni-dev.abuamar.online` |

Deploy API/CMS terpisah: push ke `main` repo `portfolio-cms` → `/opt/ops/bin/deploy-cms.sh main`.
Manual: `bun run build` lalu upload `dist/`.
