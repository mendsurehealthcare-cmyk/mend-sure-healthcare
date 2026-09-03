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

insert into treatments (name, slug, specialty, description, price_min_usd, price_max_usd, avg_price_usa_usd, package_inclusions, image_url)
values
  ('Heart Bypass Surgery (CABG)', 'heart-bypass-surgery', 'Cardiac Surgery', 'Coronary artery bypass grafting to restore blood flow to the heart.', 6000, 10000, 120000, array['Hospital stay', 'Surgeon & anesthetist fees', 'Airport pickup', 'Local coordinator', 'Post-op follow-up'], null),
  ('Angioplasty with Stent', 'angioplasty-with-stent', 'Cardiac Surgery', 'A minimally invasive procedure to open blocked coronary arteries.', 3500, 6000, 28000, array['Hospital stay', 'Stent cost', 'Airport pickup', 'Local coordinator'], null),
  ('Hip Replacement', 'hip-replacement', 'Orthopedics', 'Replacement of a damaged hip joint with an artificial implant.', 6500, 9500, 40000, array['Hospital stay', 'Implant cost', 'Physiotherapy sessions', 'Airport pickup', 'Local coordinator'], null),
  ('Knee Replacement', 'knee-replacement', 'Orthopedics', 'Replacement of a damaged knee joint with an artificial implant.', 5500, 8500, 35000, array['Hospital stay', 'Implant cost', 'Physiotherapy sessions', 'Airport pickup', 'Local coordinator'], null),
  ('Spine Surgery', 'spine-surgery', 'Orthopedics', 'Surgical correction for spinal conditions such as disc herniation.', 7000, 12000, 100000, array['Hospital stay', 'Surgeon fees', 'Airport pickup', 'Local coordinator'], null),
  ('Kidney Transplant', 'kidney-transplant', 'Transplant', 'Surgical transplant of a healthy kidney for patients with kidney failure.', 13000, 18000, 150000, array['Hospital stay', 'Surgeon & transplant team fees', 'Airport pickup', 'Local coordinator', 'Post-op follow-up'], null),
  ('Liver Transplant', 'liver-transplant', 'Transplant', 'Surgical transplant of a healthy liver for patients with liver failure.', 28000, 35000, 300000, array['Hospital stay', 'Surgeon & transplant team fees', 'Airport pickup', 'Local coordinator', 'Post-op follow-up'], null),
  ('Bariatric (Weight-Loss) Surgery', 'bariatric-surgery', 'Bariatric Surgery', 'Surgical procedures to help with significant, sustained weight loss.', 5000, 7500, 25000, array['Hospital stay', 'Surgeon fees', 'Dietician consultation', 'Airport pickup', 'Local coordinator'], null),
  ('IVF Treatment (per cycle)', 'ivf-treatment', 'Fertility', 'In-vitro fertilization treatment for couples facing infertility.', 2500, 4000, 18000, array['Clinic fees', 'Medication (varies)', 'Local coordinator'], null),
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
  and t.slug in ('heart-bypass-surgery', 'angioplasty-with-stent', 'kidney-transplant', 'liver-transplant')
on conflict (hospital_id, treatment_id) do nothing;

insert into hospital_treatments (hospital_id, treatment_id, price_min_usd, price_max_usd)
select h.id, t.id, t.price_min_usd, t.price_max_usd
from hospitals h
cross join treatments t
where h.slug = 'sample-city-heart-ortho-institute'
  and t.slug in ('heart-bypass-surgery', 'hip-replacement', 'knee-replacement', 'spine-surgery')
on conflict (hospital_id, treatment_id) do nothing;

insert into hospital_treatments (hospital_id, treatment_id, price_min_usd, price_max_usd)
select h.id, t.id, t.price_min_usd, t.price_max_usd
from hospitals h
cross join treatments t
where h.slug = 'demo-wellness-medical-center'
  and t.slug in ('bariatric-surgery', 'ivf-treatment', 'dental-implants')
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
