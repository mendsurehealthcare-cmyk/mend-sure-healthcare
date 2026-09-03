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
};

export function specialtyIcon(specialty) {
  return SPECIALTY_ICONS[specialty] || 'medical_services';
}
