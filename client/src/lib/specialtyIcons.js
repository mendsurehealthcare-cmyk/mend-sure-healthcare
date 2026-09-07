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
  Dental: 'dentistry',
  Gynecology: 'female',
  'Cosmetic Surgery': 'face',
  Pediatrics: 'child_care',
  Hematology: 'bloodtype',

  // Care categories used by the doctor directory.
  'Cardiac Care': 'cardiology',
  'Oncology Care': 'oncology',
  'Orthopaedic Care': 'orthopedics',
  'Nephrology & Kidney Transplant': 'nephrology',
  'Neuro and Spine Surgery': 'neurology',
  'Cosmetic Care': 'face',
  'Liver Transplant': 'gastroenterology',
  Gastroenterology: 'gastroenterology',
  'General Surgery': 'surgical',
  'ENT Care': 'hearing',
  'Paediatric Care': 'child_care',
  'Lung Care': 'pulmonology',
  Rheumatology: 'orthopedics',
  Gynaecology: 'female',
  'Peripheral Vascular': 'vital_signs',
};

export function specialtyIcon(specialty) {
  return SPECIALTY_ICONS[specialty] || 'medical_services';
}
