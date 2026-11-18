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

// The full department list from MendSure_Departments_Doctors_Hospitals.xlsx
// ("Doctors by Department" sheet), offered in the hospital search bar's
// Treatment dropdown. Each maps to the doctor directory's `department`
// values. Departments with no doctors in the directory yet (Bariatric,
// Dermatology, etc.) are listed anyway and show the "no hospital listed
// yet" message until doctors are added.
const DEPARTMENT_DOCTORS = {
  'Cardiology and Cardiac Surgery': { departments: ['Cardiology', 'Cardiac Surgery'] },
  'Paediatric Cardiology and Cardiac Surgery': {
    departments: ['Paediatric Cardiology', 'Paediatric Cardiac Surgery'],
  },
  'Cosmetic and Plastic Surgery': { departments: ['Cosmetic and Plastic Surgery'] },
  'ENT Surgery': { departments: ['ENT Surgery'] },
  Gastroenterology: { departments: ['Gastroenterology'] },
  Pulmonology: { departments: ['Pulmonology'] },
  Nephrology: { departments: ['Nephrology'] },
  Urology: { departments: ['Urology'] },
  'Neurology and Neurosurgery': {
    departments: ['Neurology', 'Neuro Surgery', 'Neurointerventional Radiology'],
  },
  Haematology: { departments: ['Haematology'] },
  'Oncology and Oncology Surgery': {
    departments: ['Medical Oncology', 'Oncology Surgery', 'Oncology Radiation'],
  },
  'Orthopedics and Joint Replacement': { departments: ['Orthopaedics and Joint Replacement'] },
  'Vascular Surgery': { departments: ['Vascular Surgery'] },
  Rheumatology: { departments: ['Rheumatology'] },
  'Spine Surgery': { departments: ['Spine Surgery'] },
  'Organ Transplant': { departments: ['Liver Transplant', 'Lung Transplant', 'Kidney Transplant'] },
  'Eye Treatment and Surgery': { departments: ['Ophthalmology'] },
  'Bariatric Surgery': { departments: ['Bariatric Surgery'] },
  'IVF and Infertility': { departments: ['IVF and Infertility'] },
  'Gynaecology and Obstetrics': { departments: ['Obstetrics and Gynaecology'] },
  'General Surgery': { departments: ['General Surgery'], specialties: ['General Surgery'] },
  Dermatology: { departments: ['Dermatology'] },
  Endocrinology: { departments: ['Endocrinology'] },
  'Dental Treatment': { departments: ['Dental Treatment'] },
  Hepatology: { departments: ['Hepatology'] },
  'Pediatrics and Pediatric Surgery': { departments: ['Pediatrics and Pediatric Surgery'] },
};

// Sub-departments from the same sheet, listed under their main department in
// the dropdown and each searchable on its own. (The sheet shows rows 1 and 2's
// sub-departments swapped; they're attached here to the department they
// belong to — Cardiology/Cardiac Surgery under the adult group, the
// paediatric pair under the paediatric one.)
const SUB_DEPARTMENTS = {
  'Cardiology and Cardiac Surgery': {
    Cardiology: ['Cardiology'],
    'Cardiac Surgery': ['Cardiac Surgery'],
  },
  'Paediatric Cardiology and Cardiac Surgery': {
    'Paediatric Cardiology': ['Paediatric Cardiology'],
    'Paediatric Cardiac Surgery': ['Paediatric Cardiac Surgery'],
  },
  'Neurology and Neurosurgery': {
    Neurology: ['Neurology'],
    Neurosurgery: ['Neuro Surgery'],
    'Neurointerventional Radiology': ['Neurointerventional Radiology'],
  },
  'Oncology and Oncology Surgery': {
    'Medical Oncology': ['Medical Oncology'],
    'Oncology Surgery': ['Oncology Surgery'],
    'Oncology Radiation': ['Oncology Radiation'],
  },
  'Orthopedics and Joint Replacement': {
    Orthopaedics: ['Orthopaedics and Joint Replacement'],
    'Pediatric Orthopedics': ['Pediatric Orthopedics'],
  },
  'Organ Transplant': {
    'Lung Transplant': ['Lung Transplant'],
    'Liver Transplant': ['Liver Transplant'],
    'Kidney Transplant': ['Kidney Transplant'],
  },
};

for (const subs of Object.values(SUB_DEPARTMENTS)) {
  for (const [name, departments] of Object.entries(subs)) {
    DEPARTMENT_DOCTORS[name] = { departments };
  }
}

export const SEARCH_DEPARTMENTS = Object.keys(DEPARTMENT_DOCTORS);

// The dropdown's rows in display order: each main department (with
// `subCount` when it has sub-departments), followed by its sub-departments,
// which carry the `parent` they belong to so the dropdown can reveal them
// only while that parent is hovered.
export const SEARCH_DEPARTMENT_OPTIONS = Object.keys(DEPARTMENT_DOCTORS)
  .filter((name) => !Object.values(SUB_DEPARTMENTS).some((subs) => name in subs))
  .flatMap((name) => {
    const subs = Object.keys(SUB_DEPARTMENTS[name] || {});
    return [
      { value: name, label: name, subCount: subs.length },
      ...subs.map((sub) => ({ value: sub, label: sub, parent: name })),
    ];
  });

// Whether a treatment name has its own guide page on /treatments (the
// department names above don't, unless they happen to share a name).
export const hasTreatmentGuide = (treatment) => ALL_GUIDE_SPECIALTIES.includes(treatment);

// URL slug <-> treatment name, e.g. "cardiac-surgery" <-> "Cardiac Surgery".
export function treatmentSlug(treatment) {
  return slugify(treatment);
}

// Accepts both the guide specialties (used by the navbar's Hospitals menu)
// and the department names (used by the search bar's dropdown).
export function treatmentFromSlug(slug) {
  return (
    ALL_GUIDE_SPECIALTIES.find((treatment) => treatmentSlug(treatment) === slug) ||
    SEARCH_DEPARTMENTS.find((treatment) => treatmentSlug(treatment) === slug) ||
    null
  );
}

export function doctorsForTreatment(doctors, treatment) {
  // A department/sub-department rule wins over a guide's broader specialty
  // rule when both share a name (e.g. "Cardiac Surgery" means the Cardiac
  // Surgery department, not every Cardiac Care doctor).
  const rule = DEPARTMENT_DOCTORS[treatment] || TREATMENT_DOCTORS[treatment];
  if (!doctors || !rule) return [];
  return doctors.filter(
    (doctor) =>
      rule.specialties?.includes(doctor.specialty) ||
      rule.departments?.includes(doctor.department) ||
      rule.slugs?.includes(doctor.slug)
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
