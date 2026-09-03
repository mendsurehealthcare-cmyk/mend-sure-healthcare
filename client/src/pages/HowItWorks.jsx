import Button from '../components/Button';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import StepTabs from '../components/StepTabs';
import StatBadge from '../components/StatBadge';
import SectionHeading from '../components/SectionHeading';
import FaqAccordion from '../components/FaqAccordion';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDF7cQCzc7LW8YgjPVEzo5lfDUUpFTizE-Xmp8qdssty8h2_XROX6qiyel-vxqk4OS0QO4vwphi8M2D60pHomQFcM0KeafhdBQCU6kQw-bb0E9ww5D70MrWYglfIr_TwGEv86z9gC_gQdTxj9_i309tiuh3vHUbSkDiJ5qgfe-7CSZCT7vBFEaKW4SYu5t-TlZWdihG3b8SRtr_IeQj-LRODu_sPPnG0UjyWoaiBYrUmoO1oC3f8Agn';

const CTA_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDhSlN33bg2spxenWJMTl1vd1Sty11NenK0M3omCdO3B3_Ola7uCr8r-iwBUb7UNJ3Wr7IH2sWL2JiZieiJCf4jlSrffZYWERedLeLMy6_fTRm6dcYyjxOZLag_gny43P8Ab7KumIg90Gqr2v8-Ocm5t4Mh9eOyLO348xKvTRXOkrtd5mfXy7fVspJKhxdanVaHsi4CTI4ANcAUMEaG6kfrY2WWE3s62841cebaE4z4T21JLTFp3T53';

