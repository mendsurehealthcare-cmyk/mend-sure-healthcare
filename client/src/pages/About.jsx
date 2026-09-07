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
      'Fortis Memorial Research Institute',
      'Medanta – The Medicity',
      'Artemis Hospital',
      'Paras Hospital',
    ],
  },
  {
    city: 'Delhi',
    hospitals: [
      'Max Super Speciality Hospital, Saket',
      'Fortis Escorts Heart Institute, Okhla',
      'BLK-Max Super Speciality Hospital',
      'Indraprastha Apollo Hospital',
      'Max Super Speciality Hospital, Vaishali',
      'Manipal Hospital, Dwarka',
      'Aakash Healthcare Super Speciality Hospital',
    ],
  },
  {
    city: 'Noida',
    hospitals: ['Fortis Hospital, Sector 62'],
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
            alt="A Mend Sure care coordinator supporting an international patient"
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
                Across Delhi, Gurgaon &amp; Noida
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
                MENDSURE is a healthcare and medical travel assistance service that connects
                patients from across the globe with some of India's most respected hospitals and
                specialist doctors. We have done the hard work of building trusted relationships
                with these acclaimed healthcare providers — so from the moment you contact us, you
                are in the right hands.
              </p>
              <p>
                We are here to ensure you are given the best possible options when looking for a
                doctor, a hospital, or treatment abroad.
              </p>
            </div>
          </div>

          <AboutImageCard />
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

          <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-3">
            {hospitalGroups.map((group) => (
              <div
                key={group.city}
                className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
              >
                <div className="mb-space-md flex items-center gap-space-sm border-b border-outline-variant/20 pb-space-sm">
                  <Icon name="location_on" className="!text-[20px] text-secondary" />
                  <h3 className="text-headline-sm font-bold text-primary">{group.city}</h3>
                  <span className="ml-auto text-label-sm text-on-surface-variant">
                    {group.hospitals.length}
                  </span>
                </div>

                <ul className="space-y-space-sm">
                  {group.hospitals.map((hospital) => (
                    <li key={hospital} className="flex items-start gap-space-sm">
                      <Icon
                        name="local_hospital"
                        className="mt-0.5 !text-[18px] shrink-0 text-secondary"
                      />
                      <span className="text-body-md text-on-surface">{hospital}</span>
                    </li>
                  ))}
                </ul>
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
