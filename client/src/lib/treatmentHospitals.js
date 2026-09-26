import { ALL_GUIDE_SPECIALTIES } from '../data/treatmentCostGuides';
import { BONE_MARROW_DOCTOR_SLUGS } from '../data/boneMarrowArticle';
import { GYNAECOLOGY_DOCTOR_SLUGS } from '../data/gynaecologyArticle';
import { slugify } from './slug';

/*
  Which hospitals offer a treatment.

  Hospitals aren't tagged with treatments of their own, so a hospital
  "offers" a treatment when at least one of the doctors who perform it
  practises there — the same rule the treatment guides' "Hospitals for ..."
  sections use, and the one the Departments Summary sheet in
  MendSure_Departments_Doctors_Hospitals.xlsx was built from ("Hospitals
  Covered" per department). Adding a doctor to the directory therefore adds
  their hospital to that treatment's list with no second list to maintain.

  Each treatment names the doctor-directory specialties that perform it
  (the directory uses its own care categories, not the treatment names), or,
  where no specialty identifies them, the doctors by slug — see the notes on
  ARTICLE_GUIDES in Treatments.jsx for why Bone Marrow and Gynaecology use
  slugs. IVF resolves to no doctors, and so no hospitals,
  until a fertility specialist is added under "Fertility".
*/
const TREATMENT_DOCTORS = {
  'Cardiac Surgery': { specialties: ['Cardiac Care'] },
  Oncology: { specialties: ['Oncology Care'] },
  Neurosurgery: { specialties: ['Neurosurgery'] },
  'Spine Surgery': { specialties: ['Spine Surgery'] },
  Orthopedics: { specialties: ['Orthopaedic Care'] },
  'Liver Transplant': { specialties: ['Liver Transplant'] },
  'Bone Marrow': { slugs: BONE_MARROW_DOCTOR_SLUGS },
  IVF: { specialties: ['Fertility'] },
  // The directory has no Gynaecology category; its gynaecologists are the
  // gynae-oncologists filed under Oncology Care.
  Gynaecology: { slugs: GYNAECOLOGY_DOCTOR_SLUGS },
};

// URL slug <-> treatment name, e.g. "cardiac-surgery" <-> "Cardiac Surgery".
export function treatmentSlug(treatment) {
  return slugify(treatment);
}

export function treatmentFromSlug(slug) {
  return ALL_GUIDE_SPECIALTIES.find((treatment) => treatmentSlug(treatment) === slug) || null;
}

export function doctorsForTreatment(doctors, treatment) {
  const rule = TREATMENT_DOCTORS[treatment];
  if (!doctors || !rule) return [];
  return doctors.filter(
    (doctor) => rule.specialties?.includes(doctor.specialty) || rule.slugs?.includes(doctor.slug)
  );
}

// The treatment's hospitals, each paired with how many of its doctors for
// that treatment practise there (shown on the card).
export function hospitalsForTreatment(hospitals, doctors, treatment) {
  if (!hospitals || !doctors) return [];

  const counts = new Map();
  for (const doctor of doctorsForTreatment(doctors, treatment)) {
    const slug = doctor.hospitals?.slug;
    if (slug) counts.set(slug, (counts.get(slug) || 0) + 1);
  }

  return hospitals
    .filter((hospital) => counts.has(hospital.slug))
    .map((hospital) => ({ hospital, specialistCount: counts.get(hospital.slug) }));
}
