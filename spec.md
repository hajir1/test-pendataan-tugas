# spec.md — Spesifikasi TaskFlow

Versi: 1.0 · Tanggal: 16 November 2026 · Status: Draft siap dikerjakan

## 1. Tujuan

Menyediakan website sederhana, cepat, dan aman untuk **mencatat dan mengelola tugas harian**. Data tiap pengguna tersimpan di Supabase dan hanya dapat diakses oleh pemiliknya.

### Di Luar Cakupan (v1)

- Kolaborasi multi-pengguna / berbagi tugas
- Notifikasi email atau push
- Aplikasi mobile native
- Lampiran file
- Sub-tugas dan tugas berulang

## 2. Pengguna

Satu peran: **Pengguna terdaftar** (individu yang mengelola tugas pribadinya).

## 3. User Story

| ID | Sebagai pengguna, saya ingin... | Agar... |
|---|---|---|
| US-01 | mendaftar dengan email dan password | punya akun pribadi |
| US-02 | login dan logout | data saya aman |
| US-03 | menambah tugas (judul, deskripsi, prioritas, tenggat) | tugas tercatat |
| US-04 | melihat daftar tugas saya | tahu apa yang harus dikerjakan |
| US-05 | mengubah status tugas (Belum, Dikerjakan, Selesai) | progres terlacak |
| US-06 | mengedit dan menghapus tugas | data tetap akurat |
| US-07 | memfilter berdasarkan status dan prioritas | fokus pada yang penting |
| US-08 | mencari tugas berdasarkan judul | cepat menemukan tugas |
| US-09 | melihat tugas yang lewat tenggat ditandai jelas | tidak terlewat |
| US-10 | memakai aplikasi nyaman di HP maupun desktop | fleksibel |

## 4. Kebutuhan Fungsional

### 4.1 Autentikasi
- FR-A1: Registrasi dengan email + password (min. 8 karakter) via Supabase Auth.
- FR-A2: Login dan logout.
- FR-A3: Sesi dipertahankan setelah refresh halaman.
- FR-A4: Halaman dashboard hanya dapat diakses bila login; jika tidak, diarahkan ke `/login`.
- FR-A5: Pengguna yang sudah login membuka `/login` diarahkan ke `/`.

### 4.2 Manajemen Tugas
- FR-T1: Membuat tugas dengan field: `title` (wajib, maks. 120 karakter), `description` (opsional, maks. 1000), `priority` (rendah/sedang/tinggi, default sedang), `due_date` (opsional).
- FR-T2: Status tugas: `todo`, `in_progress`, `done`. Default `todo`.
- FR-T3: Mengubah status cepat dari kartu tugas (tanpa membuka form edit).
- FR-T4: Edit semua field tugas.
- FR-T5: Hapus tugas dengan dialog konfirmasi.
- FR-T6: Daftar diurutkan default: belum selesai dahulu, lalu tenggat terdekat, lalu terbaru dibuat.
- FR-T7: Filter berdasarkan status dan prioritas (dapat dikombinasikan).
- FR-T8: Pencarian berdasarkan judul (tidak peka huruf besar/kecil).
- FR-T9: Tugas yang `due_date`-nya sudah lewat dan belum `done` ditampilkan dengan penanda "Terlambat".
- FR-T10: Ringkasan di dashboard: jumlah tugas per status.

### 4.3 Umum
- FR-U1: Tampilan loading, error, dan kosong pada semua daftar data.
- FR-U2: Notifikasi singkat (toast) setelah aksi berhasil/gagal.
- FR-U3: Seluruh teks antarmuka dalam Bahasa Indonesia.

## 5. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| Performa | First load < 3 detik pada koneksi 4G; aksi CRUD terasa instan (optimistic update disarankan) |
| Keamanan | RLS aktif; hanya anon key di frontend; tidak ada secret di repository |
| Responsif | Nyaman mulai lebar 360 px |
| Aksesibilitas | Label form, navigasi keyboard, kontras WCAG AA |
| Browser | Chrome, Edge, Firefox, Safari versi terbaru |
| Ketersediaan | Mengikuti SLA Vercel dan Supabase |

## 6. Model Data

### 6.1 Tabel `tasks`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid, PK | default `gen_random_uuid()` |
| `user_id` | uuid, FK → `auth.users(id)` | pemilik, default `auth.uid()`, on delete cascade |
| `title` | text, not null | 1–120 karakter |
| `description` | text, null | maks. 1000 karakter |
| `status` | text, not null | `todo` / `in_progress` / `done`, default `todo` |
| `priority` | text, not null | `low` / `medium` / `high`, default `medium` |
| `due_date` | date, null | tenggat |
| `created_at` | timestamptz | default `now()` |
| `updated_at` | timestamptz | otomatis lewat trigger |

