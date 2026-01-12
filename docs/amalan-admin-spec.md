# Spesifikasi Fitur: Admin CRUD Amalan

## Ringkasan

Fitur admin untuk mengelola data "amalan" (mis. tahlil, doa, dll). Data disimpan di Supabase dengan RLS. Publik dapat mengakses daftar amalan di `/amalan` dan detail amalan di `/amalan/:slug`. Admin login via halaman `/admin/login`, kemudian masuk ke dashboard `/admin/amalan` untuk CRUD (buat, baca, ubah, hapus). Registrasi admin dilakukan manual di Supabase Dashboard (tidak ada halaman register).

## Tujuan & Ruang Lingkup

- CRUD penuh untuk entitas `amalan` khusus peran admin.
- Halaman publik daftar & detail amalan yang aktif (`aktif=true`).
- Autentikasi menggunakan Supabase Email/Password.
- RLS: Publik hanya dapat membaca amalan aktif; admin dapat CRUD semua.

## Peran Pengguna

- Publik: dapat melihat daftar amalan aktif dan detail per slug.
- Admin: autentikasi diperlukan; akses penuh ke CRUD amalan.

## Data Model (Supabase)

### Tabel `amalan`

- `id`: `uuid` (PK, default `gen_random_uuid()`)
- `judul`: `text` (wajib)
- `slug`: `text` (wajib, unik)
- `ringkasan`: `text` (opsional; deskripsi singkat)
- `md_path`: `text` (wajib; path file Markdown di Storage, mis. `amalan/tahlil.md`)
- `md_bucket_id`: `text` (wajib, default 'amalan-md')
- `kategori`: `text` (opsional; mis. "tahlil", "doa")
- `ikon_url`: `text` (opsional)
- `urutan`: `int4` (opsional; untuk sorting)
- `aktif`: `boolean` (default `true`)
- `created_at`: `timestamptz` (default `now()`)
- `updated_at`: `timestamptz` (default `now()` dengan trigger)

### Tabel `admins`

- `user_id`: `uuid` (PK, referensi `auth.users.id`)
- `created_at`: `timestamptz` (default `now()`)

### RLS & Kebijakan

Enable RLS di `amalan` dan `admins`.

Kebijakan `amalan`:

- Select publik (read):
  - "Public read active": `using (aktif = true)`
- Select admin (read all):
  - `using (exists (select 1 from admins a where a.user_id = auth.uid()))`
- Insert/Update/Delete admin saja:
  - `with check (exists (select 1 from admins a where a.user_id = auth.uid()))`

Kebijakan `admins`:

- Dapat diset hanya admin yang boleh select (opsional), atau kosong jika hanya untuk kontrol akses.

Contoh SQL (jalankan di Supabase SQL editor):

```sql
create table if not exists public.amalan (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  slug text not null unique,
  ringkasan text,
  md_path text not null,
  md_bucket_id text not null default 'amalan-md',
  kategori text,
  ikon_url text,
  urutan int4,
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.amalan enable row level security;
alter table public.admins enable row level security;

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on public.amalan;
create trigger trg_set_updated_at before update on public.amalan
for each row execute function public.set_updated_at();

-- Policies for amalan
create policy "public can read active amalan" on public.amalan
for select using (aktif = true);

create policy "admins can read all amalan" on public.amalan
for select using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins can insert amalan" on public.amalan
for insert with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins can update amalan" on public.amalan
for update using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins can delete amalan" on public.amalan
for delete using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Optionally restrict admins table visibility
create policy "admins manage admins table" on public.admins
for select using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
```

### Supabase Storage (Markdown)

Bucket untuk menyimpan konten amalan sebagai file Markdown:

