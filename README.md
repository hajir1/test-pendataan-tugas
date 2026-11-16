# TaskFlow

TaskFlow adalah aplikasi web sederhana untuk mencatat, mengelola, dan memantau tugas harian secara pribadi. Aplikasi ini dibuat dengan React + Vite, memiliki router berbasis halaman, autentikasi lokal untuk pengembangan, serta dashboard tugas dengan filter, pencarian, status, dan ringkasan.

## Fitur utama

- Login dan registrasi akun pengguna
- Dashboard tugas dengan ringkasan per status
- Tambah, edit, hapus, dan ubah status tugas cepat
- Filter berdasarkan status dan prioritas
- Pencarian berdasarkan judul/deskripsi
- Penanda tugas terlambat berdasarkan tenggat
- Tampilan loading, error, dan kosong

## Persiapan lokal

1. Install dependensi:
   npm install
2. Salin contoh variabel lingkungan:
   copy .env.example .env.local
3. Jalankan dev server:
   npm run dev

## Variabel lingkungan

File `.env.example` berisi:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=isi-dengan-anon-key
```

Pada lingkungan lokal, aplikasi menggunakan fallback lokal untuk pengalaman kerja tanpa kredensial Supabase. Struktur client Supabase sudah disiapkan di `src/lib/supabaseClient.js` agar siap dihubungkan ke proyek Supabase nyata.

## Script yang tersedia

```bash
npm run dev
npm run build
npm run lint
npm run test
```

## Catatan deployment

File `vercel.json` sudah disiapkan agar routing SPA bekerja pada Vercel. Untuk deployment aktual, isi variabel `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di project settings Vercel.
