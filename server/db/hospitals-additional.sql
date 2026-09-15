-- Additional partner hospitals, supplied as a spreadsheet of 39 rows covering
-- Gurgaon, Faridabad, Noida, and Delhi. 12 of those 39 were already in the
-- `hospitals` table (added by hospitals-delhi-ncr.sql) and are skipped here
-- to avoid duplicates. This file adds the remaining 27.
--
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query),
-- after schema.sql and schema-updates.sql.
--
-- Safe to run more than once: it matches on `slug` and updates the name and
-- city rather than creating duplicates, so you can edit and re-run it.
--
-- A few source rows had a typo in the city column ("Dalehi" -> "Delhi") or a
-- name repeated across two different branches ("Max Super Speciality
-- Hospital" in Gurgaon vs. Sector 128 vs. Patparganj, etc.) — those got a
-- ", <locality>" suffix so each stays uniquely identifiable, matching the
-- naming style already used for the existing Saket/Vaishali Max branches.
--
-- The Faridabad Fortis branch is named "Fortis Escorts Hospital, Faridabad"
-- rather than the sheet's plain "Fortis Hospital" — confirmed against the
-- supplied photograph's filename, and it matches the naming of the existing
-- "Fortis Escorts Heart Institute, Okhla" sister branch.
--
-- NOTE ON THE BLANK COLUMNS
-- Only the name and city were supplied, so description, accreditations,
-- bed_count and departments are left NULL rather than invented — see
-- hospitals-delhi-ncr.sql's "filling in the details" section for how to add
-- them later, per hospital, once confirmed.

insert into hospitals (name, slug, city, is_placeholder)
values
  -- Gurgaon
  ('Max Super Speciality Hospital, Gurgaon', 'max-super-speciality-gurgaon', 'Gurgaon', false),
  ('Marengo Asia Hospitals, Gurgaon',        'marengo-asia-hospitals-gurgaon', 'Gurgaon', false),
  ('Shalby Sanar International Hospital',    'shalby-sanar-international-hospital', 'Gurgaon', false),
  ('CK Birla Hospital',                      'ck-birla-hospital', 'Gurgaon', false),
  ('Fortis Hospital, Manesar',               'fortis-hospital-manesar', 'Gurgaon', false),

  -- Faridabad
  ('Fortis Escorts Hospital, Faridabad',     'fortis-escorts-hospital-faridabad', 'Faridabad', false),
  ('Metro Hospital, Faridabad',              'metro-hospital-faridabad', 'Faridabad', false),
  ('Marengo Asia Hospitals, Faridabad',      'marengo-asia-hospitals-faridabad', 'Faridabad', false),
  ('Sarvodaya Hospital',                     'sarvodaya-hospital', 'Faridabad', false),
  ('Asian Institute of Medical Sciences',    'asian-institute-of-medical-sciences', 'Faridabad', false),
  ('SSB Heart and Multispecialty Hospital',  'ssb-heart-and-multispecialty-hospital', 'Faridabad', false),

  -- Noida
  ('Max Super Speciality Hospital, Sector 128',     'max-super-speciality-sector-128', 'Noida', false),
  ('Yashoda Hospital & Research Centre, Ghaziabad', 'yashoda-hospital-research-centre', 'Noida', false),

  -- Delhi
  ('Fortis Hospital, Shalimar Bagh',                'fortis-hospital-shalimar-bagh', 'Delhi', false),
  ('Fortis Hospital, Vasant Kunj',                  'fortis-hospital-vasant-kunj', 'Delhi', false),
  ('Max Smart Super Speciality Hospital, Saket',    'max-smart-super-speciality-saket', 'Delhi', false),
  ('Max Super Speciality Hospital, Patparganj',     'max-super-speciality-patparganj', 'Delhi', false),
  ('Max Super Speciality Hospital, Shalimar Bagh',  'max-super-speciality-shalimar-bagh', 'Delhi', false),
  ('Max Super Speciality Hospital, Panchsheel Park', 'max-super-speciality-panchsheel-park', 'Delhi', false),
  ('Indian Spinal Injuries Centre',                 'indian-spinal-injuries-centre', 'Delhi', false),
  ('IBS Institute of Brain and Spine',              'ibs-institute-of-brain-and-spine', 'Delhi', false),
  ('Venkateshwar Hospital',                         'venkateshwar-hospital', 'Delhi', false),
  ('Primus Super Speciality Hospital',              'primus-super-speciality-hospital', 'Delhi', false),
  ('Institute of Liver and Biliary Sciences',       'institute-of-liver-and-biliary-sciences', 'Delhi', false),
  ('Delhi Heart and Lung Institute',                'delhi-heart-and-lung-institute', 'Delhi', false),
  ('Vimhans Nayati Super Specialty Hospital',       'vimhans-nayati-super-specialty-hospital', 'Delhi', false),
  ('National Heart Institute',                      'national-heart-institute', 'Delhi', false)
on conflict (slug) do update
  set name = excluded.name,
      city = excluded.city,
      is_placeholder = false;


-- ---------------------------------------------------------------------------
-- Rows skipped as duplicates of hospitals-delhi-ncr.sql
-- ---------------------------------------------------------------------------
-- Fortis Memorial Research Institute, Medanta - The Medicity, Artemis
-- Hospital, Paras Hospital (Gurgaon); Fortis Hospital Noida Sector 62
-- (Noida); Fortis Escorts Heart Institute Okhla, Max Super Speciality
-- Hospital Saket, Max Super Speciality Hospital Vaishali, BLK-Max Super
-- Speciality Hospital, Indraprastha Apollo Hospital, Manipal Hospital
-- Dwarka, Aakash Healthcare Super Speciality Hospital (Delhi).