```sql
-- Buat bucket publik untuk file Markdown amalan
insert into storage.buckets (id, name, public)
values ('amalan-md', 'amalan-md', true)
on conflict (id) do nothing;

-- Policies: publik boleh baca, admin boleh tulis
create policy "public read amalan md" on storage.objects
for select using (bucket_id = 'amalan-md');

create policy "admins insert amalan md" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'amalan-md'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

create policy "admins update amalan md" on storage.objects
for update to authenticated
using (
  bucket_id = 'amalan-md'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
)
with check (
  bucket_id = 'amalan-md'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

create policy "admins delete amalan md" on storage.objects
for delete to authenticated
using (
  bucket_id = 'amalan-md'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);
```

## Routing & Halaman

### Publik

- `/amalan`: daftar amalan aktif (list, cari/filter, urutan).
- `/amalan/:slug`: halaman detail amalan.

### Admin

- `/admin/login`: halaman login (email/password via Supabase Auth).
- `/admin/amalan`: dashboard daftar amalan (semua, termasuk non-aktif), aksi: buat/ubah/hapus/toggle aktif.
- `/admin/amalan/new`: form buat amalan.
- `/admin/amalan/:id/edit`: form edit amalan.

Route guard: admin routes menggunakan meta `requiresAuth: true` + `requiresAdmin: true`. Guard mengecek session Supabase dan membership di tabel `admins`.

Catatan konten: isi amalan diambil dari file Markdown di Supabase Storage (`amalan-md`). Saat `slug` berubah, file dapat di-rename atau dibuat baru lalu file lama dihapus.

## Struktur Komponen (rencana file)

Publik:

- `src/views/AmalanList.vue`: list publik.
- `src/views/AmalanDetail.vue`: detail berdasarkan `slug`.

Admin:

- `src/views/Admin/Login.vue`: form login.
- `src/views/Admin/AmalanList.vue`: tabel daftar amalan.
- `src/views/Admin/AmalanForm.vue`: form create/update.
- `src/components/admin/AmalanTable.vue`: tabel dengan aksi edit/hapus/toggle aktif.
- `src/components/admin/AmalanFormFields.vue`: fields (judul, slug, ringkasan, konten, kategori, ikon, aktif, urutan).

Router:

- Update `src/router/index.ts`: definisi rute + guard.

## Services & Composables

- `src/utils/supabaseClient.ts`: inisialisasi klien Supabase.
- `src/services/amalanService.ts`:
  - `listPublic({ q, kategori, limit, offset })`
  - `listAll({ q, kategori, limit, offset })` (admin)
  - `getBySlug(slug)` (ambil metadata dari tabel `amalan`)
  - `getById(id)`
  - `downloadMarkdown(md_path)` (unduh konten `.md` dari bucket `amalan-md`)
  - `createAmalan({ judul, slug, ringkasan, kategori, ikon_url, urutan, aktif, mdFile })` (unggah ke Storage lalu simpan record dengan `md_path`)
  - `updateAmalan(id, payload)` (opsional ganti file `.md`; jika `slug` berubah, pindahkan/unggah ulang file dan update `md_path`)
  - `deleteAmalan(id)`
  - `toggleAktif(id, aktif)`
- `src/services/authService.ts`:
  - `login(email, password)`
  - `logout()`
  - `getSession()`
  - `isAdmin()` (cek tabel `admins` untuk `auth.uid()`)

Catatan: gunakan Composition API (tanpa Pinia) untuk state sederhana; jika diperlukan, dapat menambah store nanti.

## Validasi & UX

- `judul`: wajib.
- `slug`: unik, auto-generate dari judul (dapat diubah manual), validasi uniqueness via Supabase.
- Konten: wajib file `.md`; pratinjau render Markdown di admin form.
- `kategori`: opsional; gunakan select atau input bebas.
- `urutan`: angka; default null.
- `aktif`: boolean; default true.
- Loading states, error handling (toast/alert), disabled saat submit.

## Styling & UI

