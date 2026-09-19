-- Extra columns for verifiable patient stories: the patient's age and
-- gender, and the doctor/hospital who actually treated them — alongside the
-- existing patient_name/country/treatment/quote/image_url. Naming the real
-- doctor and hospital is what turns a testimonial into a verifiable case
-- story rather than an anonymous quote, so it gets its own columns rather
-- than being folded into free text.
--
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New
-- query), after schema.sql. Safe to run more than once.
alter table testimonials add column if not exists age integer;
alter table testimonials add column if not exists gender text;
alter table testimonials add column if not exists doctor_name text;
alter table testimonials add column if not exists hospital_name text;
