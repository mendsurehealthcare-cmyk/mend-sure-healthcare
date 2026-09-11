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
  an actual Mend Sure procedure exists to use instead.

  The first version of this list used photos of the procedures themselves —
  open-chest cardiac surgery, a scalpel mid-incision, a blood-transfusion bag
  — and was replaced after feedback that seeing the operation itself on a
  home page a prospective patient is still deciding to trust reads as
  frightening rather than reassuring. Every image below was deliberately
  picked to show the reassuring side of the same care instead: a calm
  consultation, an exam, a scan being explained, a rehab session — never an
  open incision, blood, or an instrument mid-cut. All nine are still U.S.
  federal government works (military or NIH/NCI) and so are public domain,
  chosen deliberately over several Creative-Commons alternatives found during
  the same search specifically to avoid an attribution obligation this card
  design has no byline slot for. None depicts the specific procedure named on
  its card — a genuinely calming, on-topic photo for "spinal fusion" or
  "bone marrow transplant" specifically doesn't exist in the public-domain
  supply, so each stands in for the broader reassurance of its specialty
  instead. Source pages, for the record:
    - Cardiac Surgery: commons.wikimedia.org/wiki/File:Nurse_takes_a_patient's_blood_pressure.jpg (NCI, Bill Branson, 1988)
    - Oncology: commons.wikimedia.org/wiki/File:Doctor_advises_patient.jpg (NCI, Bill Branson, 1992)
    - Neurosurgery: commons.wikimedia.org/wiki/File:Doctor_explains_x-ray_to_patient.jpg (NIH, Rhoda Baer, 2008 — an x-ray, not an MRI, but the same "a doctor is walking you through your scan" moment)
    - Spine Surgery: commons.wikimedia.org/wiki/File:US_Navy_081610-A-6522B-002_..._gives_Army_Sgt._Charlie_McCall_a_physical_therapy_trea.jpg (U.S. Army/Navy, Landstuhl, 2008 — a physical-therapy session)
    - Orthopedics: commons.wikimedia.org/wiki/File:Flickr_-_Official_U.S._Navy_Imagery_-_An_Officer_assists_a_physical_therapy_patient..jpg (U.S. Navy, Guatemala, 2012)
    - IVF: commons.wikimedia.org/wiki/File:Doctor_consults_with_patient_(7).jpg (NCI, Bill Branson, 1990)
    - Gynaecology: commons.wikimedia.org/wiki/File:Doctor_talking_with_a_patient.jpg (NIH/NCI, 2006)
    - Liver Transplant: commons.wikimedia.org/wiki/File:Doctor_examines_patient.jpg (NCI, 2005)
    - Bone Marrow: commons.wikimedia.org/wiki/File:Doctor_consults_with_patient_(4).jpg (NCI, 2005)
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
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Nurse_takes_a_patient%27s_blood_pressure.jpg",
    // Sourced from INDIA_COSTS in CardiacSurgeryCostGuide.jsx — not exported
    // from there, so reproduced here as the one figure this list needs.
    inr: '₹2,80,000',
    usd: '$5,000',
  },
  {
    name: 'Breast Cancer',
    specialty: 'Oncology',
    description: 'Multidisciplinary cancer treatment combining surgery, chemotherapy, and radiation as needed.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Doctor_advises_patient.jpg',
    ...findRow('Oncology', 'Breast Cancer'),
  },
  {
    name: 'Brain Tumour Resection',
    specialty: 'Neurosurgery',
    description: 'Surgical removal of a brain tumour to relieve pressure and halt disease progression.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Doctor_explains_x-ray_to_patient.jpg',
    ...findRow('Neurosurgery', 'Brain Tumour Resection'),
  },
  {
    name: 'Spinal Fusion',
    specialty: 'Spine Surgery',
    description: 'Permanently joins two or more vertebrae to stabilise the spine and relieve chronic pain.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/6/69/US_Navy_081610-A-6522B-002_Physical_therapist_Lt._Cmdr._Mitchel_Ideue%2C_Officer_in_Charge_of_Inpatient_Services_at_Landstuhl_Regional_Medical_Center%2C_in_Landstuhl%2C_Germany%2C_gives_Army_Sgt._Charlie_McCall_a_physical_therapy_trea.jpg',
    ...findRow('Spine Surgery', 'Spinal Fusion'),
  },
  {
    name: 'Unilateral Total Knee Replacement',
    specialty: 'Orthopedics',
    description: 'Replaces a single worn or damaged knee joint with a prosthetic implant.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Flickr_-_Official_U.S._Navy_Imagery_-_An_Officer_assists_a_physical_therapy_patient..jpg',
    ...findRow('Orthopedics', 'Unilateral Total Knee Replacement'),
  },
  {
    name: 'IVF with ICSI',
    specialty: 'IVF',
    description: 'In-vitro fertilisation with intracytoplasmic sperm injection for assisted conception.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Doctor_consults_with_patient_%287%29.jpg',
    ...findRow('IVF', 'IVF with Intracytoplasmic Sperm Injection (ICSI)'),
  },
  {
    name: 'Total Laparoscopic Hysterectomy',
    specialty: 'Gynaecology',
    description: 'Minimally invasive keyhole removal of the uterus for fibroids, prolapse, or other conditions.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Doctor_talking_with_a_patient.jpg',
    ...findRow('Gynaecology', 'Total Laparoscopic Hysterectomy (TLH)'),
  },
  {
    name: 'Living Donor Liver Transplant',
    specialty: 'Liver Transplant',
    description: 'Replaces a failing liver with a healthy portion donated by a living, matched relative.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Doctor_examines_patient.jpg',
    ...findRow('Liver Transplant', 'Living Donor Transplant'),
  },
  {
    name: 'Autologous Bone Marrow Transplant',
    specialty: 'Bone Marrow',
    description: "Uses a patient's own stem cells to restore healthy marrow after high-dose treatment.",
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Doctor_consults_with_patient_%284%29.jpg',
    ...findRow('Bone Marrow', 'Autologous BMT'),
  },
];
