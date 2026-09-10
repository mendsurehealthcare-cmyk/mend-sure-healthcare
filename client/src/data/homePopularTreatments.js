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

  Each `image` is a real photograph from Wikimedia Commons, not a stock
  illustration or a photo of this site's own doctors/hospitals — no photo of
  an actual Mend Sure procedure exists to use instead. All nine are U.S.
  federal government works (military or NIH/NCI) and so are public domain,
  chosen deliberately over several Creative-Commons alternatives found during
  the same search specifically to avoid an attribution obligation this card
  design has no byline slot for. Source pages, for the record:
    - Cardiac Surgery: commons.wikimedia.org/wiki/File:Coronary_artery_bypass_surgery_Image_657B-PH.jpg (NCI, Bill Branson/Jerry Hecht, 1981)
    - Oncology: commons.wikimedia.org/wiki/File:Chemotherapy_vials_(4).jpg (NCI, Bill Branson)
    - Neurosurgery: commons.wikimedia.org/wiki/File:Surgery_in_Afghanistan_141130-N-JY715-968.jpg (U.S. Navy, Kandahar — generic OR photo, not neurosurgery-specific)
    - Spine Surgery: commons.wikimedia.org/wiki/File:Lt._Justin_Dye_and_Dr._Minh_Hoaug_Vo_operate_on_a_patient_spine_during_Pacific_Partnership_2017._(34532937326).jpg (U.S. Navy)
    - Orthopedics: commons.wikimedia.org/wiki/File:Orif_surgery.jpg (U.S. Navy, femur ORIF aboard USNS Comfort)
    - IVF: commons.wikimedia.org/wiki/File:Medical_Laboratory_Scientist_US_NIH.jpg (NIH — a lab-bench photo, not an IVF clinic specifically; no PD IVF-lab photo was found)
    - Gynaecology: commons.wikimedia.org/wiki/File:Laparoscopic_surgery_in_Afghanistan_141130-N-JY715-109.jpg (U.S. Navy — laparoscopic surgery, not gynaecological specifically)
    - Liver Transplant: commons.wikimedia.org/wiki/File:Operating_room_activity_-_Aug._4,_2015_150804-F-LP903-0333.jpg (U.S. Air Force, Honduras — generic OR photo, not a liver transplant specifically)
    - Bone Marrow: commons.wikimedia.org/wiki/File:US_Navy_021204-N-0696M-171_Surgical_technician_Amina_Sherali_places_recently_transfused_bone_marrow...jpg (U.S. Navy — an actual bone-marrow transfusion)
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Coronary_artery_bypass_surgery_Image_657B-PH.jpg',
    // Sourced from INDIA_COSTS in CardiacSurgeryCostGuide.jsx — not exported
    // from there, so reproduced here as the one figure this list needs.
    inr: '₹2,80,000',
    usd: '$5,000',
  },
  {
    name: 'Breast Cancer',
    specialty: 'Oncology',
    description: 'Multidisciplinary cancer treatment combining surgery, chemotherapy, and radiation as needed.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Chemotherapy_vials_%284%29.jpg',
    ...findRow('Oncology', 'Breast Cancer'),
  },
  {
    name: 'Brain Tumour Resection',
    specialty: 'Neurosurgery',
    description: 'Surgical removal of a brain tumour to relieve pressure and halt disease progression.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Surgery_in_Afghanistan_141130-N-JY715-968.jpg',
    ...findRow('Neurosurgery', 'Brain Tumour Resection'),
  },
  {
    name: 'Spinal Fusion',
    specialty: 'Spine Surgery',
    description: 'Permanently joins two or more vertebrae to stabilise the spine and relieve chronic pain.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/0/0a/Lt._Justin_Dye_and_Dr._Minh_Hoaug_Vo_operate_on_a_patient_spine_during_Pacific_Partnership_2017._%2834532937326%29.jpg',
    ...findRow('Spine Surgery', 'Spinal Fusion'),
  },
  {
    name: 'Unilateral Total Knee Replacement',
    specialty: 'Orthopedics',
    description: 'Replaces a single worn or damaged knee joint with a prosthetic implant.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Orif_surgery.jpg',
    ...findRow('Orthopedics', 'Unilateral Total Knee Replacement'),
  },
  {
    name: 'IVF with ICSI',
    specialty: 'IVF',
    description: 'In-vitro fertilisation with intracytoplasmic sperm injection for assisted conception.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Medical_Laboratory_Scientist_US_NIH.jpg',
    ...findRow('IVF', 'IVF with Intracytoplasmic Sperm Injection (ICSI)'),
  },
  {
    name: 'Total Laparoscopic Hysterectomy',
    specialty: 'Gynaecology',
    description: 'Minimally invasive keyhole removal of the uterus for fibroids, prolapse, or other conditions.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Laparoscopic_surgery_in_Afghanistan_141130-N-JY715-109.jpg',
    ...findRow('Gynaecology', 'Total Laparoscopic Hysterectomy (TLH)'),
  },
  {
    name: 'Living Donor Liver Transplant',
    specialty: 'Liver Transplant',
    description: 'Replaces a failing liver with a healthy portion donated by a living, matched relative.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/7/70/Operating_room_activity_-_Aug._4%2C_2015_150804-F-LP903-0333.jpg',
    ...findRow('Liver Transplant', 'Living Donor Transplant'),
  },
  {
    name: 'Autologous Bone Marrow Transplant',
    specialty: 'Bone Marrow',
    description: "Uses a patient's own stem cells to restore healthy marrow after high-dose treatment.",
    image:
      'https://upload.wikimedia.org/wikipedia/commons/f/fb/US_Navy_021204-N-0696M-171_Surgical_technician_Amina_Sherali_places_recently_transfused_bone_marrow_from_Aviation_Electronics_Technician_1st_Class_Michael_Griffioen_into_a_sterile_bag_in_preparation_for_transplant.jpg',
    ...findRow('Bone Marrow', 'Autologous BMT'),
  },
];
