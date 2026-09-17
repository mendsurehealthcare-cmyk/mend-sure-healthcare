-- Mend Sure — admin dashboard access
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query),
-- after clerk-auth-schema.sql. Safe to run more than once.
--
-- Adds a role to the existing `profiles` table (already keyed by Clerk user
-- id — see clerk-auth-schema.sql). Every existing row defaults to 'patient',
-- so nothing about current patient accounts changes.
--
-- To make your own account an admin: log in to the site once (so your
-- profile row exists), then in Supabase Studio -> Table Editor -> profiles,
-- find your row and set role to 'admin'. If you're not sure which row is
-- yours, sort by created_at — a fresh project will only have a handful of
-- rows.
alter table profiles add column if not exists role text not null default 'patient';

-- Belt-and-braces: only two roles are meaningful today. Trying to set
-- anything else will fail loudly instead of silently creating a typo'd role
-- nothing checks for.
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check check (role in ('patient', 'admin'));
