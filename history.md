# history.md — Riwayat Proyek TaskFlow

Catatan kronologis perubahan dan keputusan. **Entri terbaru di paling atas.**
Diperbarui oleh developer maupun AI agent setiap selesai satu pekerjaan (lihat `agent.md` bagian 10).

## Format Entri

```
## [YYYY-MM-DD] Judul singkat
- Fase/Item plan: Fase X — nama item
- Oleh: nama / agent
- Perubahan: apa yang dibuat/diubah
- File terdampak: daftar file
- Dependensi baru: (jika ada)
- Keputusan/asumsi: (jika ada)
- Verifikasi: lint ✅/❌ · test ✅/❌ · build ✅/❌ · preview Vercel ✅/❌
- Catatan/Masalah: (jika ada)
```

---

## Log Perubahan

## [2026-11-16] Menghubungkan repository ke GitHub
- Fase/Item plan: Fase 1 — commit awal dan push ke `main`
- Oleh: Copilot
- Perubahan: menginisialisasi Git, mengatur remote `origin` ke repository `test-pendataan-tugas`, dan menambahkan aturan agar file `.env` tidak terkirim
- File terdampak: `.gitignore`, `plan.md`, `history.md`
- Dependensi baru: —
- Keputusan/asumsi: pembaruan aplikasi akan masuk ke GitHub setelah di-commit dan di-push; CI berjalan otomatis untuk push ke `main` dan pull request
- Verifikasi: lint ✅ · test ✅ · build ✅ · GitHub push ✅
- Catatan/Masalah: `.env` lokal sengaja tidak dilacak; hanya `.env.example` yang disertakan. Branch lokal `main` melacak `origin/main`.

## [2026-11-16] Inisialisasi aplikasi TaskFlow dan validasi kode
- Fase/Item plan: Fase 1 — Inisialisasi proyek React
- Oleh: Copilot
- Perubahan: membangun arsitektur awal TaskFlow dengan router, autentikasi, dashboard tugas, komponen filter, ringkasan status, form tugas, validasi, serta konfigurasi CI dan Vercel
- File terdampak: `package.json`, `vite.config.js`, `.env.example`, `vercel.json`, `.github/workflows/ci.yml`, `src/App.jsx`, `src/index.css`, `src/features/auth/*`, `src/features/tasks/*`, `src/pages/*`, `src/test/*`, `README.md`
- Dependensi baru: `react-router-dom`, `@tanstack/react-query`, `@supabase/supabase-js`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@testing-library/user-event`
- Keputusan/asumsi:
  - Proyek dijalankan secara lokal dengan `localStorage` sebagai fallback karena tidak ada kredensial Supabase/Vercel yang tersedia di lingkungan saat ini
  - File `src/lib/supabaseClient.js` tetap disiapkan untuk koneksi nyata ke Supabase saat variabel `VITE_*` tersedia
  - Teks antarmuka memakai Bahasa Indonesia, sedangkan nama fungsi/variabel tetap Bahasa Inggris
- Verifikasi: lint ✅ · test ✅ · build ✅ · preview Vercel ❌ (belum dipublish karena tidak ada repo/akun Vercel aktif)
- Catatan/Masalah: Integrasi Supabase real belum dijalankan karena keterbatasan kredensial/pengaturan remote; fitur utama dashboard dan alur autentikasi sudah berjalan di lingkungan lokal.

---

## Keputusan Arsitektur (ADR Ringkas)

| ID | Tanggal | Keputusan | Alasan | Alternatif yang ditolak |
|---|---|---|---|---|
| ADR-001 | 2026-11-16 | Vite sebagai build tool React | Cepat, konfigurasi minim, didukung Vercel | Create React App (tidak lagi dipelihara), Next.js (lebih berat dari kebutuhan) |
| ADR-002 | 2026-11-16 | Supabase (Postgres + Auth + RLS) | Backend siap pakai, tidak perlu server sendiri | Firebase, backend Node sendiri |
| ADR-003 | 2026-11-16 | TanStack Query untuk data fetching | Cache, invalidasi, dan state loading/error bawaan | Redux, fetch manual dengan `useEffect` |
| ADR-004 | 2026-11-16 | Tailwind CSS | Pengembangan UI cepat dan konsisten | CSS Modules, library komponen berat |
| ADR-005 | 2026-11-16 | Deploy via integrasi Git Vercel | Preview per PR dan produksi otomatis tanpa konfigurasi tambahan | Deploy manual lewat CLI, workflow deploy kustom di Actions |

---

## Masalah Terbuka

| ID | Tanggal | Deskripsi | Status |
|---|---|---|---|
| — | — | Belum ada | — |

## Pertanyaan Terbuka

- Apakah verifikasi email Supabase diaktifkan sejak awal, atau dimatikan selama pengembangan lalu diaktifkan sebelum rilis?
- Apakah repository akan public atau private?
- Apakah nama proyek final tetap "TaskFlow"?

---

## Rilis

| Versi | Tanggal | Ringkasan |
|---|---|---|
| — | — | Belum ada rilis |
