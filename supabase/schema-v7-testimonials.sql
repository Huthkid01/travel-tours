-- Testimonials (homepage "What Our Clients Say") — run after schema-v2.sql

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  avatar text not null,
  rating int not null default 5 check (rating >= 1 and rating <= 5),
  text text not null,
  service text not null default '',
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_active_sort_idx on public.testimonials (active, sort_order);

alter table public.testimonials enable row level security;

drop policy if exists "Public read active testimonials" on public.testimonials;
create policy "Public read active testimonials"
  on public.testimonials for select to anon, authenticated
  using (active = true);
