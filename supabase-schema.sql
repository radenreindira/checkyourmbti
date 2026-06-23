-- Jalankan file ini di Supabase SQL Editor.
-- Admin awal:
-- username: admin
-- password: Admin123

create extension if not exists pgcrypto;

create table if not exists public.mbti_accounts (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  full_name text not null,
  role text not null check (role in ('admin', 'participant')),
  password_salt text not null,
  password_hash text not null,
  created_by uuid references public.mbti_accounts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mbti_sessions (
  token uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.mbti_accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists public.mbti_results (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.mbti_accounts(id) on delete cascade,
  mbti_type text not null,
  scores jsonb not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.mbti_accounts enable row level security;
alter table public.mbti_sessions enable row level security;
alter table public.mbti_results enable row level security;

revoke all on public.mbti_accounts from anon, authenticated;
revoke all on public.mbti_sessions from anon, authenticated;
revoke all on public.mbti_results from anon, authenticated;

insert into public.mbti_accounts (username, full_name, role, password_salt, password_hash)
values ('admin', 'Admin', 'admin', 'DESY_RIYANTI_ADMIN_SALT_V1', '/QVhoCyuxV09qSp7tzPbOtbf6IgCnrTt7W/GDzGSiw8=')
on conflict (username) do nothing;

create or replace function public.mbti_get_salt(p_username text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare v_salt text;
begin
  select password_salt into v_salt
  from public.mbti_accounts
  where lower(username) = lower(p_username)
  limit 1;
  return v_salt;
end;
$$;

create or replace function public.mbti_login(p_username text, p_password_hash text)
returns table(token text, account_id uuid, username text, full_name text, role text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account public.mbti_accounts%rowtype;
  v_token uuid;
begin
  select * into v_account
  from public.mbti_accounts
  where lower(mbti_accounts.username) = lower(p_username)
    and mbti_accounts.password_hash = p_password_hash
  limit 1;

  if not found then
    return;
  end if;

  v_token := gen_random_uuid();
  insert into public.mbti_sessions(token, account_id, expires_at)
  values(v_token, v_account.id, now() + interval '12 hours');

  return query select v_token::text, v_account.id, v_account.username, v_account.full_name, v_account.role;
end;
$$;

create or replace function public.mbti_logout(p_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.mbti_sessions where token = p_token::uuid;
end;
$$;

create or replace function public.mbti_is_admin(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_admin_id uuid;
begin
  select a.id into v_admin_id
  from public.mbti_sessions s
  join public.mbti_accounts a on a.id = s.account_id
  where s.token = p_token::uuid
    and s.expires_at > now()
    and a.role = 'admin'
  limit 1;

  if v_admin_id is null then
    raise exception 'Unauthorized admin access';
  end if;
  return v_admin_id;
end;
$$;

create or replace function public.mbti_create_participant(
  p_admin_token text,
  p_username text,
  p_full_name text,
  p_password_salt text,
  p_password_hash text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid;
  v_new_id uuid;
begin
  v_admin_id := public.mbti_is_admin(p_admin_token);

  insert into public.mbti_accounts(username, full_name, role, password_salt, password_hash, created_by)
  values(lower(trim(p_username)), trim(p_full_name), 'participant', p_password_salt, p_password_hash, v_admin_id)
  returning id into v_new_id;

  return v_new_id;
end;
$$;

create or replace function public.mbti_list_participants(p_admin_token text)
returns table(account_id uuid, username text, full_name text, latest_type text, latest_result_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.mbti_is_admin(p_admin_token);

  return query
  select a.id, a.username, a.full_name, r.mbti_type, r.created_at
  from public.mbti_accounts a
  left join lateral (
    select mbti_type, created_at
    from public.mbti_results
    where account_id = a.id
    order by created_at desc
    limit 1
  ) r on true
  where a.role = 'participant'
  order by a.created_at desc;
end;
$$;

create or replace function public.mbti_reset_participant_password(
  p_admin_token text,
  p_account_id uuid,
  p_password_salt text,
  p_password_hash text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.mbti_is_admin(p_admin_token);
  update public.mbti_accounts
  set password_salt = p_password_salt,
      password_hash = p_password_hash,
      updated_at = now()
  where id = p_account_id and role = 'participant';
end;
$$;

create or replace function public.mbti_delete_participant(p_admin_token text, p_account_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.mbti_is_admin(p_admin_token);
  delete from public.mbti_accounts where id = p_account_id and role = 'participant';
end;
$$;

create or replace function public.mbti_save_result(p_token text, p_mbti_type text, p_scores jsonb, p_answers jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account_id uuid;
  v_result_id uuid;
begin
  select a.id into v_account_id
  from public.mbti_sessions s
  join public.mbti_accounts a on a.id = s.account_id
  where s.token = p_token::uuid
    and s.expires_at > now()
    and a.role = 'participant'
  limit 1;

  if v_account_id is null then
    raise exception 'Unauthorized participant access';
  end if;

  insert into public.mbti_results(account_id, mbti_type, scores, answers)
  values(v_account_id, p_mbti_type, p_scores, p_answers)
  returning id into v_result_id;

  return v_result_id;
end;
$$;

grant execute on function public.mbti_get_salt(text) to anon, authenticated;
grant execute on function public.mbti_login(text, text) to anon, authenticated;
grant execute on function public.mbti_logout(text) to anon, authenticated;
grant execute on function public.mbti_is_admin(text) to anon, authenticated;
grant execute on function public.mbti_create_participant(text, text, text, text, text) to anon, authenticated;
grant execute on function public.mbti_list_participants(text) to anon, authenticated;
grant execute on function public.mbti_reset_participant_password(text, uuid, text, text) to anon, authenticated;
grant execute on function public.mbti_delete_participant(text, uuid) to anon, authenticated;
grant execute on function public.mbti_save_result(text, text, jsonb, jsonb) to anon, authenticated;
