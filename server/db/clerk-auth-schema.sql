-- Mend Sure — moving patient accounts from Supabase Auth to Clerk
--
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query)
-- AFTER schema.sql, auth-schema.sql and schema-updates.sql.
--
-- Safe to run more than once.
--
-- WHAT CHANGES AND WHY
-- Sign-in, the emailed six-digit code, and the session all move to Clerk, so
-- `auth.users` stops being where a patient exists. A Clerk user id is a string
-- like `user_2abcDEF...`, not a uuid, so the three columns that identify a
-- patient have to change type and lose their foreign key to auth.users.
--
-- Nothing is lost by that here. At the time of writing the only accounts are
-- three test signups, no reports have ever been uploaded, and no enquiry is
-- linked to an account — see the cleanup section at the bottom.

-- ---------------------------------------------------------------------------
-- 1. Drop the trigger that created a profile at signup
-- ---------------------------------------------------------------------------
-- It fired on inserts into auth.users, which nothing writes to any more. The
-- API creates the profile row instead, on the first request it sees for an id
-- it doesn't recognise (server/src/routes/auth.js).
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. Re-key the three patient-owned tables to Clerk user ids
-- ---------------------------------------------------------------------------
-- The foreign keys go first: a uuid column cannot be widened to text while it
-- still references auth.users(id).
alter table profiles  drop constraint if exists profiles_id_fkey;
alter table reports   drop constraint if exists reports_user_id_fkey;
alter table inquiries drop constraint if exists inquiries_user_id_fkey;

-- `using id::text` keeps any existing rows readable rather than discarding
-- them. They belong to Supabase accounts that can no longer sign in, so they
-- are unreachable either way — the cast just means the migration never fails
-- on a non-empty table.
alter table profiles  alter column id      type text using id::text;
alter table reports   alter column user_id type text using user_id::text;
alter table inquiries alter column user_id type text using user_id::text;

-- reports and inquiries are filtered by owner on every read.
create index if not exists reports_user_idx   on reports (user_id);
create index if not exists inquiries_user_idx on inquiries (user_id);

-- ---------------------------------------------------------------------------
-- 3. Replace the row-level security policies
-- ---------------------------------------------------------------------------
-- The old policies compared each row against auth.uid(). That function reads
-- the Supabase JWT, and there is no longer a Supabase JWT — under Clerk it
-- returns null for everyone, so each policy would deny every row while
-- appearing to still protect the table. Dropping them says plainly that this
-- is not where the check happens any more.
--
-- Where it happens instead: the API verifies the Clerk session token
-- (server/src/middleware/requireAuth.js) and filters every query by the id in
-- it. RLS stays enabled with no policies, which is what schema.sql already
-- does for the public content tables — it denies anon and authenticated keys
-- outright, so the only way in is the service-role key the API holds.
drop policy if exists "Users can view their own profile"   on profiles;
drop policy if exists "Users can update their own profile" on profiles;
drop policy if exists "Users can view their own reports"   on reports;
drop policy if exists "Users can insert their own reports" on reports;
drop policy if exists "Users can delete their own reports" on reports;

alter table profiles enable row level security;
alter table reports  enable row level security;

-- Same reasoning for the report files themselves. The bucket stays private and
-- every download goes through a short-lived signed URL the API mints after
-- checking the row belongs to the caller.
drop policy if exists "Users can upload their own reports"    on storage.objects;
drop policy if exists "Users can view their own report files" on storage.objects;
drop policy if exists "Users can delete their own report files" on storage.objects;

-- ---------------------------------------------------------------------------
-- 4. Clearing out the Supabase-era accounts
-- ---------------------------------------------------------------------------
-- These rows are keyed by Supabase uuids. Nobody can ever sign in as them
-- again — a patient who signs up with the same email gets a fresh Clerk id and
-- a fresh profile row — so they are dead weight rather than history worth
-- keeping. Uncomment to clear them.
--
--   delete from profiles where id not like 'user\_%';
--   update inquiries set user_id = null where user_id not like 'user\_%';
--
-- The accounts themselves live in Supabase's auth.users table and are deleted
-- from Dashboard -> Authentication -> Users.
