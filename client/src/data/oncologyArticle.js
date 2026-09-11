// Patient-education content for the Oncology cost guide
// (rendered via client/src/components/TreatmentArticleGuide.jsx). Supplied by
// Mend Sure and reproduced as given, in the same intro-plus-Q&A-headed
// structure it was written in.

export const ONCOLOGY_INTRO =
  'A diagnosis of cancer is one of those things in medicine that instigates a whole truckload of questions from the patient and their relatives. Questions like, what is it?, is it curable?, what’s the treatment like?, and can I still live my life like before? All of them are valid and should be answered honestly and straightforwardly. This guide aims to be such a reference, as to provide the answers to these exact questions. It will briefly outline what cancer actually is, what kinds of treatment are usually used, and give a rundown of what to expect from the diagnosis, treatment, and post-treatment process.';

export const ONCOLOGY_ARTICLE_SECTIONS = [
  {
    heading: 'What is cancer?',
    body: [
      'Cancer refers to a vast range of diseases that share a set of characteristics. The most important of these is that cancerous cells begin to proliferate uncontrollably. These cells have the ability to form lumps or masses, commonly referred to as tumours, and oftentimes cancerous cells can be found in more than one place in the body.',
      'Due to this broad range of possibilities, cancer can be extremely complex and is best treated in accordance with the particular kind and severity of the case.',
      'The medical discipline that studies cancer is called oncology, and the professionals who specialise in treating it are oncologists.',
    ],
  },
  {
    heading: 'How is cancer treated?',
    body: [
      'The kinds of treatment used for cancer depend on various factors, such as the kind of cancer, where it is located, and how advanced is it. Most commonly, more than one course of treatment is combined in order to combat cancer as efficiently as possible. The primary methods of cancer treatment are as follows:',
      'Surgery – the detachment of tumours and affected tissues, lymph nodes if necessary. It is usually used to remove cancerous masses that are located in a particular part of the body.',
      'Chemotherapy – a systemic treatment which uses medication to kill cancerous cells or prevent them from dividing further.',
      'Radiation therapy – the use of high-energy beams to damage cancer cells’ structure and kill them. Unlike chemotherapy, it is local and only affects the area it is aimed at, which makes it useful for shrinking tumours before surgery, cleaning up after, or acting as a standalone treatment.',
      'Targeted therapy – a relatively new tool that involves the use of medication to interfere with certain mechanisms within cancerous cells. Targeted drugs usually affect healthy cells less, and therefore are often used in conjunction with other methods.',
      'Immunotherapy – an innovative way of fighting cancer that involves boosting the body’s natural defences against it.',
      'Hormone therapy – the use of medication to block hormones that may cause cancerous cells to grow.',
      'Stem cell (bone marrow) transplant – replaces blood-forming cells destroyed by cancer or other treatments; most commonly used for blood cancers.',
      'An oncologist will determine the optimal combination of the tools listed above based on the patient’s case.',
    ],
  },
  {
    heading: 'What are the most common cancers, and how are they treated?',
    body: [
      'There is a long list of diseases that fall under the umbrella term of cancer, but most of them share common characteristics and treatment modalities. Every cancer is named based on the part of the body it originates from. The most prevalent cancers and their treatment options are listed below.',
      'Lung cancer occurs when tumours develop on the lung tissue. Surgery is usually performed to remove either a segment or an entire lung, depending on the size and location of the tumour; it is often combined with chemo- and radiotherapy.',
      'Breast cancer tumours develop on the breast tissue. Surgery is used to remove the tumour and the affected tissue, followed by radiotherapy to prevent recurrence. Other methods include chemotherapy, immunotherapy, targeted therapy, or hormone therapy, depending on the case.',
      'Gynaecological cancers originate in the female reproductive system; ovarian cancer is particularly common amongst them. Surgery, chemo-, and radiotherapy are usually used to treat it, alongside hormone therapy. Cervical cancer is treated similarly, although each case is approached individually.',
      'GI cancers refer to tumours that develop in the digestive tract; this includes the oesophagus, stomach, liver, gallbladder, pancreas, colon, and rectum. Surgery is performed to remove the affected tissue, followed by chemo- or radiotherapy and other treatments if needed.',
      'Prostate cancer occurs when malignant cells develop in the prostate gland. Surgery, radiotherapy, hormone therapy, or chemotherapy can be used to treat it, depending on the case.',
      'Kidney cancer tumours develop in the kidneys. Surgery is usually performed to remove either the affected part of the kidney or the entire organ, often followed by immunotherapy, targeted therapy, or radiotherapy.',
      'Head and neck cancers develop in the tissues of the mouth, throat, and other related organs. Surgery, radiotherapy, and chemo are used to treat it in combination with each other.',
      'Brain tumours are growths that develop in the brain tissue. Surgery is usually done to remove as much of it as possible, followed by radiotherapy and chemo.',
      'Leukaemia, lymphoma, myeloma, and other blood cancers affect blood cells and the bone marrow. They are usually treated with chemo, radiotherapy, targeted therapy, and sometimes a stem cell transplant.',
    ],
  },
  {
    heading: 'What are the warning signs of cancer?',
    body: [
      'Unfortunately, there are many common cancer symptoms that should prompt a person to consult a medical professional. These symptoms are not specific to any particular cancer, but they can point to its occurrence nonetheless. They include:',
      'Finding a lump anywhere on the body.',
      'Unusual bleeding or discharge.',
      'A sore that does not appear to be healing.',
      'Changes in bowel or bladder habits, difficulty swallowing.',
      'Persistent cough or hoarseness.',
      'Unexpected weight loss.',
      'Unusual tiredness or general unwellness.',
      'None of these symptoms necessarily indicate cancer, but they should prompt a visit to the hospital for further research and tests. Early diagnosis is critical for successfully treating most cancers.',
    ],
  },
  {
    heading: 'How is cancer diagnosed?',
    body: [
      'A cancer diagnosis is usually made in stages. First, a physician examines the patient and might run some tests to confirm the suspicion; next, imaging procedures (ultrasound, CT scans, MRI, PET scans) are used to locate the tumour. However, a definitive diagnosis of cancer can only be made by taking a tissue sample for testing; this procedure is called a biopsy.',
      'After a cancer diagnosis has been confirmed, it is necessary to determine its stage; this means deciding how much it has developed and whether it has metastasized. Staging is crucial to determine the treatment strategy, as well as the prognosis of the case.',
    ],
  },
  {
    heading: 'Can cancer be cured?',
    body: [
      'Unfortunately, there is no universal answer to this question. Each case must be considered individually, as the prognosis strongly depends on the cancer’s type, stage, and other factors. Nevertheless, there are many cancers that can be successfully treated in the majority of cases if caught early enough. That is why it is so important to receive a medical evaluation if any suspicious symptoms present themselves.',
    ],
  },
  {
    heading: 'What are the side effects of cancer treatment?',
    body: [
      'The side effects of cancer treatment vary depending on the method or methods used. For example, chemotherapy is notorious for having a wide range of unpleasant side effects, such as vomiting, fatigue, and loss of hair. However, they are usually temporary and cease with the end of treatment. Other methods, such as radiotherapy or surgery, have their own implications, which can also be managed effectively. Targeted therapy and immunotherapy usually have fewer side effects, although they affect each patient differently.',
      'The oncology team will always take these side effects into account and prescribe medication to manage them if necessary. In most cases, any discomfort is short-term and disappears after treatment has ended.',
    ],
  },
  {
    heading: 'How long does cancer treatment last?',
    body: [
      'The duration of treatment depends on the type of cancer and the strategy used to fight it. Sometimes, a single surgery may be enough to remove an isolated tumour; in other cases, treatment may involve weeks or months of radiotherapy or chemotherapy. Some medications, such as hormone blockers or targeted drugs, may need to be taken for an extended period of time in order to keep the cancer at bay. The oncology team will determine a suitable schedule for the patient’s case.',
    ],
  },
  {
    heading: 'What happens after cancer treatment?',
    body: [
      'When treatment ends, it marks the beginning of another crucial stage in the fight against cancer. All patients who have finished treatment must undergo regular checkups in order to ensure that the cancer does not recur. In addition, these checkups allow the medical team to monitor the patient’s status and treat any lingering effects of treatment. This process is referred to as follow-up care, and it is necessary for everyone who has survived cancer. The frequency and duration of follow-up care vary depending on each individual case.',
    ],
  },
  {
    heading: 'Who should I consult for cancer treatment?',
    body: [
      'An oncologist is trained to fight cancer in all its various forms. There are several different kinds of them, however: a medical oncologist, a radiation oncologist, and a surgical oncologist. Depending on the case, the patient might also need to consult other medical professionals, such as a hemato-oncologist or a gynaecologic oncologist. These specialists work together in order to determine the optimal course of treatment and create a suitable treatment plan.',
    ],
  },
];

