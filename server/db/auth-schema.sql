-- Mend Sure — patient accounts & report uploads
-- Run this AFTER schema.sql, in the Supabase SQL editor.
--
-- Unlike the public content tables in schema.sql (which rely entirely on
-- the API server's service-role key and use RLS-enabled-with-no-policies),
-- these two tables hold real personal health data, so they get actual RLS
-- policies scoped to auth.uid() as defense in depth.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  note text,
  uploaded_at timestamptz not null default now()
);

-- Auto-create a profile row the moment someone signs up, so signup only
-- ever needs an email + password — name/phone/country get filled in later.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table profiles enable row level security;
alter table reports enable row level security;

drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can view their own reports" on reports;
create policy "Users can view their own reports"
  on reports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own reports" on reports;
create policy "Users can insert their own reports"
  on reports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own reports" on reports;
create policy "Users can delete their own reports"
  on reports for delete
  using (auth.uid() = user_id);

-- Private storage bucket for the actual report files. Not public — every
-- file is fetched through a short-lived signed URL from the API server.
insert into storage.buckets (id, name, public)
values ('patient-reports', 'patient-reports', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload their own reports" on storage.objects;
create policy "Users can upload their own reports"
  on storage.objects for insert
  with check (bucket_id = 'patient-reports' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can view their own report files" on storage.objects;
create policy "Users can view their own report files"
  on storage.objects for select
  using (bucket_id = 'patient-reports' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete their own report files" on storage.objects;
create policy "Users can delete their own report files"
  on storage.objects for delete
  using (bucket_id = 'patient-reports' and (storage.foldername(name))[1] = auth.uid()::text);
