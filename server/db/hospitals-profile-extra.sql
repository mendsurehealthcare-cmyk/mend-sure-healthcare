-- Mend Sure — hospital type, ownership, and ICU capacity
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- Safe to run more than once.
--
-- Adds three more trust-building facts to the hospital detail page, on top
-- of what hospitals-trust-details.sql already added (address/established_year/
-- timings): what kind of facility it is, who runs it, and its ICU capacity
-- alongside the existing bed_count.
alter table hospitals add column if not exists hospital_type text;
alter table hospitals add column if not exists ownership text;
alter table hospitals add column if not exists icu_beds integer;
