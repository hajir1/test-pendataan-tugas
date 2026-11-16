# plan.md — Rencana Pengerjaan TaskFlow

Centang `[x]` setiap item yang selesai, lalu catat di `history.md`. Kerjakan berurutan; tiap fase berakhir dengan **checkpoint** yang harus lulus.

Legenda status fase: ⬜ belum · 🟡 berjalan · ✅ selesai

---

## Fase 0 — Persiapan Akun & Repository ⬜

- [ ] Buat repository GitHub `taskflow` (private/public sesuai kebutuhan)
- [ ] Buat project Supabase baru; catat **Project URL** dan **anon key**
- [ ] Buat akun/proyek Vercel dan hubungkan ke akun GitHub
- [ ] Install Node.js LTS dan Git di komputer lokal

**Checkpoint:** repository kosong tersedia, proyek Supabase aktif, Vercel terhubung ke GitHub.

---

## Fase 1 — Inisialisasi Proyek React ✅

- [x] `npm create vite@latest taskflow -- --template react`
- [x] Pasang dependensi: `react-router-dom`, `@tanstack/react-query`, `@supabase/supabase-js`
- [x] Pasang dev dependensi: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `eslint`
- [x] Konfigurasi Vitest (environment `jsdom`), ESLint, dan build Vite
- [x] Tambah script `lint`, `test`, `build` di `package.json`
- [x] Buat struktur folder sesuai `agent.md`
- [x] Buat `.gitignore` (termasuk `.env*`, `node_modules`, `dist`) dan `.env.example`
- [x] Buat `vercel.json` untuk SPA rewrite
- [x] Salin `agent.md`, `spec.md`, `plan.md`, `history.md` ke root repo
- [x] Commit awal dan push ke `main`

**Checkpoint:** `npm run dev` menampilkan halaman awal; `lint`, `test`, `build` berjalan.

---

## Fase 2 — Database Supabase ⬜

- [ ] Buat `supabase/migrations/0001_init.sql` dari `spec.md` bagian 6.2
- [ ] Jalankan SQL di Supabase SQL Editor (atau via Supabase CLI)
- [ ] Verifikasi tabel `tasks`, indeks, trigger, dan **RLS aktif**
- [ ] Uji RLS dengan dua akun berbeda (akun A tidak bisa membaca data akun B)
- [ ] Atur Auth: Site URL = `http://localhost:5173` untuk sementara
- [ ] Buat `src/lib/supabaseClient.js` memakai `import.meta.env.VITE_*`
- [ ] Buat `.env.local` berisi nilai asli (tidak di-commit)

**Checkpoint:** query `select` dari klien berjalan dan hanya mengembalikan data milik pengguna login.

---

## Fase 3 — Autentikasi ⬜

- [ ] `AuthProvider` + hook `useAuth` (session, user, loading)
- [ ] `LoginPage` dan `RegisterPage` dengan validasi form
- [ ] `ProtectedRoute` dan pengaturan routing di `App.jsx`
- [ ] Tombol logout dan tampilan email pengguna di header
- [ ] Redirect: sudah login → `/`; belum login → `/login`
- [ ] Test: `ProtectedRoute`, validasi form login/registrasi

**Checkpoint:** AC-01 dan AC-09 terpenuhi.

---

## Fase 4 — Fitur Inti Tugas (CRUD) ⬜

- [ ] `tasksApi.js`: `listTasks`, `createTask`, `updateTask`, `deleteTask`
- [ ] Hook TanStack Query: `useTasks`, `useCreateTask`, `useUpdateTask`, `useDeleteTask`
- [ ] `TaskForm` (modal tambah/edit) dengan validasi (AC-03)
- [ ] `TaskCard` dengan ubah status cepat (AC-04)
- [ ] `ConfirmDialog` untuk hapus (AC-08)
- [ ] `Toast` untuk umpan balik sukses/gagal
- [ ] `EmptyState`, `Spinner`, dan tampilan error
- [ ] Urutan default daftar sesuai FR-T6
- [ ] Test: `TaskForm`, `TaskCard`, util pengurutan

