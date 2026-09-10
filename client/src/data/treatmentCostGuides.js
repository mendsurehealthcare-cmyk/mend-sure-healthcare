/*
  Static cost-guide content for the Treatments page, one entry per specialty.
  Each specialty's cards on the page are replaced by these tables — see
  Treatments.jsx — for the same reason Cardiac Surgery's are (see
  CardiacSurgeryCostGuide.jsx): this is reference content with ranges and
  multiple currencies the `treatments` table has no columns for, not a
  bookable catalog entry that needs its own detail page.

  Every number below is reproduced as supplied. Two small, disclosed changes
  were made for a consistent look across all nine guides, not to the prices
  themselves:
    - Column headers are normalised to "Cost in India (INR)" / "(USD)" (or a
      close variant) throughout, in place of each source table's own wording
      ("Average Cost (INR)", "Cost In INR", "INR (Min-Max)", ...).
    - Thousands separators and the range dash are made consistent (comma
      grouping throughout, "–" rather than "-").
  One number was corrected rather than reproduced as-is: Spine Surgery's
  Microdiscectomy USD range was supplied as "3,4000 – 6,000", a malformed
  five-digit figure. Read as a stray zero, it's shown here as "$3,400 –
  6,000" — worth confirming against the source rather than trusting this
  guess.

  IVF and Liver Transplant were supplied as bare tables with no heading, so
  their `title` here is invented to match the naming pattern of the other
  seven ("Average Cost of ... in India") rather than quoted from a source.
*/
export const TREATMENT_COST_GUIDES = {
  Oncology: [
    {
      title: 'Costs for Different Cancer Treatments in India',
      subtitle: "Here's the average cost for different cancer treatments in India:",
      columns: ['Type of Cancer', 'Cost in India (INR)', 'Cost in India (USD)'],
      rows: [
        ['Lung Cancer', '₹4,50,000', '$10,500'],
        ['Breast Cancer', '₹2,00,000', '$5,000'],
        ['Ovarian Cancer', '₹6,00,000', '$7,500'],
        ['Cervical Cancer', '₹2,00,000', '$5,000'],
        ['Esophageal Cancer', '₹4,00,000', '$9,000'],
        ['Stomach Cancer', '₹2,00,000', '$5,000'],
        ['Liver Cancer', '₹4,50,000', '$10,500'],
        ['Gallbladder Cancer', '₹4,00,000', '$9,000'],
        ['Pancreatic Cancer', '₹6,00,000', '$13,000'],
        ['Colon Cancer', '₹3,00,000', '$7,000'],
        ['Rectum Cancer', '₹3,00,000', '$7,000'],
        ['Prostate Cancer', '₹2,50,000', '$6,000'],
        ['Kidney Cancer', '₹3,25,000', '$7,500'],
        ['Head and Neck Cancer', '₹2,25,000', '$5,500'],
        ['Brain Tumours', '₹5,00,000', '$7,500'],
        ['Blood Cancer', '₹6,00,000', '$22,500'],
      ],
      note: 'Costs are approximate and can vary based on the hospital, location, and specific treatment requirements.',
    },
  ],

  Neurosurgery: [
    {
      title: 'Cost of Different Neurosurgeries in India',
      columns: ['Type of Surgery', 'Cost in India (INR)', 'Cost in India (USD)'],
      rows: [
        ['Brain Tumour Resection', '₹3,00,000 – 5,00,000', '$6,000 – 9,000'],
        ['Deep Brain Stimulation (DBS)', '₹10,00,000 – 20,00,000', '$22,000 – 28,000'],
        ['Craniotomy', '₹2,00,000 – 8,00,000', '$4,500 – 9,500'],
        ['Gamma Knife Surgery', '₹3,80,000 – 4,60,000', '$7,000 – 8,000'],
        ['CyberKnife', '₹3,00,000 – 4,50,000', '$6,000 – 8,000'],
        ['Pituitary Tumour Surgery', '₹3,00,000 – 5,00,000', '$5,000 – 9,000'],
      ],
    },
  ],

  'Spine Surgery': [
    {
      title: 'Cost of Different Spine Surgeries in India',
      columns: ['Type of Surgery', 'Cost in India (INR)', 'Cost in India (USD)'],
      rows: [
        ['Laminectomy', '₹2,00,000 – 3,50,000', '$3,000 – 6,000'],
        ['Foraminotomy', '₹1,50,000 – 2,50,000', '$2,500 – 4,500'],
        ['Discectomy', '₹1,50,000 – 2,75,000', '$2,500 – 4,500'],
        // Source gave "3,4000 – 6,000" — see the file header note.
        ['Microdiscectomy', '₹2,00,000 – 3,50,000', '$3,400 – 6,000'],
        ['Corpectomy', '₹2,50,000 – 4,50,000', '$4,000 – 7,500'],
        ['Spinal Osteotomy', '₹3,00,000 – 5,00,000', '$5,000 – 8,000'],
        ['Spinal Fusion', '₹3,00,000 – 5,00,000', '$5,000 – 8,000'],
        ['Artificial Disc Replacement', '₹4,00,000 – 6,00,000', '$6,000 – 10,000'],
        ['Minimally Invasive Procedures', '₹1,50,000 – 4,00,000', '$2,500 – 6,500'],
        ['Minimally Invasive Surgery', '₹4,00,000 – 6,00,000', '$8,000 – 11,000'],
      ],
    },
  ],

  Orthopedics: [
    {
      title: 'Average Cost of Various Orthopaedic Surgeries in India',
      columns: ['Procedure', 'Cost in India (INR)', 'Cost in India (USD)'],
      rows: [
        ['Bilateral Total Knee Replacement', '₹5,25,000', '$9,250'],
        ['Unilateral Total Knee Replacement', '₹3,50,000', '$6,200'],
        ['Arthroscopy', '₹4,00,000', '$5,000'],
        ['Joint Revision Surgery', '₹4,00,000', '$7,000'],
        ['Foot and Ankle Surgery', '₹3,50,000', '$6,250'],
      ],
    },
  ],

  IVF: [
    {
      title: 'Average Cost of IVF Treatments in India',
      columns: ['Procedure', 'Cost in India (INR)', 'Cost in India (USD)'],
      rows: [
        ['IVF with Intracytoplasmic Sperm Injection (ICSI)', '₹1,50,000 – 2,00,000', '$3,500 – 4,000'],
        ['IVF with Donor Eggs', '₹2,60,000 – 3,20,000', '$5,500 – 6,000'],
        ['IVF with Donor Sperm', '₹2,90,000', '$5,000'],
        ['Frozen Embryo Transfer (FET)', '₹23,800', '$400'],
      ],
    },
  ],

  Gynaecology: [
    {
      title: 'Average Cost of Various Gynaecological Surgeries in India',
      columns: ['Procedure', 'Cost in India (INR)', 'Cost in India (USD)'],
      rows: [
        ['Dilation and Curettage (D&C)', '₹35,000', '$600'],
        ['Hysteroscopy', '₹65,000', '$1,100'],
        ['Total Laparoscopic Hysterectomy (TLH)', '₹3,20,000', '$5,500'],
        ['Laparoscopic Myomectomy', '₹2,80,000', '$5,000'],
        ['Laparoscopic Endometriosis Surgery', '₹3,50,000', '$6,250'],
        ['Laparoscopic Polypectomy', '₹65,000', '$1,100'],
        ['Laparoscopic Oophorectomy', '₹1,75,000', '$3,100'],
        ['Laparoscopic Cystectomy', '₹1,50,000', '$2,700'],
      ],
    },
  ],

  'Liver Transplant': [
    {
      title: 'Average Cost of Liver Transplant in India',
      columns: ['Donor Type', 'Cost in India (INR)', 'Cost in India (USD)'],
      rows: [
        ['Living Donor Transplant', '₹16,00,000 – 18,00,000', '$25,000 – 32,000'],
        ['Deceased Donor Transplant', '₹20,00,000 – 22,00,000', '$33,000 – 36,000'],
      ],
    },
  ],

  'Bone Marrow': [
    {
      title: 'What Affects the Cost of a Bone Marrow Transplant in India?',
      subtitle:
        'BMT pricing in India varies mainly with the type of transplant, the donor source, the facility, and any complications. The most common factor is the type of transplant itself — autologous, allogeneic, or umbilical cord blood.',
      columns: ['Type of BMT', 'Cost in India (INR)', 'Cost in India (USD)'],
      rows: [
        ['Autologous BMT', '₹8,15,000 – 10,00,000', '$15,000 – 18,000'],
        ['Allogeneic BMT', '₹14,00,000 – 14,50,000', '$25,000 – 26,000'],
      ],
    },
  ],
};
