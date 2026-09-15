-- Extra columns for the redesigned doctor profile page: education, awards,
-- and a consultation fee, none of which the directory currently carries.
--
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New
-- query), after doctors-schema.sql. Safe to run more than once.

-- Qualifications, in display order ("MBBS", "MD (Medicine)", "DNB",
-- "DM (Cardiology)"). Rendered as a single comma-joined line on the profile.
alter table doctors add column if not exists education text[];

-- Awards and accolades, one entry per honour. Rendered as a list with a
-- "Read more" toggle once it runs past a few lines.
alter table doctors add column if not exists awards text[];

-- The in-person consultation fee, in INR. Nullable — the profile only shows
-- a Fees stat card when this is set, rather than implying every doctor has
-- the same fee or none at all.
alter table doctors add column if not exists consultation_fee numeric;

-- Previous positions/roles, one entry per line ("Consultant Interventional
-- Cardiologist, Escorts Heart Institute, New Delhi"). Several of the fuller
-- doctor profiles supplied carry a career history distinct from the awards
-- and the current designation.
alter table doctors add column if not exists career_history text[];

-- Academic publications, one citation per entry. Same list-with-toggle
-- treatment as awards.
alter table doctors add column if not exists publications text[];
