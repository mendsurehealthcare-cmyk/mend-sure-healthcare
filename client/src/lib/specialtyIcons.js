// Maps a specialty name to a Material Symbols icon. Anything unmapped falls
// back to the generic medical icon, so new specialties added in Supabase
// still render sensibly.
const SPECIALTY_ICONS = {
  'Cardiac Surgery': 'cardiology',
  Cardiology: 'cardiology',
  Oncology: 'oncology',
  Neurosurgery: 'neurology',
  Neurology: 'neurology',
  Orthopedics: 'orthopedics',
  'Spine Surgery': 'waves',
  Transplant: 'biotech',
  'Bariatric Surgery': 'monitor_weight',
  Fertility: 'child_care',
  'IVF & Fertility': 'child_care',
  IVF: 'child_care',
  'Bone Marrow': 'bloodtype',
  Dental: 'dentistry',
  Gynecology: 'female',
  'Cosmetic Surgery': 'face',
  Pediatrics: 'child_care',
  Hematology: 'bloodtype',

  // Care categories used by the doctor directory.
  'Cardiac Care': 'cardiology',
  'Oncology Care': 'oncology',
  'Orthopaedic Care': 'orthopedics',
  Nephrology: 'nephrology',
  'Urology Care': 'nephrology',
  'Cosmetic Care': 'face',
  'Liver Transplant': 'gastroenterology',
  Gastroenterology: 'gastroenterology',
  'General Surgery': 'surgical',
  'ENT Care': 'hearing',
  'Pediatric Care': 'child_care',
  Ophthalmology: 'visibility',
  'Lung Care': 'pulmonology',
  Rheumatology: 'orthopedics',
  Gynaecology: 'female',
  'Peripheral Vascular': 'vital_signs',
};

export function specialtyIcon(specialty) {
  return SPECIALTY_ICONS[specialty] || 'medical_services';
}
