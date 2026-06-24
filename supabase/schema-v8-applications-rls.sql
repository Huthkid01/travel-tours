-- Tighten applications + documents RLS (run in Supabase SQL Editor after schema.sql)
-- Server routes use SUPABASE_SERVICE_ROLE_KEY and bypass RLS.

-- Applications: allow anonymous insert only (no public read/update)
drop policy if exists "Allow public update applications" on public.applications;
drop policy if exists "Allow public select applications" on public.applications;

-- Storage: allow upload only; reads via signed URLs from service role
drop policy if exists "Allow public read documents" on storage.objects;
