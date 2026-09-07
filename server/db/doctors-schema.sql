-- Extra columns for the real doctor directory.
--
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New
-- query), then load the directory with:  npm run load:doctors
--
-- Safe to run more than once.

-- The doctor's job title at the hospital ("Principal Director", "Chairman").
-- Kept separate from `specialty`, which is the care category patients browse by.
alter table doctors add column if not exists designation text;

-- The clinical department ("Interventional Cardiology", "Bone Marrow
-- Transplant - Adult"). More precise than the specialty category.
alter table doctors add column if not exists department text;

-- The hospital exactly as supplied in the directory.
--
-- `hospital_id` is a foreign key and can only point at hospitals we actually
-- list, but several doctors practise at facilities outside that set (SSB
-- Faridabad, Sanar International, Fortis Shalimar Bagh, and others). Storing
-- the name as text as well means no doctor loses their affiliation just
-- because we don't have a page for the hospital yet — the card shows the name
-- either way, and links to the hospital page only when one exists.
alter table doctors add column if not exists hospital_name text;

-- Featured doctors: the highlighted rows in the source directory. These sort
-- to the top of the listing and carry a badge.
alter table doctors add column if not exists is_priority boolean not null default false;

-- The listing sorts on these two constantly.
create index if not exists doctors_priority_idx on doctors (is_priority desc, name asc);
create index if not exists doctors_specialty_idx on doctors (specialty);
