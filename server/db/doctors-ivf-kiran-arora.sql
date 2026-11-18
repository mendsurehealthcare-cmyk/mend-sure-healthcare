-- Adds Dr. Kiran Arora (Artemis Hospital, Gurugram) as the first doctor in
-- the "IVF and Infertility" department. Already applied to the live database
-- on 2026-11-19; kept here as a record. Safe to re-run (upserts on slug).
-- Source: https://www.artemishospitals.com/doctor/profile/kiran-arora

insert into doctors (
  name, slug, specialty, department, designation, hospital_id,
  experience_years, is_placeholder, is_priority, image_url, bio,
  education, awards, career_history
) values (
  'Dr. Kiran Arora',
  'dr-kiran-arora',
  'Fertility',
  'IVF and Infertility',
  'Unit Head, Reproductive Medicine (Unit II)',
  (select id from hospitals where slug = 'artemis-hospital'),
  20, false, false,
  '/images/doctors/dr-kiran-arora.webp',
  'Dr. Kiran Arora heads Unit II of Reproductive Medicine at Artemis Hospital, Gurugram, and has over 20 years of experience in managing infertile couples. She spent more than eight years in the UK, including at the Newcastle Fertility Centre, before being appointed Lead Infertility Consultant by Bourn Hall Clinic (UK) to head its Gurgaon clinic. Her clinical focus covers IVF/ICSI, unexplained and male infertility, recurrent IVF failure, donor egg treatment, surrogacy, recurrent miscarriage and high-risk pregnancy care. She has published her work on infertility in medical journals including Fertility and Sterility, and is a thesis guide in the DNB programme at Artemis Hospital.',
  array[
    'MBBS (Maulana Azad Medical College, 1991)',
    'MD, Obstetrics & Gynaecology (Lady Hardinge Medical College, 1997)',
    'MRCOG (Royal College of Obstetricians and Gynaecologists, UK, 2004)',
    'FRCOG (2018)'
  ],
  array[
    'Gold Medal, MD programme, Delhi University',
    'Publications on infertility in medical journals including Fertility and Sterility',
    'Lead Infertility Consultant, Bourn Hall Clinic (UK), Gurgaon',
    'DNB thesis guide, Artemis Hospital',
    'Member, Royal College of Obstetricians and Gynaecologists (RCOG)',
    'Member, Federation of Obstetric and Gynaecological Societies of India (FOGSI)'
  ],
  array[
    'Unit Head, Reproductive Medicine (Unit II), Artemis Hospital, Gurugram',
    'Lead Infertility Consultant, Bourn Hall Clinic (UK), Gurgaon',
    'Newcastle Fertility Centre, UK (8+ years in UK practice)'
  ]
)
on conflict (slug) do update set
  specialty = excluded.specialty, department = excluded.department,
  designation = excluded.designation, hospital_id = excluded.hospital_id,
  experience_years = excluded.experience_years, image_url = excluded.image_url,
  bio = excluded.bio, education = excluded.education, awards = excluded.awards,
  career_history = excluded.career_history;
