// Patient-education content for the Kidney Transplant guide (rendered via
// client/src/components/TreatmentArticleGuide.jsx), in the same
// intro-plus-Q&A-headed structure as liverTransplantArticle.js.
//
// Unlike the other guides, this text and its prices were NOT supplied by
// Mend Sure: they were written from general medical knowledge and published
// Delhi NCR price estimates (Credihealth, Bookimed, Nov 2026) and should be
// reviewed by Mend Sure's medical team before relying on them.
//
// The price table lives here rather than in TREATMENT_COST_GUIDES so Kidney
// Transplant doesn't also become a filter chip / home-page specialty tile —
// it's reached from its Popular Treatments card only.

export const KIDNEY_TRANSPLANT_PRICE_TABLES = [
  {
    title: 'Average Cost of Kidney Transplant in India',
    subtitle:
      'Package prices vary with the hospital, room category, donor type, and the recipient’s health. Lifelong anti-rejection medicines after discharge are an additional ongoing cost.',
    columns: ['Donor Type', 'Cost in India (INR)', 'Cost in India (USD)'],
    rows: [
      ['Living Donor Transplant', '₹5,50,000 – 11,00,000', '$6,500 – 13,500'],
      ['ABO-Incompatible Transplant', '₹9,00,000 – 14,00,000', '$11,000 – 17,000'],
      ['Deceased Donor Transplant', '₹6,00,000 – 12,00,000', '$7,000 – 14,500'],
    ],
  },
];

// Nephrologists and urologists in the directory who handle kidney
// transplants — there is no "Kidney Transplant" specialty to filter on.
export const KIDNEY_TRANSPLANT_DOCTOR_SLUGS = [
  'dr-anant-kumar',
  'dr-sanjay-gogoi',
  'dr-anil-mandhani',
  'dr-shafiq-ahmed',
  'dr-pradeep-kumar-bansal',
  'dr-saurabh-pokhriyal',
  'dr-salil-jain',
  'dr-gagan-deep-chhabra',
];

export const KIDNEY_TRANSPLANT_INTRO =
  'Being told that your kidneys are failing can feel overwhelming. A kidney transplant is the most effective long-term treatment for end-stage kidney disease, offering a longer life, more energy and freedom from dialysis compared with staying on dialysis. India is one of the world’s leading destinations for kidney transplants, with experienced transplant teams and costs far below those in the US or UK. Here you’ll find what a kidney transplant involves, who can donate, what happens before and after surgery, and what it costs.';

export const KIDNEY_TRANSPLANT_ARTICLE_SECTIONS = [
  {
    heading: 'What do the kidneys do?',
    body: [
      'The kidneys filter waste and excess fluid from the blood, keep the body’s salt and mineral balance steady, help control blood pressure, and produce hormones that support red blood cell production and bone health.',
      'When both kidneys lose most of their function — known as end-stage kidney disease (ESKD) — waste builds up in the body and the patient needs either dialysis or a transplant to survive.',
    ],
  },
  {
    heading: 'What is a kidney transplant?',
    body: [
      'A kidney transplant is a surgical procedure in which a healthy kidney from a donor is placed into a patient whose own kidneys have failed. Only one kidney is needed to live a normal life.',
      'The new kidney is usually placed in the lower abdomen and connected to the blood vessels and the bladder. In most cases the patient’s own kidneys are left in place.',
    ],
  },
  {
    heading: 'When is a kidney transplant needed?',
    body: [
      'A transplant is considered when kidney function falls to end-stage levels. The most common causes are:',
      'Diabetes.',
      'High blood pressure.',
      'Chronic glomerulonephritis (inflammation of the kidney’s filters).',
      'Polycystic kidney disease.',
      'Other inherited or long-term kidney conditions.',
    ],
  },
  {
    heading: 'What are the types of kidney transplant?',
    body: [
      'Living donor kidney transplant: A healthy person, usually a close family member, donates one of their two kidneys. This is the most common type in India, can be planned in advance, and generally gives the best long-term results.',
      'Deceased donor kidney transplant: The kidney comes from a donor who has died and whose family has consented to organ donation. Patients are placed on a waiting list, which can be long.',
      'ABO-incompatible transplant: Where the donor’s blood group doesn’t match the recipient’s, special treatment before surgery can still make a transplant possible, at a higher cost.',
    ],
  },
  {
    heading: 'Who can be a donor?',
    body: [
      'Under Indian law (the Transplantation of Human Organs and Tissues Act), living donors are usually close relatives — parents, children, siblings, spouses or grandparents. Donations from others require approval from a hospital authorisation committee.',
      'International patients must bring a related donor from their home country, along with documents proving the relationship, which are verified by the hospital and their country’s embassy.',
      'Every donor is fully tested to make sure donating is safe for them. Most donors return to normal life within a few weeks and live healthy lives with one kidney.',
    ],
  },
  {
    heading: 'What tests are done before a transplant?',
    body: [
      'Both recipient and donor go through a full evaluation, including blood and urine tests, blood group and tissue (HLA) matching, a cross-match test, heart and lung checks, imaging of the kidneys and blood vessels, and screening for infections. These steps make sure the transplant is safe and the kidney is a good match.',
    ],
  },
  {
    heading: 'What happens during and after the surgery?',
    body: [
      'The surgery is done under general anaesthesia and usually takes three to four hours. The donor kidney is most often removed by keyhole (laparoscopic) surgery, which means less pain and a quicker recovery for the donor.',
      'The recipient is monitored closely after surgery and usually stays in hospital for one to two weeks; the donor is typically discharged within a week. International patients are generally advised to stay in India for about four to six weeks for follow-up checks.',
    ],
  },
  {
    heading: 'What is life like after a kidney transplant?',
    body: [
      'Most recipients return to work and normal activities within a few months. The key points to remember are:',
      'Taking anti-rejection (immunosuppressive) medicines exactly as prescribed, for life.',
      'Attending regular blood tests and check-ups so any sign of rejection is caught early.',
      'Taking extra care to avoid infections, since the immune system is suppressed.',
      'Following a healthy diet, staying active and keeping blood pressure and blood sugar under control.',
    ],
  },
  {
    heading: 'Which specialist should I see?',
    body: [
      'A kidney transplant is handled by a team. A nephrologist (kidney specialist) manages your kidney disease, decides whether you are a transplant candidate and looks after you long-term. A transplant surgeon or urologist performs the surgery, supported by anaesthetists, transplant coordinators and nurses.',
    ],
  },
];

export const KIDNEY_TRANSPLANT_FAQS = [
  {
    q: 'How long does the surgery take?',
    a: 'A kidney transplant usually takes around three to four hours.',
  },
  {
    q: 'Is it safe to donate a kidney?',
    a: 'Donors are carefully tested before approval. A healthy person can live a normal life with one kidney, and most donors recover within a few weeks.',
  },
  {
    q: 'How long will I need to stay in India?',
    a: 'Recipients typically spend one to two weeks in hospital and are advised to stay in India for about four to six weeks in total for follow-up.',
  },
  {
    q: 'Will my body reject the new kidney?',
    a: 'Rejection is possible, which is why anti-rejection medicines are taken for life and you are monitored closely. Rejection caught early can usually be treated.',
  },
  {
    q: 'How long does a transplanted kidney last?',
    a: 'Many transplanted kidneys work well for 15 to 20 years or more, especially from living donors, depending on the patient’s health and how closely they follow their care plan.',
  },
  {
    q: 'Can I get a transplant if my donor’s blood group doesn’t match?',
    a: 'Often, yes. An ABO-incompatible transplant uses extra treatment before surgery to make it possible, though it costs more.',
  },
];
