-- Client-requested directory corrections (2026-10-01).
-- Run once in the Supabase SQL editor. Keep server/db/doctors.json and
-- hospitals.json in step (already updated alongside this file).

begin;

-- Hospitals: "Max Saket" was listed twice. Max Smart Super Speciality
-- Hospital shares the Saket campus with Max Super Speciality Hospital, so
-- every doctor filed there (nine at the time of writing) moves to the
-- remaining Saket entry before the duplicate goes — otherwise the delete
-- would leave them with no hospital at all (hospital_id is on delete set null).
update doctors
set hospital_id = (select id from hospitals where slug = 'max-super-speciality-saket')
where hospital_id = (select id from hospitals where slug = 'max-smart-super-speciality-saket');
delete from hospitals where slug = 'max-smart-super-speciality-saket';

-- Mendsure_Departments_Doctors_Hospitals.xlsx: these doctors had no hospital
-- linked (and no hospital_name either), so their cards showed no hospital,
-- although each one's hospital is in the directory.
update doctors d
set hospital_id = h.id
from (values
  ('ce8dc8ab-0da4-45b5-85d8-b867872ba0c3'::uuid, 'metro-hospital-faridabad'),              -- dr-niti-chadha-negi
  ('d5b03ed4-ba9f-452f-846c-28c88c74ce12'::uuid, 'ssb-heart-and-multispecialty-hospital'), -- dr-s-s-bansal
  ('6e48f22b-b060-43dc-bcf4-d287cfe5cf75'::uuid, 'marengo-asia-hospitals-faridabad'),      -- dr-rajesh-sharma
  ('2d776d91-384d-468e-8c74-e81db86d4d02'::uuid, 'fortis-hospital-vasant-kunj'),           -- dr-sanjay-gupta
  ('05b1eaaf-f838-4a8d-9869-ef470c7a2502'::uuid, 'fortis-hospital-shalimar-bagh'),         -- dr-dinesh-kumar-mittal
  ('f6723cf9-2218-4fe9-9b8e-9b17303da787'::uuid, 'shalby-sanar-international-hospital'),   -- dr-harnarayan-singh
  ('47f6c9e1-fc53-44cf-9078-8a956929280f'::uuid, 'fortis-hospital-manesar'),               -- dr-rohit-lamba
  ('45dcdcf0-e508-40b7-8ee0-b8c024f0beab'::uuid, 'max-super-speciality-patparganj')        -- dr-prof-anil-arora
) as v(doctor_id, hospital_slug)
join hospitals h on h.slug = v.hospital_slug
where d.id = v.doctor_id;

-- Doctors outside the spreadsheet whose specialty and department didn't
-- agree — filed under the wrong one of the two.
update doctors set department = 'Gastroenterology'
where id = '40585cbf-9516-4738-9a97-b0545eb4ca1b'; -- dr-amit-javed: GI surgeon, department was Oncology Surgery
update doctors set specialty = 'Urology Care'
where id = '1f679b63-8444-4983-b6a4-bd484dcd3cae'; -- dr-vikas-agarwal: urologist, specialty was Nephrology
update doctors set specialty = 'Nephrology'
where id = '3367da47-cb0e-49b0-b62d-ab72c9b3fe09'; -- dr-sanjeev-gulati: nephrologist, specialty was Urology Care
update doctors set specialty = 'Gynaecology'
where id = 'c8fb2ec9-c39b-4c05-80a1-773aae866604'; -- dr-shipli-ghosh-shrivastava: obstetrician-gynaecologist, specialty was Pediatric Care

-- Oncology: Dr. Mayank Madan is a GI surgeon, not an oncologist — he moves
-- to Gastroenterology, a specialty of its own.
update doctors set specialty = 'Gastroenterology'
where id = 'bf0503b6-1205-418c-98dc-470533dab39d'; -- dr-mayank-madan

-- Neurosurgery: Dr. Vipul Gupta has moved from Artemis to Sir H. N. Reliance
-- Foundation Hospital, Mumbai. That hospital isn't in the directory, so it's
-- shown by name only (hospital_name), the same as other doctors at
-- hospitals outside the network.
update doctors
set hospital_id = null,
    hospital_name = 'Sir H. N. Reliance Foundation Hospital, Mumbai',
    career_history = array_prepend(
      'Director, Neurointerventional Surgery, Artemis Hospital, Gurgaon',
      coalesce(career_history, '{}')
    )
where id = 'd749185c-fd40-44db-b9af-42db418f0c23'; -- dr-vipul-gupta

-- Orthopaedics: Dr. Hemant Sharma has moved from Marengo Asia to Artemis
-- Hospital, Gurgaon.
update doctors
set hospital_id = (select id from hospitals where slug = 'artemis-hospital'),
    hospital_name = null,
    designation = 'Orthopaedics, Joint Replacement & Spine Surgery',
    bio = replace(
      bio,
      'Dr. Hemant Sharma chairs orthopaedics, joint replacement and spine surgery at Marengo Asia Hospitals, Gurugram,',
      'Dr. Hemant Sharma is an orthopaedic, joint replacement and spine surgeon at Artemis Hospital, Gurgaon,'
    ),
    career_history = array_prepend(
      'Chairman, Orthopaedics, Joint Replacement & Spine Surgery, Marengo Asia Hospitals, Gurugram',
      coalesce(career_history, '{}')
    )
where id = '67a144f7-f57e-4f09-b095-a376e99d0a38'; -- dr-hemant-sharma

-- Orthopaedics: Dr. Sanjay Sarup is a paediatric orthopaedic surgeon, so he
-- no longer shows under a "Pediatrics and Pediatric Surgery" department.
update doctors set department = 'Paediatric Orthopaedics'
where id = 'e6202fa0-8c4e-4775-bdeb-21ce27d1c3e5'; -- dr-sanjay-sarup

commit;
