-- Jalankan file ini di Supabase SQL Editor jika admin tidak bisa login.
-- Setelah dijalankan, login kembali dengan:
-- Username: admin
-- Password: Admin123

create extension if not exists pgcrypto;

insert into public.mbti_accounts (username, full_name, role, password_salt, password_hash)
values ('admin', 'Admin', 'admin', 'DESY_RIYANTI_ADMIN_SALT_V1', '/QVhoCyuxV09qSp7tzPbOtbf6IgCnrTt7W/GDzGSiw8=')
on conflict (username) do update
set full_name = excluded.full_name,
    role = excluded.role,
    password_salt = excluded.password_salt,
    password_hash = excluded.password_hash,
    updated_at = now();
