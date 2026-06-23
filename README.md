# Cek MBTI Online - Desy Riyanti

Website ini sudah menggunakan penyimpanan online melalui Supabase. Akun peserta dan hasil MBTI tidak lagi disimpan di localStorage browser.

## File

- `index.html` halaman utama
- `style.css` tampilan website
- `app.js` fungsi login, admin, peserta, dan penyimpanan hasil
- `config.js` konfigurasi Supabase
- `supabase-schema.sql` struktur database dan fungsi Supabase
- `vercel.json` konfigurasi Vercel

## Langkah Supabase

1. Buat project di Supabase.
2. Buka menu **SQL Editor**.
3. Copy semua isi file `supabase-schema.sql`.
4. Klik **Run**.
5. Buka **Project Settings > API**.
6. Copy **Project URL** dan **anon public key**.
7. Masukkan ke file `config.js`.

```js
window.MBTI_CONFIG = {
  SUPABASE_URL: "https://xxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJ..."
};
```

## Akun Admin Awal

```text
Username: admin
Password: Admin123
```

Setelah admin login, admin dapat membuat akun peserta. Peserta hanya bisa mengerjakan tes setelah akun dibuat oleh admin.

## Upload ke GitHub dan Vercel

Upload semua file langsung ke root repository:

```text
repository/
├── index.html
├── style.css
├── app.js
├── config.js
├── supabase-schema.sql
├── vercel.json
└── README.md
```

Jangan upload foldernya sebagai folder tambahan. File `index.html` harus berada langsung di root repository.

## Catatan

Sesi login sementara disimpan di `sessionStorage` agar pengguna tetap login selama tab browser aktif. Data utama seperti akun dan hasil tes tersimpan online di Supabase.
