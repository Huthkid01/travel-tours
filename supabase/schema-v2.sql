-- Da Boi Consults — Schema v2 (run after schema.sql)

-- Featured programs (admin-editable via Supabase Table Editor)
create table if not exists public.featured_programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  image text not null,
  optional_price numeric,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  cta_link text not null default '/consultation',
  badge text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Announcements
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

-- Visitor activity / lead tracking
create table if not exists public.visitor_activity (
  id uuid primary key default gen_random_uuid(),
  action_type text not null,
  service text,
  source text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists visitor_activity_created_at_idx on public.visitor_activity (created_at desc);
create index if not exists visitor_activity_action_idx on public.visitor_activity (action_type);
create index if not exists featured_programs_status_idx on public.featured_programs (status, sort_order);
create index if not exists announcements_active_idx on public.announcements (active, sort_order);

alter table public.featured_programs enable row level security;
alter table public.announcements enable row level security;
alter table public.visitor_activity enable row level security;

create policy "Public read active programs"
  on public.featured_programs for select to anon, authenticated
  using (status = 'active');

create policy "Public read active announcements"
  on public.announcements for select to anon, authenticated
  using (active = true);

create policy "Public insert visitor activity"
  on public.visitor_activity for insert to anon, authenticated
  with check (true);

-- Seed sample programs (optional)
insert into public.featured_programs (slug, title, description, image, optional_price, status, cta_link, badge, sort_order)
values
  ('dubai-flex-package', 'Dubai Flex Package', 'Flexible Dubai travel documentation bundle.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', 850000, 'active', '/consultation?program=dubai-flex-package', 'Popular', 1),
  ('canada-travel-program', 'Canada Travel Program', 'Complete Canada travel consultation package.', 'https://images.unsplash.com/photo-1519832979-6fa567a88e4a?w=800&q=80', 1200000, 'active', '/consultation?program=canada-travel-program', 'New', 2)
on conflict (slug) do nothing;
