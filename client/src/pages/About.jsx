import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import Button from '../components/Button';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';

// Placeholder artwork, same as the hero images on Home, Hospitals, and
// HowItWorks — swap this for your own photograph of the care team or a partner
// facility. A real photo of real people is worth considerably more here than
// stock imagery. See the "Before You Launch" checklist in the README.
const ABOUT_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCufdBhQRB3aOi-VToAAVIXhTEN8OUX7P-OTTAH5l9YL9D7qXytVZguRJ3e1zthNkxvkbdP7Q0YzIphzUQEWMg4xVbh5a2QNWlTSaC-_TkZ6ELGpHTQ5HtWegTY006WpnQJQVNo8nt8100c50VcDOPxDmFUG2oAbv_HC48UUB8WV6-mjvrEH6RjaMsyfcxOypqu4Sssn6tqqGznJdgiBjMVt_GWgm8JFPYk6Ukb3DQWgDHJUjO1WXBd';

/*
  Partner hospitals, grouped by city.

  Grouping matters here: an undifferentiated list of twelve names reads as a
  wall of text, while "four in Gurgaon, seven in Delhi" is a claim a reader can
  actually take in. The names are the single most credibility-carrying element
  on this page, so they're set plainly and left to speak for themselves rather
  than dressed up with logos we don't have rights to.
*/
const hospitalGroups = [
  {
    city: 'Gurgaon',
    hospitals: [
      'Artemis Hospital',
      'CK Birla Hospital',
      'Fortis Hospital, Manesar',
      'Fortis Memorial Research Institute',
      'Marengo Asia Hospitals, Gurgaon',
      'Max Super Speciality Hospital, Gurgaon',
      'Medanta – The Medicity',
      'Paras Hospital',
      'Shalby Sanar International Hospital',
    ],
  },
  {
    city: 'Delhi',
    hospitals: [
      'Aakash Healthcare Super Speciality Hospital',
      'BLK-Max Super Speciality Hospital',
      'Delhi Heart and Lung Institute',
      'Fortis Escorts Heart Institute, Okhla',
      'Fortis Hospital, Shalimar Bagh',
      'Fortis Hospital, Vasant Kunj',
      'IBS Institute of Brain and Spine',
      'Indian Spinal Injuries Centre',
      'Indraprastha Apollo Hospital',
      'Institute of Liver and Biliary Sciences',
      'Manipal Hospital, Dwarka',
      'Max Smart Super Speciality Hospital, Saket',
      'Max Super Speciality Hospital, Panchsheel Park',
      'Max Super Speciality Hospital, Patparganj',
      'Max Super Speciality Hospital, Saket',
      'Max Super Speciality Hospital, Shalimar Bagh',
      'Max Super Speciality Hospital, Vaishali',
      'National Heart Institute',
      'Primus Super Speciality Hospital',
      'Venkateshwar Hospital',
      'Vimhans Nayati Super Specialty Hospital',
    ],
  },
  {
    city: 'Faridabad',
    hospitals: [
      'Asian Institute of Medical Sciences',
      'Fortis Escorts Hospital, Faridabad',
      'Marengo Asia Hospitals, Faridabad',
      'Metro Hospital, Faridabad',
      'Sarvodaya Hospital',
      'SSB Heart and Multispecialty Hospital',
    ],
  },
  {
    city: 'Noida',
    hospitals: [
      'Fortis Hospital, Noida Sector 62',
      'Max Super Speciality Hospital, Sector 128',
      'Yashoda Hospital & Research Centre, Ghaziabad',
    ],
  },
];

const assistance = [
  { icon: 'person_search', text: 'Help in choosing the right doctors and specialists for your condition' },
  { icon: 'domain_verification', text: 'Coordinating with the best hospital for your specific medical needs' },
  { icon: 'request_quote', text: 'Providing treatment options, as well as treatment cost quotation' },
  { icon: 'approval', text: 'Medical visa assistance' },
  { icon: 'flight_takeoff', text: 'Assistance with travel, airport transfers, and accommodation' },
  { icon: 'translate', text: 'Translating and interpreter services' },
  { icon: 'local_pharmacy', text: 'Pharmacy and nursing support services' },
];