### 6.2 Migrasi SQL (`supabase/migrations/0001_init.sql`)

```sql
-- Tabel tugas
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
              references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 120),
  description text check (char_length(description) <= 1000),
  status      text not null default 'todo'
              check (status in ('todo', 'in_progress', 'done')),
  priority    text not null default 'medium'
              check (priority in ('low', 'medium', 'high')),
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index tasks_user_status_idx on public.tasks (user_id, status);
create index tasks_user_due_idx    on public.tasks (user_id, due_date);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.tasks enable row level security;

create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = user_id);

create policy "tasks_insert_own" on public.tasks
  for insert with check (auth.uid() = user_id);

create policy "tasks_update_own" on public.tasks
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "tasks_delete_own" on public.tasks
  for delete using (auth.uid() = user_id);
```

## 7. Halaman & Routing

| Path | Halaman | Akses |
|---|---|---|
| `/login` | Form login | Publik (redirect bila sudah login) |
| `/register` | Form registrasi | Publik (redirect bila sudah login) |
| `/` | Dashboard: ringkasan, filter, pencarian, daftar tugas, tombol tambah | Perlu login |
| `*` | Halaman 404 | Publik |

### Komponen Utama

- `ProtectedRoute` — pembungkus rute yang butuh login
- `TaskForm` — form tambah/edit (modal)
- `TaskCard` — kartu tugas dengan ubah status cepat, edit, hapus
- `TaskFilters` — filter status, prioritas, kolom cari
- `TaskSummary` — hitungan per status
- `ConfirmDialog`, `Toast`, `EmptyState`, `Spinner`

## 8. Variabel Lingkungan

`.env.example`:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=isi-dengan-anon-key
```

Variabel yang sama harus diisi di **Vercel → Project Settings → Environment Variables** (Production dan Preview).

## 9. Deploy & CI/CD

1. Kode di-push ke repository **GitHub**.
2. **GitHub Actions** (`.github/workflows/ci.yml`) menjalankan `npm ci`, `lint`, `test`, `build` pada setiap push dan PR.
3. **Vercel** terhubung ke repository:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Branch `main` → Production
   - Branch/PR lain → Preview
4. Konfigurasi Supabase Auth: tambahkan URL produksi dan URL preview Vercel ke **Site URL / Redirect URLs**.

## 10. Kriteria Penerimaan

- **AC-01** Pengguna baru dapat mendaftar, login, dan melihat dashboard kosong dengan `EmptyState`.
- **AC-02** Pengguna dapat membuat tugas dengan judul saja; prioritas default "Sedang", status default "Belum".
- **AC-03** Judul kosong atau > 120 karakter ditolak dengan pesan error yang jelas.
- **AC-04** Mengubah status dari kartu langsung tersimpan dan ringkasan ikut berubah.
- **AC-05** Pengguna A tidak dapat melihat, mengubah, atau menghapus tugas pengguna B (diverifikasi lewat uji RLS).
- **AC-06** Filter + pencarian bekerja bersamaan dan mengembalikan hasil yang benar.
- **AC-07** Tugas lewat tenggat dan belum selesai menampilkan penanda "Terlambat".
- **AC-08** Menghapus tugas meminta konfirmasi; setelah konfirmasi tugas hilang dari daftar.
- **AC-09** Refresh halaman tidak memutus sesi login.
- **AC-10** Push ke `main` memicu deploy produksi otomatis di Vercel; PR memicu preview.
- **AC-11** `npm run lint`, `test`, `build` lulus di CI.
- **AC-12** Tidak ditemukan secret di riwayat Git.

## 11. Rencana Pengujian

| Level | Cakupan | Alat |
|---|---|---|
| Unit | fungsi util (urutan, deteksi terlambat), validasi form | Vitest |
| Komponen | `TaskForm`, `TaskCard`, `TaskFilters`, `ProtectedRoute` | Testing Library |
| Integrasi | alur login → tambah → ubah status → hapus (Supabase di-mock) | Vitest |
| Keamanan | uji manual/SQL bahwa RLS memblokir akses lintas pengguna | Supabase SQL Editor |
| Manual | responsif 360 px, keyboard navigation, preview Vercel | Browser |

## 12. Risiko & Asumsi

- **Asumsi:** pengguna memakai verifikasi email default Supabase; bila dimatikan di tahap dev, aktifkan kembali sebelum produksi.
- **Risiko:** salah konfigurasi Redirect URL Supabase menyebabkan login gagal di preview/produksi → dicek di tahap deploy.
- **Risiko:** kebocoran key → hanya anon key di frontend, `.env*` di `.gitignore`.
- **Risiko:** batas paket gratis Supabase/Vercel → cukup untuk skala pribadi; pantau penggunaan.
