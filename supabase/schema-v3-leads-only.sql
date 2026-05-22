-- Lead popup table only (if you skipped full schema-v3.sql)
-- Run in Supabase → SQL Editor

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  interest text not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

create policy "Public insert leads"
  on public.leads for insert to anon, authenticated
  with check (true);
