# agent.md — Panduan untuk AI Coding Agent

Dokumen ini adalah aturan kerja bagi AI agent (Claude Code, Cursor, Copilot, dll.) yang mengerjakan proyek **TaskFlow** (website pencatatan tugas). Baca file ini **sebelum** menulis kode apa pun.

## 1. Ringkasan Proyek

TaskFlow adalah aplikasi web untuk mencatat dan mengelola tugas pribadi. Pengguna login, membuat tugas, mengubah status, mengatur prioritas dan tenggat, serta memfilter/mencari tugas.

- Frontend: **React.js** (Vite, JavaScript/JSX)
- Backend/Database: **Supabase** (PostgreSQL + Auth + Row Level Security)
- Repository: **GitHub**
- Hosting & deploy otomatis: **Vercel** (terhubung ke GitHub)
- CI: **GitHub Actions** (lint, test, build)

## 2. Urutan Membaca Dokumen

1. `agent.md` (file ini) — aturan kerja
2. `spec.md` — apa yang dibangun (kebutuhan, data model, kriteria penerimaan)
3. `plan.md` — urutan pengerjaan dan status tiap tahap
4. `history.md` — catatan perubahan; **update setiap selesai satu pekerjaan**

Jika ada konflik antar dokumen: `spec.md` menang untuk soal *apa*, `plan.md` menang untuk soal *kapan/urutan*.

## 3. Tech Stack & Versi

| Kebutuhan | Pilihan |
|---|---|
| Build tool | Vite |
| UI | React 18+ (function component + hooks) |
| Routing | React Router |
| Data fetching/cache | TanStack Query (`@tanstack/react-query`) |
| Styling | Tailwind CSS |
| Supabase client | `@supabase/supabase-js` |
| Test | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |
| Package manager | npm |

Jangan menambah dependensi besar tanpa alasan jelas. Catat setiap dependensi baru di `history.md`.

## 4. Struktur Folder

```
taskflow/
├─ .github/workflows/ci.yml
├─ public/
├─ supabase/
│  └─ migrations/            # file SQL bernomor, mis. 0001_init.sql
├─ src/
│  ├─ components/            # komponen UI reusable (Button, Modal, TaskCard)
│  ├─ features/
│  │  ├─ auth/               # LoginForm, useAuth, ProtectedRoute
│  │  └─ tasks/              # TaskList, TaskForm, useTasks, tasksApi
│  ├─ lib/
│  │  └─ supabaseClient.js   # satu-satunya tempat createClient()
│  ├─ pages/                 # LoginPage, RegisterPage, DashboardPage, NotFoundPage
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ .env.example
├─ agent.md  spec.md  plan.md  history.md
├─ package.json
└─ vite.config.js
```

## 5. Perintah Penting

```bash
npm install          # pasang dependensi
npm run dev          # jalankan dev server
npm run lint         # cek ESLint
npm run test         # jalankan Vitest
npm run build        # build produksi (output: dist/)
npm run preview      # preview hasil build
```

Sebelum menyatakan pekerjaan selesai, **`npm run lint`, `npm run test`, dan `npm run build` harus lulus**.

## 6. Aturan Kode

- Gunakan **function component** dan hooks. Tidak memakai class component.
- Satu komponen satu file; nama file komponen `PascalCase.jsx`, hook `useCamelCase.js`.
- Semua akses ke Supabase lewat layer `*Api.js` di dalam `features/<nama>/`. Komponen UI tidak memanggil `supabase.from(...)` langsung.
- Gunakan TanStack Query untuk read/mutasi data; invalidasi query setelah mutasi.
- Tangani tiga state di setiap layar data: **loading**, **error**, **kosong**.
- Form: validasi di sisi klien (judul wajib, panjang maksimal) dan tampilkan pesan error yang jelas dalam Bahasa Indonesia.
- Teks antarmuka memakai **Bahasa Indonesia**. Nama variabel, fungsi, dan komentar kode memakai **Bahasa Inggris**.
- Aksesibilitas dasar: label pada input, tombol dapat diakses keyboard, kontras warna memadai.
- Hindari komentar yang hanya mengulang kode; komentari *alasan*, bukan *apa*.

## 7. Aturan Supabase & Keamanan

- **Row Level Security (RLS) wajib aktif** pada semua tabel. Tidak ada tabel tanpa policy.
- Frontend hanya memakai **anon key**. **`service_role` key tidak boleh** masuk ke kode frontend, repository, atau variabel `VITE_*`.
- Perubahan skema dilakukan lewat file migrasi di `supabase/migrations/` (bernomor berurutan), bukan edit manual tanpa jejak.
- Variabel lingkungan:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- File `.env.local` **tidak boleh di-commit**. Selalu perbarui `.env.example` (tanpa nilai rahasia).
- Jangan log token, email pengguna, atau data sensitif ke console pada kode produksi.

## 8. Git, Branch, dan Deploy Otomatis

**Alur:**

1. Kerjakan di branch fitur: `feat/<nama>`, `fix/<nama>`, `chore/<nama>`.
2. Buka Pull Request ke `main`.
3. GitHub Actions menjalankan lint, test, build.
4. Vercel otomatis membuat **Preview Deployment** untuk tiap PR.
5. Setelah merge ke `main`, Vercel otomatis melakukan **Production Deployment**.

**Konvensi commit** (Conventional Commits):

```
feat: tambah filter status tugas
fix: perbaiki redirect setelah login
chore: update dependensi
docs: perbarui plan.md
test: tambah test TaskForm
```

**Larangan:**
- Jangan push langsung ke `main` (kecuali setup awal).
- Jangan commit `.env*` yang berisi nilai asli, `node_modules/`, atau `dist/`.
- Jangan menonaktifkan CI agar build "hijau".

## 9. SPA Routing di Vercel

Karena aplikasi adalah SPA (React Router), pastikan `vercel.json` ada:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 10. Cara Kerja Agent (Workflow)

Untuk setiap tugas:

1. Baca bagian terkait di `spec.md` dan item di `plan.md`.
2. Jika kebutuhan ambigu, **tanyakan dulu** atau catat asumsi di `history.md`; jangan menebak diam-diam.
3. Kerjakan perubahan sekecil dan sefokus mungkin.
4. Tambahkan/ubah test untuk perilaku yang berubah.
5. Jalankan `lint`, `test`, `build`.
6. Centang item di `plan.md` dan tambahkan entri di `history.md`.
7. Ringkas hasil: apa yang diubah, file yang terdampak, dan cara memverifikasi.

## 11. Definition of Done

Sebuah item dianggap selesai bila:

- [ ] Sesuai kriteria penerimaan di `spec.md`
- [ ] Lint, test, dan build lulus lokal dan di CI
- [ ] Tidak ada secret yang ter-commit
- [ ] RLS/policy tetap benar bila menyentuh database
- [ ] Tampilan loading/error/kosong sudah ditangani
- [ ] `plan.md` dan `history.md` sudah diperbarui
- [ ] Preview Vercel dapat dibuka dan fitur berjalan

## 12. Hal yang Tidak Boleh Dilakukan Agent

- Mengubah atau menghapus policy RLS agar "lebih mudah" tanpa persetujuan.
- Menyimpan password atau token di `localStorage` secara manual (biarkan Supabase Auth mengelola sesi).
- Menghapus test yang gagal tanpa memperbaiki penyebabnya.
- Mengubah struktur data di `spec.md` tanpa mencatatnya di `history.md`.
