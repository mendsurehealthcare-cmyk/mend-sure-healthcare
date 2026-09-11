/*
  A curated set of real procedures for the home page's "Popular Treatments"
  section — one per core specialty, pulled from the same cost-guide data the
  Treatments page's tables render (client/src/data/treatmentCostGuides.js),
  so a price shown here can never drift from the one on the guide it links
  to. Replaces the three treatments-table placeholder rows (Bariatric
  Surgery, Dental, Transplant) that used to show here — those were leftover
  seed data, not considered "popular treatments".

  Each entry links to its specialty's guide (`/treatments?specialty=...`)
  rather than a per-procedure detail page, since these procedures don't have
  one — they're reference content, same reasoning as the guides themselves.

  Each `image` (besides Gynaecology, see below) is one Mend Sure supplied
  directly — branded title-card graphics dropped in images/treatments/ and
  run through the same resize-to-webp step as the doctor and hospital photos
  (see scripts/build-directory-images.mjs for that pattern; these aren't
  slug-matched the same way since there's no "treatments" table row backing
  them, so the resize happened as a one-off instead — the originals stay in
  images/treatments/ for the next time a card here changes).

  Two earlier passes used Wikimedia Commons media instead — first photos of
  the procedures themselves (open-chest surgery, a blood-transfusion bag),
  then clinical scans and anatomical plates. Both were replaced once Mend
  Sure had its own branded artwork to use, which fits the site's own visual
  identity in a way stock/public-domain media couldn't.

  Gynaecology is the one exception: no branded image was supplied for it, so
  it still uses the v3 Wikimedia pick — a CDC/HHS public-domain reproductive-
  system diagram (commons.wikimedia.org/wiki/File:Scheme_female_reproductive_system-en.svg)
  — until one is.
*/
import { CARDIAC_SURGERY_SPECIALTY, TREATMENT_COST_GUIDES } from './treatmentCostGuides';

// Looks up one named row across a specialty's guide table(s) and returns its
// India INR/USD strings exactly as authored there.
function findRow(specialty, name) {
  const tables = TREATMENT_COST_GUIDES[specialty] || [];
  for (const table of tables) {
    const row = table.rows.find((r) => r[0] === name);
    if (row) return { inr: row[1], usd: row[2] };
  }
  return { inr: '—', usd: '—' };
}

export const HOME_POPULAR_TREATMENTS = [
  {
    name: 'Heart Bypass Surgery',
    specialty: CARDIAC_SURGERY_SPECIALTY,
    description: 'Coronary artery bypass grafting to restore blood flow to a blocked or narrowed heart artery.',
    image: '/images/treatments/heart-bypass-surgery.webp',
    // Sourced from INDIA_COSTS in CardiacSurgeryCostGuide.jsx — not exported
    // from there, so reproduced here as the one figure this list needs.
    inr: '₹2,80,000',
    usd: '$5,000',
  },
  {
    name: 'Breast Cancer',
    specialty: 'Oncology',
    description: 'Multidisciplinary cancer treatment combining surgery, chemotherapy, and radiation as needed.',
    image: '/images/treatments/breast-cancer.webp',
    ...findRow('Oncology', 'Breast Cancer'),
  },
  {
    name: 'Brain Tumour Resection',
    specialty: 'Neurosurgery',
    description: 'Surgical removal of a brain tumour to relieve pressure and halt disease progression.',
    image: '/images/treatments/brain-tumour-resection.webp',
    ...findRow('Neurosurgery', 'Brain Tumour Resection'),
  },
  {
    name: 'Spinal Fusion',
    specialty: 'Spine Surgery',
    description: 'Permanently joins two or more vertebrae to stabilise the spine and relieve chronic pain.',
    image: '/images/treatments/spinal-fusion.webp',
    ...findRow('Spine Surgery', 'Spinal Fusion'),
  },
  {
    name: 'Unilateral Total Knee Replacement',
    specialty: 'Orthopedics',
    description: 'Replaces a single worn or damaged knee joint with a prosthetic implant.',
    image: '/images/treatments/knee-replacement.webp',
    ...findRow('Orthopedics', 'Unilateral Total Knee Replacement'),
  },
  {
    name: 'IVF with ICSI',
    specialty: 'IVF',
    description: 'In-vitro fertilisation with intracytoplasmic sperm injection for assisted conception.',
    image: '/images/treatments/ivf-icsi.webp',
    ...findRow('IVF', 'IVF with Intracytoplasmic Sperm Injection (ICSI)'),
  },
  {
    name: 'Total Laparoscopic Hysterectomy',
    specialty: 'Gynaecology',
    description: 'Minimally invasive keyhole removal of the uterus for fibroids, prolapse, or other conditions.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Scheme_female_reproductive_system-en.svg',
    ...findRow('Gynaecology', 'Total Laparoscopic Hysterectomy (TLH)'),
  },
  {
    name: 'Living Donor Liver Transplant',
    specialty: 'Liver Transplant',
    description: 'Replaces a failing liver with a healthy portion donated by a living, matched relative.',
    image: '/images/treatments/liver-transplant.webp',
    ...findRow('Liver Transplant', 'Living Donor Transplant'),
  },
  {
    name: 'Autologous Bone Marrow Transplant',
    specialty: 'Bone Marrow',
    description: "Uses a patient's own stem cells to restore healthy marrow after high-dose treatment.",
    image: '/images/treatments/bone-marrow-transplant.webp',
    ...findRow('Bone Marrow', 'Autologous BMT'),
  },
];
