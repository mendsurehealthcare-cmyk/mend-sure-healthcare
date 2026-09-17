-- Mend Sure — store the patient's email on their profile row
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- Safe to run more than once.
--
-- Previously the email lived only in Clerk and was never copied into
-- Supabase, which made a profile row unidentifiable by anything but its
-- Clerk id when browsing the table directly. This adds a copy that the API
-- keeps in sync on every login (see server/src/routes/auth.js), so it can't
-- go stale the way a one-time copy would.
alter table profiles add column if not exists email text;

create index if not exists profiles_email_idx on profiles (email);
