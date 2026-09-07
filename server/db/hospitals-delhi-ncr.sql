-- Mend Sure's real partner hospitals across Delhi NCR.
--
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query),
-- after schema.sql and schema-updates.sql.
--
-- Safe to run more than once: it matches on `slug` and updates the name and
-- city rather than creating duplicates, so you can edit and re-run it.
--
-- NOTE ON THE BLANK COLUMNS
-- Only the name and city are filled in below, because those are the only
-- details supplied. description, accreditations, bed_count and departments are
-- deliberately left NULL rather than invented: these are real institutions, and
-- publishing a made-up bed count or an accreditation a hospital does not hold
-- would be a factual claim we cannot stand behind. The listing renders fine
-- without them — see the "filling in the details" section at the bottom.

insert into hospitals (name, slug, city, is_placeholder)
values
  -- Gurgaon
  ('Fortis Memorial Research Institute', 'fortis-memorial-research-institute', 'Gurgaon', false),
  ('Medanta – The Medicity',             'medanta-the-medicity',               'Gurgaon', false),
  ('Artemis Hospital',                   'artemis-hospital',                   'Gurgaon', false),
  ('Paras Hospital',                     'paras-hospital',                     'Gurgaon', false),

  -- Delhi
  ('Max Super Speciality Hospital, Saket',        'max-super-speciality-saket',        'Delhi', false),
  ('Fortis Escorts Heart Institute, Okhla',       'fortis-escorts-heart-institute',    'Delhi', false),
  ('Max Super Speciality Hospital, Vaishali',     'max-super-speciality-vaishali',     'Delhi', false),
  ('BLK-Max Super Speciality Hospital',           'blk-max-super-speciality-hospital', 'Delhi', false),
  ('Indraprastha Apollo Hospital',                'indraprastha-apollo-hospital',      'Delhi', false),
  ('Manipal Hospital, Dwarka',                    'manipal-hospital-dwarka',           'Delhi', false),
  ('Aakash Healthcare Super Speciality Hospital', 'aakash-healthcare',                 'Delhi', false),

  -- Noida
  ('Fortis Hospital, Noida Sector 62', 'fortis-hospital-noida-sector-62', 'Noida', false)
on conflict (slug) do update
  set name = excluded.name,
      city = excluded.city,
      is_placeholder = false;


-- ---------------------------------------------------------------------------
-- Removing the sample rows
-- ---------------------------------------------------------------------------
-- seed.sql ships three fake hospitals (Placeholder General, Sample City Heart
-- & Ortho, Demo Wellness) that will otherwise sit alongside the real ones in
-- the listing. Uncomment to clear them.
--
-- The seeded sample doctors point at those hospitals. The foreign key is
-- ON DELETE SET NULL, so the doctors survive with no hospital attached rather
-- than disappearing — tidy those up separately when you add real profiles.
--
--   delete from hospitals where is_placeholder = true;


-- ---------------------------------------------------------------------------
-- Filling in the details
-- ---------------------------------------------------------------------------
-- Each hospital card has room for a short description, accreditations, a bed
-- count, and a department list. Fill them in per hospital as you confirm the
-- facts. Example:
--
--   update hospitals set
--     description   = 'A 1,000-bed multi-speciality hospital in Gurgaon with a
--                      dedicated international patient wing.',
--     accreditations = array['NABH', 'JCI'],
--     bed_count      = 1000,
--     departments    = array['Cardiology', 'Oncology', 'Orthopaedics', 'Neurology']
--   where slug = 'medanta-the-medicity';
--
-- image_url takes a URL to a photograph of the facility. Without one the card
-- falls back to a tinted panel carrying the hospital's name, so an empty
-- image_url looks deliberate rather than broken.
