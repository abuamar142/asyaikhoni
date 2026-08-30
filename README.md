# 🕌 Pondok Pesantren Asy-Syaikhoni

> **بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**  
> _Landing + Khazanah Amalan offline-first untuk PPTQ Asy-Syaikhoni, Nganjuk._

[![Vue.js](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Bun](https://img.shields.io/badge/Bun-1.4.0-000?style=flat-square&logo=bun&logoColor=white)](https://bun.sh)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## ✨ Fitur

- **Landing:** Hero, About, Programs, Facilities, Sejarah, Testimonials, Contact (responsive, SEO meta)
- **Khazanah Amalan:** `/amalan` list + search + kategori, `/amalan/:slug` detail lirik Arab/Latin
- **Offline Koleksi:** `/amalan/koleksi` simpan IndexedDB (Dexie v4), folder bersarang, share bundle (link lokal + REST fallback)
- **PWA:** installable, `autoUpdate`, Workbox cache Google Fonts

## 🚀 Quick Start (Bun)

```bash
bun install
cp .env.example .env.local  # atur VITE_API_BASE_URL
bun run dev        # http://localhost:5173
bun run build      # type-check + vite build → dist/
bun run preview    # preview dist
```

`VITE_API_BASE_URL` default `https://backend.abuamar.online` (lihat `.env.example`).

## 🧩 Stack Ringkas

Vue 3 + Vite 7 + TS + Tailwind v4 · Vue Router · TanStack Query (persist) · Dexie (localDb v4) · VitePWA · lucide-vue-next

**Reusable:** `FolderPicker`, `BaseModal`, `PageHero`, `AmalanCard`, `PaperCard`, `LyricRow`, `EmptyState`, `BaseButton` + `SearchInput`/`ConfirmDialog` · **Utils:** `lyric`, `folderTree` · **Composables:** `useOfflineAmalan`, `useBodyLock`/`useEsc`, `useLyricSettings` · **DB:** `localDb` v4 compound `[amalan_id+folder_id]`

> Detail lengkap → [`PRODUCT.md`](./PRODUCT.md) (arsitektur, component map, deploy prod).

## 🎨 Warna

`#15803d` hijau tua · `#fde047` kuning · `#fdfcf8` paper

## 📍 Kontak

[Nganjuk](https://maps.app.goo.gl/TTVxPAcfveFxFzJy8) · [0815-1578-8862](tel:+6281515788862) · [yayasan.asyaikhoni@gmail.com](mailto:yayasan.asyaikhoni@gmail.com) · [@pptq_asyaikhoni](https://www.instagram.com/pptq_asyaikhoni/)

## 🚀 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abuamar142/asyaikhoni)

`vercel.json` → `buildCommand: npm run build`, SPA rewrite ke `index.html`, immutable cache `/assets/*`. Manual: `bun run build` lalu upload `dist/`.

---

<div align="center">

**بَارَكَ اللهُ فِيْكُمْ** — Made with ❤️ for PPTQ Asy-Syaikhoni

</div>
