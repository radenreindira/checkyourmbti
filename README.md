# Cek MBTI Online - Supabase Fix Admin Login

Website Cek MBTI dengan login satu jalur, panel admin, akun peserta, dan penyimpanan hasil online menggunakan Supabase.

## Akun Admin Awal

Username: `admin`  
Password: `Admin123`

## Cara Setup Supabase

1. Buat project baru di Supabase.
2. Buka menu **SQL Editor**.
3. Jalankan isi file `supabase-schema.sql`.
4. Buka **Project Settings > API**.
5. Copy **Project URL** dan **anon public key**.
6. Masukkan ke file `config.js`.

Contoh:

```js
window.MBTI_CONFIG = {
  SUPABASE_URL: "https://xxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJ..."
};
```

## Jika Admin Tidak Bisa Login

Jalankan file `admin-fix.sql` di **Supabase > SQL Editor**, lalu login ulang dengan:

Username: `admin`  
Password: `Admin123`

## Upload ke GitHub/Vercel

Pastikan file berada langsung di root repository:

```text
repository/
├── index.html
├── style.css
├── app.js
├── config.js
├── supabase-schema.sql
├── admin-fix.sql
├── vercel.json
└── README.md
```

Jangan upload folder pembungkusnya. Upload isi folder langsung ke repository.
