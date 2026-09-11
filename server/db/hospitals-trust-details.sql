-- Mend Sure — hospital detail-page trust information
-- Run this AFTER schema.sql, seed.sql, schema-updates.sql and
-- hospitals-delhi-ncr.sql.
--
-- Adds the columns the hospital detail page needs to answer a patient's
-- first questions before they'll trust a facility they've never heard of:
-- where exactly it is, how long it's been operating, and when it's open.
-- "Treatments available" is deliberately NOT a column here — it's rendered
-- on the detail page from the doctors already linked to each hospital via
-- GET /api/doctors?hospital=<slug>, so it can never drift out of sync with
-- the doctor directory the way a separately maintained list would.
alter table hospitals add column if not exists address text;
alter table hospitals add column if not exists established_year integer;
-- General rather than a specific hour range: OPD hours vary by department
-- and doctor at every hospital below, change without notice, and getting a
-- specific range wrong could send a patient to a closed department. This is
-- the one fact true of all twelve regardless of department.
alter table hospitals add column if not exists timings text;

-- Real address and founding year for the twelve Delhi-NCR hospitals seeded
-- by hospitals-delhi-ncr.sql, sourced from each hospital's own site where it
-- published one, otherwise its Wikipedia entry (see server/db/schema.sql's
-- neighbouring seed files for the pattern this follows). Two are flagged
-- below where sources genuinely disagreed and one was picked as the more
-- specific/authoritative of the two — worth a second check against the
-- hospital directly before this is treated as final.
update hospitals set
  address = 'Plot Road No. 201, Sector 6, Dwarka, New Delhi, Delhi 110075',
  -- Aakash traces back to a single-specialty 'Bone and Joint Clinic' opened
  -- in 2011; 2017 is when it became the multi-specialty hospital this page
  -- is actually describing.
  established_year = 2017,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'aakash-healthcare';

update hospitals set
  address = 'J Block, Mayfield Gardens, Sector 51, Gurugram, Haryana 122001',
  established_year = 2007,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'artemis-hospital';

update hospitals set
  address = 'Pusa Road, New Delhi, Delhi 110005',
  established_year = 1959,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'blk-max-super-speciality-hospital';

update hospitals set
  address = 'Okhla Road, Sukhdev Vihar, New Delhi, Delhi 110025',
  established_year = 1988,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'fortis-escorts-heart-institute';

update hospitals set
  address = 'B-22, Sector 62, Noida, Uttar Pradesh 201301',
  established_year = 2004,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'fortis-hospital-noida-sector-62';

update hospitals set
  address = 'Sector 44, Opposite HUDA City Centre, Gurugram, Haryana 122002',
  established_year = 2013,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'fortis-memorial-research-institute';

update hospitals set
  address = 'Delhi Mathura Road, Sarita Vihar, New Delhi, Delhi 110076',
  established_year = 1996,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'indraprastha-apollo-hospital';

update hospitals set
  -- manipalhospitals.com's own about page names 2018; third-party directories
  -- vary between 2007/2015/2018, so this is the site's own figure, not a
  -- majority vote of aggregators.
  address = 'Sector 6, Palam Vihar Extension, Dwarka, New Delhi, Delhi 110075',
  established_year = 2018,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'manipal-hospital-dwarka';

update hospitals set
  address = 'Press Enclave Road, Saket, New Delhi, Delhi 110017',
  established_year = 2006,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'max-super-speciality-saket';

update hospitals set
  address = 'W-3, Sector 1, Vaishali, Ghaziabad, Uttar Pradesh 201012',
  established_year = 2008,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'max-super-speciality-vaishali';

update hospitals set
  address = 'CH Baktawar Singh Road, Sector 38, Gurugram, Haryana 122001',
  established_year = 2009,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'medanta-the-medicity';

update hospitals set
  -- Paras Healthcare now runs several hospitals under this name (Gurugram,
  -- Panchkula, Patna, ...); this is the original Gurugram flagship's address,
  -- but confirm against the hospital directly — it was the one fact this
  -- pass couldn't pin to a single authoritative source.
  address = 'C-1, Sushant Lok Phase 1, Sector 43, Gurugram, Haryana 122002',
  established_year = 2006,
  timings = '24/7 Emergency & Inpatient Care · OPD consultations by appointment'
where slug = 'paras-hospital';
