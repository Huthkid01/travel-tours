-- Contact form submissions (run after schema-v3.sql)
-- Counted on admin dashboard with applications + leads

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

create policy "Public insert contact_submissions"
  on public.contact_submissions for insert to anon, authenticated
  with check (true);
