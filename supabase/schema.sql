-- Da Boi Consults Limited — Supabase schema
-- Run in Supabase SQL Editor after creating your project

-- Applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  country text not null,
  address text not null,
  purpose text not null,
  notes text,
  uploaded_files jsonb default '[]'::jsonb,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  payment_reference text,
  payment_type text,
  payment_amount numeric,
  payment_provider text,
  created_at timestamptz not null default now()
);

create index if not exists applications_created_at_idx on public.applications (created_at desc);
create index if not exists applications_service_name_idx on public.applications (service_name);
create index if not exists applications_payment_reference_idx on public.applications (payment_reference);

alter table public.applications enable row level security;

-- Allow anonymous inserts (portal submissions)
create policy "Allow public insert applications"
  on public.applications for insert
  to anon, authenticated
  with check (true);

-- Allow anonymous update by id (payment completion)
create policy "Allow public update applications"
  on public.applications for update
  to anon, authenticated
  using (true)
  with check (true);

-- Allow public read own row by id (optional, for success page)
create policy "Allow public select applications"
  on public.applications for select
  to anon, authenticated
  using (true);

-- Storage bucket: documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Storage policies
create policy "Allow public upload documents"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'documents');

create policy "Allow public read documents"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'documents');

-- v2 tables: also run schema-v2.sql for featured_programs, announcements, visitor_activity
-- v3 services: also run schema-v3-services.sql for editable services in admin
