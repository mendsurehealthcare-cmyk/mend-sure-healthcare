-- ============================================================
-- PLACEHOLDER DATA — REPLACE BEFORE LAUNCH
--
-- Every row below uses made-up names and rough, illustrative prices so the
-- site has something to show during development. Hospital names are
-- fictional (not real partners), and accreditation labels are marked
-- "Sample" on purpose so nothing here is mistaken for a real claim.
--
-- Before going live: replace hospitals/doctors/testimonials with real,
-- verified partners and consented patient stories, and confirm every price
-- with current data. Rows with is_placeholder = true are the ones to check.
-- ============================================================

-- Several specialties have no placeholder rows here — real, sourced pricing
-- for Cardiac Surgery, Oncology, Neurosurgery, Spine Surgery, Orthopedics,
-- IVF, Gynaecology, Liver Transplant and Bone Marrow ships as static content
-- instead (client/src/data/treatmentCostGuides.js and
-- CardiacSurgeryCostGuide.jsx), shown on the Treatments page as a table in
-- place of the usual card grid when one of those specialties is selected.
-- Seeding fake treatment rows for them here would put invented numbers back
-- in front of patients alongside the real ones, in the "All Specialties"
-- view — which is exactly why hip-replacement, knee-replacement,
-- spine-surgery, liver-transplant and ivf-treatment were removed from this
-- file rather than left in.
insert into treatments (name, slug, specialty, description, price_min_usd, price_max_usd, avg_price_usa_usd, package_inclusions, image_url)
values
  ('Kidney Transplant', 'kidney-transplant', 'Transplant', 'Surgical transplant of a healthy kidney for patients with kidney failure.', 13000, 18000, 150000, array['Hospital stay', 'Surgeon & transplant team fees', 'Airport pickup', 'Local coordinator', 'Post-op follow-up'], null),
  ('Bariatric (Weight-Loss) Surgery', 'bariatric-surgery', 'Bariatric Surgery', 'Surgical procedures to help with significant, sustained weight loss.', 5000, 7500, 25000, array['Hospital stay', 'Surgeon fees', 'Dietician consultation', 'Airport pickup', 'Local coordinator'], null),
  ('Dental Implants (per implant)', 'dental-implants', 'Dental', 'Titanium implant and crown to replace a missing tooth.', 600, 1200, 4000, array['Implant & crown', 'Consultation', 'Local coordinator'], null)
on conflict (slug) do nothing;

insert into hospitals (name, slug, city, description, accreditations, image_url, is_placeholder)
values
  ('Placeholder General Hospital', 'placeholder-general-hospital', 'Delhi', 'Sample multi-specialty hospital entry — replace with a real partner before launch.', array['Sample accreditation — replace'], null, true),
  ('Sample City Heart & Ortho Institute', 'sample-city-heart-ortho-institute', 'Chennai', 'Sample specialty hospital entry — replace with a real partner before launch.', array['Sample accreditation — replace'], null, true),
  ('Demo Wellness Medical Center', 'demo-wellness-medical-center', 'Mumbai', 'Sample hospital entry — replace with a real partner before launch.', array['Sample accreditation — replace'], null, true)
on conflict (slug) do nothing;

insert into hospital_treatments (hospital_id, treatment_id, price_min_usd, price_max_usd)
select h.id, t.id, t.price_min_usd, t.price_max_usd
from hospitals h
cross join treatments t
where h.slug = 'placeholder-general-hospital'
  and t.slug in ('kidney-transplant')
on conflict (hospital_id, treatment_id) do nothing;

-- sample-city-heart-ortho-institute had no treatments left to link once
-- hip-replacement, knee-replacement and spine-surgery were removed above, so
-- there is no insert for it here any more.

insert into hospital_treatments (hospital_id, treatment_id, price_min_usd, price_max_usd)
select h.id, t.id, t.price_min_usd, t.price_max_usd
from hospitals h
cross join treatments t
where h.slug = 'demo-wellness-medical-center'
  and t.slug in ('bariatric-surgery', 'dental-implants')
on conflict (hospital_id, treatment_id) do nothing;

insert into doctors (name, slug, specialty, hospital_id, experience_years, bio, image_url, is_placeholder)
select 'Dr. Sample Sharma', 'dr-sample-sharma', 'Cardiac Surgery', h.id, 18, 'Sample doctor profile — replace with a real, consented profile before launch.', null, true
from hospitals h where h.slug = 'placeholder-general-hospital'
on conflict (slug) do nothing;

insert into doctors (name, slug, specialty, hospital_id, experience_years, bio, image_url, is_placeholder)
select 'Dr. Sample Verma', 'dr-sample-verma', 'Orthopedics', h.id, 14, 'Sample doctor profile — replace with a real, consented profile before launch.', null, true
from hospitals h where h.slug = 'sample-city-heart-ortho-institute'
on conflict (slug) do nothing;

insert into doctors (name, slug, specialty, hospital_id, experience_years, bio, image_url, is_placeholder)
select 'Dr. Sample Iyer', 'dr-sample-iyer', 'Bariatric Surgery', h.id, 11, 'Sample doctor profile — replace with a real, consented profile before launch.', null, true
from hospitals h where h.slug = 'demo-wellness-medical-center'
on conflict (slug) do nothing;

insert into testimonials (patient_name, country, treatment, quote, image_url, is_placeholder)
values
  ('Sample Patient — UK', 'United Kingdom', 'Hip Replacement', 'Placeholder testimonial text — replace with a real, consented patient story before launch.', null, true),
  ('Sample Patient — USA', 'United States', 'Heart Bypass Surgery', 'Placeholder testimonial text — replace with a real, consented patient story before launch.', null, true),
  ('Sample Patient — Canada', 'Canada', 'Knee Replacement', 'Placeholder testimonial text — replace with a real, consented patient story before launch.', null, true)
on conflict do nothing;
