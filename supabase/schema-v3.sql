-- Da Boi Consults — Schema v3
-- Run after schema.sql and schema-v2.sql (or standalone for new projects)

-- Programs (replaces / complements featured_programs)
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  image text not null,
  optional_price numeric,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  cta_link text not null default '/consultation',
  badge text,
  date date default current_date,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Announcements (if not exists from v2)
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  type text not null default 'notice' check (type in ('promo', 'service', 'notice')),
  link text,
  active boolean not null default true,
  sort_order int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

-- Site events (analytics)
create table if not exists public.site_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  page text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Lead capture
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  interest text not null,
  created_at timestamptz not null default now()
);

-- Social links (admin-editable)
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text unique not null,
  url text not null,
  handle text,
  active boolean not null default true,
  sort_order int not null default 0
);

create index if not exists site_events_created_at_idx on public.site_events (created_at desc);
create index if not exists site_events_type_idx on public.site_events (event_type);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists programs_status_idx on public.programs (status, sort_order);

alter table public.programs enable row level security;
alter table public.announcements enable row level security;
alter table public.site_events enable row level security;
alter table public.leads enable row level security;
alter table public.social_links enable row level security;

create policy "Public read active programs" on public.programs for select to anon, authenticated using (status = 'active');
create policy "Public read active announcements" on public.announcements for select to anon, authenticated using (active = true);
create policy "Public insert site_events" on public.site_events for insert to anon, authenticated with check (true);
create policy "Public insert leads" on public.leads for insert to anon, authenticated with check (true);
create policy "Public read social_links" on public.social_links for select to anon, authenticated using (active = true);

insert into public.social_links (platform, url, handle, sort_order) values
  ('instagram', 'https://instagram.com', '@daboi_consults', 1),
  ('tiktok', 'https://tiktok.com', '@daboi_consults', 2),
  ('whatsapp', 'https://wa.me', null, 3),
  ('facebook', 'https://facebook.com', null, 4)
on conflict (platform) do nothing;