const values = [
  {
    icon: 'favorite',
    title: 'The patient comes first',
    text: 'Every decision starts with one question: what is best for the person in our care? Comfort, clarity, and dignity are never optional extras.',
  },
  {
    icon: 'fact_check',
    title: 'Honesty in everything',
    text: 'Clear estimates, realistic expectations, and no hidden surprises. We would rather tell you the hard truth than an easy half-answer.',
  },
  {
    icon: 'support_agent',
    title: 'Care beyond the clinic',
    text: 'Healing is more than a procedure. We look after the travel, the family, the language, and the in-between moments that matter.',
  },
  {
    icon: 'workspace_premium',
    title: 'Excellence you can trust',
    text: 'We partner only with accredited hospitals and experienced specialists, so world-class medicine sits behind every recommendation we make.',
  },
  {
    icon: 'public',
    title: 'Compassion without borders',
    text: 'Wherever you come from, whatever language you speak, you are welcome here — and you will never feel like a stranger in our care.',
  },
];

const reasons = [
  { icon: 'verified', title: "India's trusted network of hospitals" },
  { icon: 'stethoscope', title: 'Expert doctors and state-of-the-art facilities' },
  { icon: 'payments', title: 'Transparent and budget-friendly costs' },
  { icon: 'support_agent', title: 'End-to-end personalised patient support' },
  { icon: 'handshake', title: 'A partner you can trust, with informed guidance' },
];

const pillars = [
  {
    icon: 'diagnosis',
    title: 'Expert Doctors, Cutting-Edge Infrastructure',
    body: 'When travelling abroad for treatment, it is essential that you have absolute confidence in the skill of the doctors and paramedical staff providing your care. Through our network of hospitals, our patients have access to some of the most qualified doctors and surgeons, who provide world-class treatment with the support of cutting-edge technology and infrastructure.',
    note: 'Our partner hospitals offer comprehensive care and support to our global patients in top-class, state-of-the-art facilities.',
  },
  {
    icon: 'savings',
    title: 'World-Class Care at Competitive Prices',
    body: 'When it comes to medical treatment, one of the biggest concerns is always the cost. Travelling abroad for treatment is a big commitment — but one of the major benefits of choosing India is the competitive edge it has over other countries when it comes to cost.',
    note: 'Thanks to our partnerships, we can offer treatment options and quotations you would not find elsewhere: the best standard of care, at prices that fit your budget.',
  },
];

const totalHospitals = hospitalGroups.reduce((sum, group) => sum + group.hospitals.length, 0);

