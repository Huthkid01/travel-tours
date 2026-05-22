-- Services table (run after schema.sql + schema-v2.sql)
-- Makes all services editable from /admin/services

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null,
  description text not null,
  requirements jsonb not null default '[]'::jsonb,
  pricing_deposit numeric not null default 0,
  pricing_full numeric not null default 0,
  pricing_booking_fee numeric not null default 0,
  category text not null default 'documentation'
    check (category in ('documentation', 'travel', 'legal', 'certification', 'booking')),
  icon text not null default 'FileText',
  processing_time text not null default '5–10 business days',
  featured boolean not null default false,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_status_sort_idx on public.services (status, sort_order);
create index if not exists services_slug_idx on public.services (slug);

alter table public.services enable row level security;

create policy "Public read active services"
  on public.services for select to anon, authenticated
  using (status = 'active');
