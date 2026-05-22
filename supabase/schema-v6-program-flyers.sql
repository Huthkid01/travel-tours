-- Program flyer images in Supabase Storage (run after schema-v2)
-- Admin uploads appear on the site via the `image` column (public URL or /programs/flyers/ path)
--
-- NOTE: This project uses `featured_programs` (schema-v2). The `programs` table is only
-- created if you also run schema-v3.sql — do not alter public.programs unless that table exists.

insert into storage.buckets (id, name, public)
values ('program-flyers', 'program-flyers', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read program flyers" on storage.objects;
create policy "Public read program flyers"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'program-flyers');

drop policy if exists "Service role upload program flyers" on storage.objects;
create policy "Service role upload program flyers"
  on storage.objects for insert to service_role
  with check (bucket_id = 'program-flyers');

drop policy if exists "Service role update program flyers" on storage.objects;
create policy "Service role update program flyers"
  on storage.objects for update to service_role
  using (bucket_id = 'program-flyers');

drop policy if exists "Service role delete program flyers" on storage.objects;
create policy "Service role delete program flyers"
  on storage.objects for delete to service_role
  using (bucket_id = 'program-flyers');

-- image_type on featured_programs (used by admin + site)
alter table public.featured_programs
  add column if not exists image_type text default 'flyer';

-- Add check constraint only when column was just added (safe re-run)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'featured_programs_image_type_check'
  ) then
    alter table public.featured_programs
      add constraint featured_programs_image_type_check
      check (image_type in ('flyer', 'photo'));
  end if;
end $$;

-- Optional: only if you ran schema-v3.sql and have public.programs
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'programs'
  ) then
    alter table public.programs
      add column if not exists image_type text default 'flyer';
    if not exists (
      select 1 from pg_constraint where conname = 'programs_image_type_check'
    ) then
      alter table public.programs
        add constraint programs_image_type_check
        check (image_type in ('flyer', 'photo'));
    end if;
  end if;
end $$;