/*
  The image beside the opening statement.

  Falls back to a branded panel rather than a broken-image icon if the source
  fails to load — the current URL is externally hosted and outside our control,
  and a broken image on the page that exists to build trust is worse than no
  image at all.
*/
function AboutImageCard() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary-fixed shadow-xl">
      <div className="aspect-[4/3] w-full">
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-space-md bg-primary-fixed p-space-xl text-center">
            <img src="/logo-mark.png" alt="" className="h-20 w-20 opacity-90" />
            <p className="text-body-md text-on-primary-fixed-variant">
              Trusted hospitals across Delhi NCR
            </p>
          </div>
        ) : (
          <img
            src={ABOUT_IMAGE}
            alt="A Mendsure care coordinator supporting an international patient"
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* A factual caption rather than decoration — it previews the network
          section further down and gives the image a reason to be there. */}
      {!failed && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/95 to-transparent p-space-lg pt-space-2xl">
          <div className="flex items-center gap-space-sm text-on-primary">
            <Icon name="local_hospital" className="!text-[22px] text-secondary-container" />
            <div>
              <p className="text-label-md font-semibold">
                {totalHospitals} partner hospitals
              </p>
              <p className="text-body-sm text-primary-fixed-dim">
                Across Delhi, Gurgaon, Faridabad &amp; Noida
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  // Which city's hospitals show in the network section below. A single
  // active city rather than four side-by-side lists — Delhi alone has more
  // than twice as many hospitals as the other three cities combined, so
  // showing every city as its own column left three short cards dwarfed by
  // one towering one instead of a balanced grid.
  const [selectedCity, setSelectedCity] = useState(hospitalGroups[0].city);
  const activeGroup = hospitalGroups.find((group) => group.city === selectedCity) ?? hospitalGroups[0];

  useDocumentMeta({
    title: 'About MENDSURE — Trusted Medical Travel and Healthcare Support in India',
    description:
      "MENDSURE bridges international patients with India's premier hospitals and specialist doctors — with personalised support, and clear costs at every step.",
  });

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow={t('pages.about.eyebrow')}
        eyebrowIcon="diversity_1"
        title={t('pages.about.title')}
        subtitle={t('pages.about.subtitle')}
      />

      {/* Opening statement, set beside an image.
          Text left, picture right: a lone centred column of prose on an
          otherwise empty band reads as an unfinished page, and the image gives
          the eye somewhere to land. The column stacks above the image on
          narrow screens so the words still come first. */}
      <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-2">
          <div className="max-w-xl">
            <span className="mb-space-sm block text-label-sm font-bold tracking-widest text-secondary uppercase">
              Why We Exist
            </span>

            <p className="mb-space-lg text-headline-sm leading-relaxed font-normal text-on-surface">
              The decision to seek medical treatment is one of the most personal decisions anyone
              can make. When that care is in another country, it is essential that you feel
              completely at ease and confident in the help you are receiving.
            </p>

            <div className="space-y-space-md text-body-lg leading-relaxed text-on-surface-variant">
              <p>
                At Mendsure Healthcare Services, we connect international patients with trusted
                hospitals, experienced specialists, advanced medical technology, and personalised
                healthcare in India.
              </p>
              <p>
                From your first medical inquiry to treatment, travel, accommodation, and follow-up
                care, our team helps make your healthcare journey trusted, transparent, affordable,
                and stress-free.
              </p>
            </div>
          </div>

          <AboutImageCard />
        </div>
      </section>

      {/* Vision, mission, and the values behind every patient interaction. */}
      <section className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-xl">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Care That Travels With You"
            title="Our Vision & Mission"
            subtitle="We help patients from around the world reach world-class treatment in India — and we walk beside them at every step, because healing should never feel like a journey taken alone."
          />

          <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-2">
            <div className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:p-space-xl">
              <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <Icon name="visibility" className="!text-[24px]" />
              </div>
              <h3 className="mb-space-sm text-headline-md font-bold text-balance text-primary">
                Our Vision
              </h3>
              <p className="mb-space-md border-l-2 border-secondary pl-space-md text-body-md leading-relaxed font-medium text-on-surface">
                To be the trusted bridge that brings patients from every corner of the world to
                exceptional, affordable care in India — treating each person not as a case, but as
                someone's parent, partner, or child who deserves to be looked after with warmth and
                dignity.
              </p>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                For many families, life-changing treatment feels out of reach — priced beyond what
                they can afford at home. Our vision is a world where that distance disappears: where
                a diagnosis is met not with fear about cost, but with a clear, caring hand guiding
                the way to skilled doctors and real recovery.
              </p>
            </div>

            <div className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:p-space-xl">
              <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <Icon name="flag" className="!text-[24px]" />
              </div>
              <h3 className="mb-space-sm text-headline-md font-bold text-balance text-primary">
                Our Mission
              </h3>
              <p className="mb-space-md text-body-md leading-relaxed text-on-surface-variant">
                Every day, we work to make the path to treatment simple, safe, and human. We connect
                international patients with India's leading hospitals and specialists, and take
                care of everything around the medicine — the questions, the paperwork, the travel,
                the language, and the small worries that keep a family up at night.
              </p>
              <p className="mt-auto border-l-2 border-secondary pl-space-md text-body-md leading-relaxed text-on-surface">
                Our promise is straightforward: quality care, honest guidance, and a person you can
                count on from the first message to the flight home. We measure our success not in
                numbers, but in patients who arrive anxious and leave healed — and heard.
              </p>
            </div>
          </div>

          <p className="mx-auto mt-space-xl max-w-3xl text-center text-headline-sm leading-relaxed text-balance text-primary">
            We believe no one should have to choose between the care they need and the cost of
            getting it.
          </p>

          <h3 className="mt-space-2xl mb-space-lg text-center text-headline-md font-bold text-on-surface">
            Our Core Values
          </h3>

          <ul className="grid grid-cols-1 gap-space-md md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <li
                key={value.title}
                className="flex items-start gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
                  <Icon name={value.icon} className="!text-[20px]" />
                </div>
                <div>
                  <h4 className="text-label-md font-semibold text-on-surface">{value.title}</h4>
                  <p className="text-body-sm text-on-surface-variant">{value.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Hospital network — the credibility section. */}
      <section className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-xl">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Partner Network"
            title="A Network of Hospitals You Can Trust"
            subtitle="The success of any treatment starts with the hospitals and doctors providing it. We partner with world-class multi-speciality and super-speciality hospitals across Delhi NCR, known for excellent patient care, advanced technology, and international-standard facilities."
          />

          {/* One city active at a time, chosen with a pill row — same
              pattern as the hospital selector on Our Specialists. */}
          <div className="mb-space-xl flex flex-wrap justify-center gap-space-sm">
            {hospitalGroups.map((group) => {
              const active = group.city === selectedCity;
              return (
                <button
                  key={group.city}
                  type="button"
                  onClick={() => setSelectedCity(group.city)}
                  className={`flex items-center gap-space-xs rounded-full px-space-lg py-space-sm text-label-md font-semibold transition-colors ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <Icon name="location_on" className="!text-[18px]" />
                  {group.city}
                  <span
                    className={`rounded-full px-space-xs py-space-3xs text-label-sm ${
                      active
                        ? 'bg-on-primary/20 text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {group.hospitals.length}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-3">
            {activeGroup.hospitals.map((hospital) => (
              <div
                key={hospital}
                className="flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                  <Icon name="local_hospital" className="!text-[20px]" />
                </div>
                <span className="text-body-md font-medium text-on-surface">{hospital}</span>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-space-xl max-w-3xl text-center text-body-md text-on-surface-variant">
            {totalHospitals} of the country's most trusted hospitals, each equipped with the latest
            medical technology and highly qualified specialists, offering an international standard
            of care.
          </p>
        </div>
      </section>

      {/* Two pillars: clinical quality, and cost. */}
      <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-2">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:p-space-xl"
            >
              <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <Icon name={pillar.icon} className="!text-[24px]" />
              </div>
              <h3 className="mb-space-sm text-headline-md font-bold text-balance text-primary">
                {pillar.title}
              </h3>
              <p className="mb-space-md text-body-md leading-relaxed text-on-surface-variant">
                {pillar.body}
              </p>
              <p className="mt-auto border-l-2 border-secondary pl-space-md text-body-md leading-relaxed text-on-surface">
                {pillar.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* End-to-end assistance. */}
      <section className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-xl">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Personalised Patient Support"
            title="End-to-End Assistance, From First Enquiry to Recovery"
            subtitle="We coordinate every part of your medical travel — from the moment you first get in touch until you are home and recovering — so your experience is as comfortable and stress-free as possible."
          />

          <ul className="grid grid-cols-1 gap-space-md md:grid-cols-2">
            {assistance.map((item) => (
              <li
                key={item.text}
                className="flex items-start gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
                  <Icon name={item.icon} className="!text-[20px]" />
                </div>
                <span className="self-center text-body-md text-on-surface">{item.text}</span>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-space-xl max-w-3xl text-center text-body-md text-on-surface-variant">
            We tailor that support to each patient's individual requirements, so both you and your
            family have a smooth experience throughout.
          </p>
        </div>
      </section>

      {/* Why choose us — a compact checklist rather than more cards, so the
          page has a change of rhythm before the closing statement. */}
      <section className="mx-auto w-full max-w-4xl px-space-md py-space-3xl sm:px-space-xl">
        <SectionHeading eyebrow="In Short" title="Why Choose MENDSURE?" />

        <ul className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
          {reasons.map((reason) => (
            <li
              key={reason.title}
              className="flex items-center gap-space-sm rounded-lg bg-surface-container-lowest px-space-md py-space-sm shadow-sm"
            >
              <Icon name={reason.icon} className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-body-md font-medium text-on-surface">{reason.title}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing statement + CTA. */}
      <section className="mx-auto w-full max-w-7xl px-space-md pb-space-3xl sm:px-space-xl">
        <div className="rounded-2xl bg-primary p-space-lg text-center text-on-primary sm:p-space-3xl">
          <h2 className="mx-auto mb-space-md max-w-2xl text-headline-lg font-bold text-balance">
            Here to Help You Move Forward with Confidence
          </h2>
          <p className="mx-auto mb-space-lg max-w-2xl text-body-lg leading-relaxed text-primary-fixed-dim">
            By bringing together India's top hospitals, expert doctors, and our end-to-end
            personalised support, we help patients and families make informed decisions about their
            healthcare. Wherever your journey takes you, MENDSURE will help guide you through it.
          </p>

          {/* The brand's three-part promise, set apart as a closing line. */}
          <p className="mx-auto mb-space-xl flex flex-wrap items-center justify-center gap-x-space-sm gap-y-space-2xs text-label-md font-semibold tracking-wide text-secondary-container uppercase">
            <span>Clear Information</span>
            <span aria-hidden="true" className="opacity-50">
              ·
            </span>
            <span>Trusted Hospitals</span>
            <span aria-hidden="true" className="opacity-50">
              ·
            </span>
            <span>Personalised Support</span>
          </p>

          <div className="flex flex-wrap justify-center gap-space-md">
            <Button to="/contact" className="px-space-xl py-space-md">
              Get in Touch
              <Icon name="arrow_forward" className="!text-[18px]" />
            </Button>
            <Button to="/how-it-works" variant="onDark" className="px-space-xl py-space-md">
              See How It Works
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