const steps = [
  {
    label: 'Share Your Case',
    badge: 'Secure Portal',
    badgeIcon: 'upload_file',
    title: 'Share Your Case',
    body: "Send us your diagnostic scans, lab reports, and physician notes. Your dedicated care coordinator reviews them for completeness and comes back to you with any gaps. This is free and takes just a few minutes.",
    bullets: [
      'Encrypted transfer for all medical files',
      'No obligation and no cost to submit',
      'A named care coordinator assigned to your case',
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBpikxChJ-B7kYq1H5cN5sXHQcM_fBWBIJKRQgkpCcTsg_pv13Uy0VUycEHqwu0MJDjb2lw1VWUWqpURDv20r3-vqSA5ZQNAPsMIcL1y5c7VWjJlifFmDdE5jePUKju75cIpG2AHOnwKExrlG8_ICRuHhZ9oVp7Nsx0BohsKfcAaBgcvl9cxHNsDPL-VmnUnfMXDOA0oP6Q5yNKfSTJz8UiQx4K_iNUyGRHVF44V3Ok4P7rc7O_Pmr',
    imageAlt: 'A secure medical records dashboard showing encrypted patient imaging scans.',
    imageCaption: 'Confidential medical data handling',
    action: { to: '/contact', label: 'Send Your Records' },
  },
  {
    label: 'Specialist Review',
    badge: 'Expert Panel',
    badgeIcon: 'group',
    title: 'Get a Second Opinion',
    body: 'Your case goes to senior specialists at our partner hospitals, who assess it collaboratively and confirm the most appropriate, evidence-based treatment before you commit to anything.',
    bullets: [
      'Reviewed by senior specialists in your condition',
      'Second opinion confirmed before you book travel',
      'A clear treatment roadmap you can take to your own doctor',
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvl3F1eSI77ckZ3ueY8iSyByACQftPpVESijNUlADyvCh93tkmdgWNo5urrMDJxosX1X5gkJToRmaTp9Qv-gj-GlF87OyTinaLaHkgaiHqXQUEEgHjpHf69FIEeo3zY09246GwhIlCsse1tzRNmCmGBKZkNKI_MfqI8P9q4hCoXYRZSJIcFviBesfqTmow3L7QAXj4eoRcMgK4FyX9kiYPOLn0jA4ovPtGS4c3cLfPzR1Dz0Ddzof_',
    imageAlt: 'A team of physicians and surgeons reviewing medical scans in a clinical board room.',
    imageCaption: 'Collaborative specialist review',
  },
  {
    label: 'Hospital Matching',
    badge: 'Accredited Network',
    badgeIcon: 'local_hospital',
    title: 'Treatment Plan & Quote',
    body: 'We match you with the accredited hospital and surgeon best suited to your procedure, balancing clinical outcomes, technology, and your budget — then send a clear, all-in price.',
    bullets: [
      'Matched on outcomes, technology, and cost',
      'Surgeon profiles including experience and case volume',
      'All-inclusive cost estimate with zero hidden fees',
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ8wH228m_5OJaWsxtns2FLdkzLONTrnKKc6kR95F-fePwGAJd9_0JEO_J6-umRbj1G0MyJrOvVv9841o7oeKurYNWATABinE6VaTyi8O9FPaqEfpD3JVgq33r4mwj8Gw6XXzv9P1GLZX26f4XfgQsKKnTYhflZeUiHxIN4lt6FEAMZjgnGvGegcfJTAcMkSSuVBem2NfsQVqA7GFtQxZw2H_d5Tq3SIhyufRAxGo11OK2U4gizkDh',
    imageAlt: 'A modern accredited hospital exterior with glass architecture and landscaping.',
    imageCaption: 'Accredited partner hospitals across India',
    action: { to: '/hospitals', label: 'Browse Partner Hospitals' },
  },
  {
    label: 'Travel & Visa',
    badge: 'Trip Logistics',
    badgeIcon: 'flight_takeoff',
    title: 'Plan Your Trip',
    body: 'Once you approve the plan, we handle the logistics: medical visa invitation letters, embassy paperwork, airport pickup, and accommodation close to the hospital for you and your family.',
    bullets: [
      'Medical visa invitation letters and embassy guidance',
      'Airport pickup and hospital transfers',
      'Accommodation options near the hospital for family',
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCoUR0jlige_o9D2lAHWJH0Ndp_OxVV4jqXbP_kdpvbYrKQFFV_vYM5Wu4kgb9i9DjntWphcAqKHlezoOqmB96ylhJ9t_pZiywwIp23Pqy1VKd2saWbYZUuf4dTH7WGUSL-5gjneOGYogU2psekVUyu0KpcEARqfFdqAkXdzmPCwhjbpVj3-FJcoGzAE6B7ctyUYVdjMs0UC-MsiHqyLweagDX0SulatCd3tM4KPST6G9i1BksT4SGF',
    imageAlt: 'An airport arrivals lounge with a vehicle waiting for a patient.',
    imageCaption: 'Door-to-door travel coordination',
  },
  {
    label: 'Treatment & Stay',
    badge: 'In-Hospital Care',
    badgeIcon: 'medical_services',
    title: 'Arrive & Get Treated',
    body: 'A local coordinator meets you at the airport and stays with you through admission, treatment, and discharge — handling interpretation, paperwork, and daily updates to your family back home.',
    bullets: [
      'Coordinator present from arrival through discharge',
      'Interpreter support in the hospital',
      'Daily updates to family in your home country',
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmm_ux0Yk56tFKvC6eaEHdRDKRN0pjWRZze2DuiBVilrU8Uan-1XQOYpY5UzF8_wivj6S4BSm_hi2FISH9LlG7XzX5hCk3_4nuYGsjokin3hJiQrAk2dLfTyGj-HWc1EVjA7STEOeJqGGQ9fXq3b3EF0gIlzW5YJ-LKPuhtAgq7KmvjxJtdvxUvxZ05KJ7XE8voeGwEN1Z55uSVc-lUZ_ZB2SX0-q6lkalmE8ySvq8ETApx8wyEGD3',
    imageAlt: 'A medical professional assisting a patient in a hospital recovery suite.',
    imageCaption: 'Supported in-hospital care and recovery',
  },
  {
    label: 'Recovery Support',
    badge: 'Follow-Up',
    badgeIcon: 'monitor_heart',
    title: 'Recover With Support',
    body: "Your care doesn't end at discharge. We stay in touch to make sure your recovery is on track before you fly home, then coordinate follow-up consultations with your surgeon and your local physician.",
    bullets: [
      'Check-ins before you fly home',
      'Follow-up consultations with your operating surgeon',
      'Records shared with your local physician',
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0L3kHjnJL54g6TNeuVxjj07RChS0PCea_Aw0HFFMj7iDTiD1XA8WXEQ13Iu9w9Ksx5YAQJk68R12uLMW-Zhwf2W-bdaND_-p6LB6f-LbWLRQCftJWiqI29Po_fv-jyhupgbX6m6SMSjlJxCP2-PeM9SKO4KDaXLKbnmDTAV-PPAUOb1WbFp1o91pcL5Ck9uoQwy-rcQYXVEPqhR_60e892wZT09sJqM8HItL4_1PUXTlJPotsm0Is',
    imageAlt: 'A patient in a video consultation with their surgeon from home.',
    imageCaption: 'Follow-up care once you are home',
  },
];

const faqs = [
  {
    q: 'How long does the initial case review take?',
    a: 'Our partner specialists complete a case review and preliminary treatment plan within 24 to 48 hours of receiving your full medical records.',
  },
  {
    q: 'Who accompanies me during my trip?',
    a: 'From the moment you land, a dedicated Mend Sure coordinator meets you, manages hospital admission, and stays with you through your recovery.',
  },
  {
    q: 'What happens if a complication arises after I return home?',
    a: 'You keep direct access to your operating surgeon for follow-up consultations, and we coordinate with your local primary physician so your care continues seamlessly.',
  },
  {
    q: 'Is there any cost for the case review or quote?',
    a: 'No. The medical opinion, treatment plan, and cost estimate are all free and carry no obligation to book.',
  },
];

export default function HowItWorks() {
  return (
    <div className="flex w-full flex-col">
      <PageHero
        eyebrow="Clinical Excellence & Safety"
        title="How Mend Sure Manages Your Medical Journey"
        subtitle="A transparent, medically rigorous 6-step pathway ensuring safety, careful hospital matching, coordinated travel, and post-operative recovery support."
        backgroundImage={HERO_IMAGE}
        backgroundAlt="Abstract medical network pattern representing healthcare connections and patient safety."
        aside={
          <div className="max-w-sm rounded-xl bg-primary-container/60 p-space-lg text-on-primary backdrop-blur-md">
            <div className="mb-space-md flex items-center gap-space-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Icon name="shield" className="!text-[20px] text-on-secondary" />
              </div>
              <div>
                <div className="text-headline-sm font-bold">100% Verified</div>
                <div className="text-body-sm text-primary-fixed-dim">Accredited Partner Network</div>
              </div>
            </div>
            <p className="mb-space-md text-body-sm text-primary-fixed-dim">
              Every hospital and specialist in our network is vetted for accreditation, safety
              record, and outcomes before we ever refer a patient.
            </p>
            <div className="flex items-center justify-between border-t border-primary-fixed-dim/20 pt-space-md text-body-sm">
              <span>No-obligation case review</span>
              <span className="font-bold text-secondary-container">Free</span>
            </div>
          </div>
        }
      >
        <Button to="/contact">
          Start Your Case Review <Icon name="arrow_forward" className="!text-[18px]" />
        </Button>
        <Button to="/treatments" variant="onDark">
          View Transparent Pricing
        </Button>
      </PageHero>

      {/* Step-by-step pathway */}
      <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <SectionHeading
          eyebrow="End-to-End Protocol"
          title="The 6 Stages of Your Medical Journey"
          subtitle="Step through each stage to see the clinical oversight, logistics, and dedicated team assigned to your care."
        />
        <StepTabs steps={steps} />
      </section>

      {/* Trust statistics */}
      <section className="bg-primary-container px-space-md py-space-2xl text-on-primary-container sm:px-space-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-space-xl text-center md:grid-cols-4">
          <StatBadge tone="onDark" value="100%" label="Accredited Hospitals" />
          <StatBadge tone="onDark" value="Free" label="Second Medical Opinion" />
          <StatBadge tone="onDark" value="24/7" label="Dedicated Care Coordinator" />
          <StatBadge tone="onDark" value="0%" label="Hidden Fees Guarantee" />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-4xl px-space-md py-space-3xl sm:px-space-xl">
        <SectionHeading
          title="Common Questions About Our Process"
          subtitle="Everything you need to know about safety, pricing, and coordination."
        />
        <FaqAccordion items={faqs} />
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto w-full max-w-7xl px-space-md pb-space-3xl sm:px-space-xl">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-space-lg text-center text-on-primary sm:p-space-3xl">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url('${CTA_IMAGE}')` }}
          />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="mb-space-md text-headline-xl text-on-primary">
              Ready to Begin Your Medical Journey?
            </h2>
            <p className="mb-space-xl text-body-lg text-primary-fixed-dim">
              Send your medical records today for a free review and a transparent quote from our
              partner specialists.
            </p>
            <div className="flex flex-wrap justify-center gap-space-md">
              <Button to="/contact" className="px-space-xl py-space-md shadow-lg">
                Start Free Case Review
              </Button>
              <Button to="/treatments" variant="onDark" className="px-space-xl py-space-md">
                Compare Treatment Costs
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