export const ONCOLOGY_FAQS = [
  {
    q: 'Can cancer be contagious?',
    a: 'No, cancer cannot be transmitted from one person to another.',
  },
  {
    q: 'Does having a family history of cancer put me at higher risk?',
    a: 'It might, although it is not necessarily a guarantee. There are some cancers that are directly linked to genetic disposition. It is best to undergo genetic testing in order to determine if you are at risk.',
  },
  {
    q: 'Will I lose my hair during treatment?',
    a: 'It depends on the medication you are given, since there are several types of cancer drugs. Hair loss is typically temporary, although it can also be permanent in some cases.',
  },
  {
    q: 'Can I continue working during treatment?',
    a: 'It depends on how you feel, but you might be able to do so, especially if you undergo less aggressive treatment. Some people choose to limit their workload during treatment.',
  },
  {
    q: 'Does cancer treatment hurt?',
    a: 'Cancer treatment itself is not painful, although there may be certain procedures involved that can cause some discomfort. In those cases, there are usually options to alleviate the pain; it is recommended to explore what methods are most suitable for you.',
  },
  {
    q: 'Why is early detection so important?',
    a: 'Cancer is much easier to treat when it is caught at an early stage, so it is critical to seek medical attention as soon as possible after suspecting it. Early detection enables much more treatment options and leads to better outcomes overall.',
  },
];
