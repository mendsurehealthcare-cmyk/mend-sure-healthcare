/*
  Mend Sure's highlighted hospitals, in the order they should appear. These
  lead the Hospitals page (its first page of seven) and fill the home page's
  hospital sections, ahead of the rest of the network in A–Z order.

  Slugs rather than names, same as priorityDoctors.js, so a hospital keeps its
  place here even if its name is edited.
*/
export const FEATURED_HOSPITAL_SLUGS = [
  'fortis-memorial-research-institute', // Fortis Gurgaon
  'medanta-the-medicity',
  'indraprastha-apollo-hospital', // Apollo Delhi
  'max-super-speciality-saket',
  'blk-max-super-speciality-hospital',
  'fortis-escorts-heart-institute', // Fortis Escorts, Okhla
];

// Featured hospitals first, in FEATURED_HOSPITAL_SLUGS order, then everything
// else in the order it arrived. Returns a new array.
export function featuredFirst(hospitals) {
  const rank = new Map(FEATURED_HOSPITAL_SLUGS.map((slug, index) => [slug, index]));
  const featured = (hospitals || [])
    .filter((hospital) => rank.has(hospital.slug))
    .sort((a, b) => rank.get(a.slug) - rank.get(b.slug));
  const rest = (hospitals || []).filter((hospital) => !rank.has(hospital.slug));
  return [...featured, ...rest];
}
