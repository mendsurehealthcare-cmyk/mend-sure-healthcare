/*
  The doctors singled out as Mend Sure's priority specialists.

  The database has an `is_priority` column for exactly this (see
  server/db/doctors-schema.sql), but that migration has not been applied to
  the live database yet, so there is nothing to filter on there. This list is
  the interim: slugs rather than names, so a doctor keeps their place here
  even if their name is edited, and ordered the way they should appear —
  consumers should not re-sort it.

  Retire this in favour of `doctor.is_priority` once the migration has run.
*/
export const PRIORITY_DOCTOR_SLUGS = [
  'dr-krishna-subramony-iyer',
  'dr-ashok-seth',
  'dr-z-s-meharwal',
  'dr-kulbhushan-singh-dagar',
  'dr-rajesh-sharma',
  'dr-naresh-trehan',
  'dr-yugal-kishore-mishra',
  'dr-vinod-raina',
  'dr-dharma-choudhary',
  'dr-vedant-kabra',
  'dr-niranjan-naik',
  'dr-surender-kumar-dabas',
  'dr-deepak-sarin',
  'dr-subhash-jangid',
  'dr-ashok-rajgopal',
  'dr-aashish-chaudhry',
  'dr-saurabh-pokhriyal',
  'dr-shafiq-ahmed',
  'dr-rana-patir',
  'dr-sandeep-vaishya',
  'dr-hitesh-garg',
  'dr-hamza-shaikh',
];

// Six of the doctors above, chosen to spread across specialties (cardiology,
// cardiac surgery, orthopaedics, oncology, neurosurgery, surgical oncology)
// rather than clustering in one — for the home page's compact showcase,
// which has room for six, not twenty-two.
export const HOME_DOCTOR_SLUGS = [
  'dr-ashok-seth',
  'dr-naresh-trehan',
  'dr-ashok-rajgopal',
  'dr-vinod-raina',
  'dr-rana-patir',
  'dr-surender-kumar-dabas',
];

// Looks up each slug in `doctors` and returns the matches in the order the
// slugs were given, not the order the doctors happen to arrive in from the
// API. Slugs with no matching doctor (the API hasn't loaded yet, or a slug
// here is stale) are silently skipped rather than producing a hole in the
// grid.
export function pickBySlug(doctors, slugs) {
  const bySlug = new Map((doctors || []).map((doctor) => [doctor.slug, doctor]));
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean);
}