- **Framework & theme**: gunakan Tailwind CSS sesuai konfigurasi di proyek saat ini (lihat `tailwind.config.js` dan `src/assets/main.css`). Jangan hardcode warna/typography; gunakan kelas utilitas dan variabel tema yang sudah ada.
- **Warna**: pakai palet warna yang telah didefinisikan di `tailwind.config.js` (mis. primary/secondary/neutral). Hindari hex baru; gunakan kelas seperti `bg-primary`, `text-secondary`, atau mapping utilitas yang sudah tersedia.
- **Font**: gunakan font default proyek (terpasang di `src/assets/main.css`). Pastikan ukuran huruf, line-height, dan tracking konsisten dengan halaman yang ada.
- **Komponen**: ikuti gaya komponen yang ada (tombol, input, textarea, select, tabel). Reuse kelas utilitas yang sama untuk border, padding, radius, fokus, dan state disabled. Jika perlu varian baru, definisikan minimal di `src/assets/main.css` tanpa menambah library UI baru.
- **Layout**: halaman publik `/amalan` mengikuti layout umum situs (header/footer yang ada). Admin dapat menggunakan layout khusus, namun harus konsisten tema (spacing, warna, font) dengan situs.
- **Responsif**: patuhi breakpoint Tailwind default proyek. Pastikan tabel dan form di admin responsif (stack pada layar kecil, scroll pada tabel lebar).
- **Dark mode (jika ada)**: hormati konfigurasi dark mode proyek (`dark:` utilities). Pastikan kontras warna, fokus, dan readability terjaga.
- **Aksesibilitas**: gunakan elemen semantik, label yang terkait dengan input, dan state fokus yang jelas. Hindari teks kontras rendah.

## Konfigurasi & Environment

- `.env` (Vite):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Pastikan RLS sudah sesuai; anon key cukup untuk client-side. Admin hak akses dijaga oleh RLS dan membership `admins`.

## Keamanan

- Route guard admin & cek `admins`.
- RLS mencegah mutasi oleh non-admin.
- Storage policies: bucket `amalan-md` public read, hanya admin yang bisa insert/update/delete objek.
- Sanitasi konten Markdown saat render (XSS): gunakan renderer yang aman atau sanitize HTML dari Markdown.

## Acceptance Criteria

- Publik:
  - Dapat melihat daftar amalan aktif di `/amalan`.
  - Dapat membuka detail amalan via `slug` dan melihat konten yang dirender dari file Markdown.
- Admin:
  - Dapat login dengan email/password yang terdaftar (manual di Supabase); logout berfungsi.
  - Dapat melihat semua amalan (aktif/non-aktif) di `/admin/amalan`.
  - Dapat membuat amalan baru (judul, slug, metadata + unggah file `.md`).
  - Dapat mengedit amalan (ubah metadata; opsional ganti file `.md`).
  - Dapat menghapus amalan (record) dan opsional menghapus file `.md` terkait.
  - Dapat toggle status `aktif`.
  - Akses admin ditolak jika bukan member `admins`.
  - Styling seluruh halaman dan komponen konsisten dengan tema proyek (warna, font, utilitas Tailwind) tanpa menambah library UI baru.

## Rencana Implementasi (Task Breakdown)

1. Setup Supabase: buat tabel `amalan`, `admins`, aktifkan RLS & kebijakan.
2. Tambah `.env` untuk Supabase.
3. Buat `supabaseClient.ts`.
4. Implement `authService` + halaman `Login.vue` + router guard.
5. Implement `amalanService`.
6. Implement halaman publik: `AmalanList.vue`, `AmalanDetail.vue`.
7. Implement halaman admin: `AmalanList.vue`, `AmalanForm.vue`, komponen tabel & form.
8. Tambah validasi & UX (loading/error/toast).
9. QA: uji alur publik & admin sesuai acceptance criteria.

## Catatan Tambahan

- SEO: tambahkan meta tags untuk halaman publik /amalan dan detail.
- Sitemap bisa diperbarui menyesuaikan amalan aktif.
- Jika diperlukan kategori lebih struktural, pertimbangkan tabel `kategori_amalan` terpisah.