**Checkpoint:** AC-02, AC-03, AC-04, AC-08 terpenuhi.

---

## Fase 5 — Filter, Pencarian, Ringkasan ⬜

- [ ] `TaskFilters`: status, prioritas, kolom cari (debounce ±300 ms)
- [ ] Logika filter + pencarian dikombinasikan (AC-06)
- [ ] Penanda "Terlambat" (AC-07) lewat util `isOverdue`
- [ ] `TaskSummary`: jumlah per status
- [ ] Test: util filter, `isOverdue`, `TaskFilters`

**Checkpoint:** AC-06 dan AC-07 terpenuhi.

---

## Fase 6 — Polesan UI/UX & Aksesibilitas ⬜

- [ ] Layout responsif mulai 360 px (AC-10 spec bagian 5)
- [ ] Label form, `aria-*`, fokus terlihat, navigasi keyboard
- [ ] Cek kontras warna (WCAG AA)
- [ ] Halaman 404
- [ ] Optimistic update untuk ubah status (opsional, disarankan)
- [ ] Favicon, judul halaman, meta deskripsi

**Checkpoint:** audit Lighthouse (Accessibility ≥ 90) dan uji manual di HP.

---

## Fase 7 — CI dengan GitHub Actions ⬜

- [ ] Buat `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --run
      - run: npm run build
        env:
          VITE_SUPABASE_URL: https://placeholder.supabase.co
          VITE_SUPABASE_ANON_KEY: placeholder-anon-key
```

- [ ] Aktifkan **branch protection** di `main`: wajib PR dan CI lulus
- [ ] Pastikan CI hijau pada PR percobaan

**Checkpoint:** AC-11 terpenuhi.

---

## Fase 8 — Deploy Otomatis ke Vercel ⬜

- [ ] Import repository GitHub di Vercel; preset **Vite**
- [ ] Isi Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) untuk **Production** dan **Preview**
- [ ] Deploy pertama dari `main`; catat URL produksi
- [ ] Di Supabase Auth, tambahkan URL produksi dan pola URL preview Vercel (mis. `https://*-<tim>.vercel.app`) ke Redirect URLs, lalu ubah Site URL ke URL produksi
- [ ] Buat PR percobaan → pastikan **Preview Deployment** muncul dan login berjalan
- [ ] Merge PR → pastikan **Production Deployment** otomatis berjalan (AC-10)
- [ ] Uji alur lengkap di URL produksi

**Checkpoint:** AC-05, AC-10, AC-12 terpenuhi di lingkungan produksi.

---

## Fase 9 — Rilis & Dokumentasi ⬜

- [ ] Tulis `README.md`: deskripsi, cara menjalankan lokal, variabel lingkungan, alur deploy
- [ ] Periksa seluruh Kriteria Penerimaan AC-01 s.d. AC-12 di `spec.md`
- [ ] Pindai riwayat Git untuk secret yang tak sengaja ter-commit
- [ ] Beri tag rilis `v1.0.0` di GitHub
- [ ] Catat rilis di `history.md`

**Checkpoint:** v1.0.0 live di produksi.

---

## Ide Pengembangan Berikutnya (Backlog v1.1+)

- Kategori/label dan proyek
- Tampilan papan Kanban (drag & drop)
- Mode gelap
- Pengingat email via Supabase Edge Functions
- Tugas berulang dan sub-tugas
- Ekspor data ke CSV
- Login dengan Google (OAuth)

---

## Ringkasan Progres

| Fase | Nama | Status |
|---|---|---|
| 0 | Persiapan akun & repository | ⬜ |
| 1 | Inisialisasi proyek React | ✅ |
| 2 | Database Supabase | ⬜ |
| 3 | Autentikasi | ⬜ |
| 4 | CRUD tugas | ⬜ |
| 5 | Filter, pencarian, ringkasan | ⬜ |
| 6 | Polesan UI/UX & aksesibilitas | ⬜ |
| 7 | CI GitHub Actions | ⬜ |
| 8 | Deploy otomatis Vercel | ⬜ |
| 9 | Rilis & dokumentasi | ⬜ |
