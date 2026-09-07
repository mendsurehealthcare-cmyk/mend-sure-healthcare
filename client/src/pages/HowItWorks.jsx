import { useDocumentMeta } from '../lib/useDocumentMeta';
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
    "label": "Share Your Case",
    "badge": "Free & Secure",
    "badgeIcon": "upload_file",
    "title": "Tell Us About Your Case",
    "body": "Submit your diagnostic scans, lab results, and physician notes for review. Your care coordinator will go through your documents and let you know if anything is missing.",
    "note": "Simple and secure — you can share your records with us, and your care coordinator will get back to you with any queries.",
    "bullets": [
      "Encrypted upload of diagnostic and lab documents",
      "No cost or obligation to submit",
      "Named care coordinator for your case"
    ],
    "action": {
      "to": "/contact",
      "label": "Send Your Records"
    },
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBBpikxChJ-B7kYq1H5cN5sXHQcM_fBWBIJKRQgkpCcTsg_pv13Uy0VUycEHqwu0MJDjb2lw1VWUWqpURDv20r3-vqSA5ZQNAPsMIcL1y5c7VWjJlifFmDdE5jePUKju75cIpG2AHOnwKExrlG8_ICRuHhZ9oVp7Nsx0BohsKfcAaBgcvl9cxHNsDPL-VmnUnfMXDOA0oP6Q5yNKfSTJz8UiQx4K_iNUyGRHVF44V3Ok4P7rc7O_Pmr",
    "imageAlt": "A secure medical records dashboard showing encrypted patient imaging scans.",
    "imageCaption": "Confidential medical data handling"
  },
  {
    "label": "Second Opinion",
    "badge": "Senior Specialists",
    "badgeIcon": "group",
    "title": "Second Opinion",
    "body": "We share your case with senior specialists at our network of hospitals, who come together to confirm the most suitable course of treatment for your condition.",
    "note": "You receive a second opinion, reviewed and approved by senior doctors, plus a suggested treatment plan you can share with your local physician.",
    "bullets": [
      "Reviewed by our network of senior specialists",
      "Second opinion provided and confirmed before booking",
      "A suggested treatment plan for your approval"
    ],
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBvl3F1eSI77ckZ3ueY8iSyByACQftPpVESijNUlADyvCh93tkmdgWNo5urrMDJxosX1X5gkJToRmaTp9Qv-gj-GlF87OyTinaLaHkgaiHqXQUEEgHjpHf69FIEeo3zY09246GwhIlCsse1tzRNmCmGBKZkNKI_MfqI8P9q4hCoXYRZSJIcFviBesfqTmow3L7QAXj4eoRcMgK4FyX9kiYPOLn0jA4ovPtGS4c3cLfPzR1Dz0Ddzof_",
    "imageAlt": "A team of physicians and surgeons reviewing medical scans in a clinical board room.",
    "imageCaption": "Collaborative specialist review"
  },
  {
    "label": "Plan & Quote",
    "badge": "Transparent Costs",
    "badgeIcon": "request_quote",
    "title": "Treatment Plan and Quote",
    "body": "We identify the right hospital and surgeon for your treatment and share a detailed treatment plan and budget with you. Our focus is on the best value treatment for your condition, supported by the latest technology and a surgeon with the relevant experience for your case.",
    "bullets": [
      "Hospital and surgeon recommended and approved",
      "Surgeon's profile including experience and case volumes",
      "Budget breakdown with no added costs"
    ],
    "action": {
      "to": "/hospitals",
      "label": "Browse Partner Hospitals"
    },
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ8wH228m_5OJaWsxtns2FLdkzLONTrnKKc6kR95F-fePwGAJd9_0JEO_J6-umRbj1G0MyJrOvVv9841o7oeKurYNWATABinE6VaTyi8O9FPaqEfpD3JVgq33r4mwj8Gw6XXzv9P1GLZX26f4XfgQsKKnTYhflZeUiHxIN4lt6FEAMZjgnGvGegcfJTAcMkSSuVBem2NfsQVqA7GFtQxZw2H_d5Tq3SIhyufRAxGo11OK2U4gizkDh",
    "imageAlt": "A modern accredited hospital exterior with glass architecture and landscaping.",
    "imageCaption": "Accredited partner hospitals across India"
  },
  {
    "label": "Plan Your Visit",
    "badge": "Travel & Visa",
    "badgeIcon": "flight_takeoff",
    "title": "Plan Your Visit",
    "body": "Your visit to India is planned and organised by your care coordinator. We take care of the medical visa and any embassy requirements, arrange transport to and from the hospital, and organise accommodation if required for you and your family.",
    "bullets": [
      "Assistance with medical visa and embassy requirements",
      "Airport transfers to and from the hospital",
      "Accommodation options if required"
    ],
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCoUR0jlige_o9D2lAHWJH0Ndp_OxVV4jqXbP_kdpvbYrKQFFV_vYM5Wu4kgb9i9DjntWphcAqKHlezoOqmB96ylhJ9t_pZiywwIp23Pqy1VKd2saWbYZUuf4dTH7WGUSL-5gjneOGYogU2psekVUyu0KpcEARqfFdqAkXdzmPCwhjbpVj3-FJcoGzAE6B7ctyUYVdjMs0UC-MsiHqyLweagDX0SulatCd3tM4KPST6G9i1BksT4SGF",
    "imageAlt": "An airport arrivals lounge with a vehicle waiting for a patient.",
    "imageCaption": "Door-to-door travel coordination"
  },
  {
    "label": "Arrive & Treat",
    "badge": "In-Hospital Care",
    "badgeIcon": "medical_services",
    "title": "Arrive and Get Treated",
    "body": "A local coordinator meets you at the airport and stays with you for the duration of your treatment. You also have access to an interpreter in the hospital, and we keep your family informed throughout.",
    "note": "Your care coordinator is with you from admission until discharge, and family members are kept up to date with regular communication.",
    "bullets": [
      "Meet and greet at the airport by your coordinator",
      "Interpreter available in the hospital",
      "Family members kept informed throughout your treatment"
    ],
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDmm_ux0Yk56tFKvC6eaEHdRDKRN0pjWRZze2DuiBVilrU8Uan-1XQOYpY5UzF8_wivj6S4BSm_hi2FISH9LlG7XzX5hCk3_4nuYGsjokin3hJiQrAk2dLfTyGj-HWc1EVjA7STEOeJqGGQ9fXq3b3EF0gIlzW5YJ-LKPuhtAgq7KmvjxJtdvxUvxZ05KJ7XE8voeGwEN1Z55uSVc-lUZ_ZB2SX0-q6lkalmE8ySvq8ETApx8wyEGD3",
    "imageAlt": "A medical professional assisting a patient in a hospital recovery suite.",
    "imageCaption": "Supported in-hospital care and recovery"
  },
  {
    "label": "Return & Recover",
    "badge": "Follow-Up",
    "badgeIcon": "monitor_heart",
    "title": "Return Home and Continue Recovery",
    "body": "We keep in touch with you after discharge to make sure your recovery is progressing well, and coordinate follow-up consultations by video or phone with your surgeon and local physician if required.",
    "note": "Your care coordinator continues to support you before you return home to your country of residence.",
    "bullets": [
      "Post-discharge follow-up to assess recovery",
      "Coordinated follow-up consultations if required",
      "Local physician liaison"
    ],
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuA0L3kHjnJL54g6TNeuVxjj07RChS0PCea_Aw0HFFMj7iDTiD1XA8WXEQ13Iu9w9Ksx5YAQJk68R12uLMW-Zhwf2W-bdaND_-p6LB6f-LbWLRQCftJWiqI29Po_fv-jyhupgbX6m6SMSjlJxCP2-PeM9SKO4KDaXLKbnmDTAV-PPAUOb1WbFp1o91pcL5Ck9uoQwy-rcQYXVEPqhR_60e892wZT09sJqM8HItL4_1PUXTlJPotsm0Is",
    "imageAlt": "A patient in a video consultation with their surgeon from home.",
    "imageCaption": "Follow-up care once you are home"
  }
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
  useDocumentMeta({
    title: 'How It Works — Your Medical Treatment Journey in India | MENDSURE',
    description:
      'From sharing your case to full recovery, MENDSURE guides international patients through every step of treatment in India — with an expert second opinion and clear costs at every stage.',
  });

  return (
    <div className="flex w-full flex-col">
      <PageHero
        eyebrow="How It Works"
        title="A Simple, Guided Process for Medical Treatment in India"
        subtitle="From your initial enquiry to your return home, a dedicated care coordinator is with you at every step — handling the medical, logistical, and personal details."
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

      {/* Opening statement. Sets expectations before the detail, and names the
          one thing patients most want to know: someone is with them. */}
      <section className="mx-auto w-full max-w-3xl px-space-md pt-space-3xl sm:px-space-xl">
        <p className="mb-space-md text-body-lg leading-relaxed text-on-surface-variant">
          Travelling abroad for medical treatment can be confusing. At MENDSURE, we have worked with
          patients across the globe to make the entire process simpler and more transparent. From
          your initial enquiry to your return home, a dedicated care coordinator is with you every
          step of the way, dealing with the medical, logistical, and personal details so you can
          focus on what matters most — your health.
        </p>
        <p className="text-headline-sm leading-relaxed font-normal text-on-surface">
          Here's what to expect when you choose MENDSURE for treatment in India.
        </p>
      </section>

      {/* Step-by-step pathway */}
      <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <SectionHeading
          eyebrow="Your Journey, Step by Step"
          title="The 6 Stages of Your Treatment"
          subtitle="Step through each stage to see exactly what happens, what you receive, and who is looking after you."
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

      {/* The human side. Sits after the process detail deliberately: once a
          reader has seen the mechanics, this is what tells them who is behind
          it. */}
      <section className="mx-auto w-full max-w-4xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="rounded-2xl bg-surface-container-lowest p-space-lg text-center shadow-sm sm:p-space-2xl">
          <div className="mx-auto mb-space-md flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
            <Icon name="volunteer_activism" className="!text-[24px]" />
          </div>
          <h2 className="mx-auto mb-space-md max-w-2xl text-headline-lg font-bold text-balance text-primary">
            Care That Understands Both the Medical and the Human Side
          </h2>
          <p className="mx-auto max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
            MENDSURE makes it simple and affordable to get high-quality medical treatment across a
            range of specialities. You are supported by a care coordinator throughout your journey,
            who works with you to understand your specific needs and coordinates your treatment with
            our network of private hospitals in India.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-4xl px-space-md pb-space-3xl sm:px-space-xl">
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
              Start With a Free Case Review
            </h2>
            <p className="mb-space-lg text-body-lg leading-relaxed text-primary-fixed-dim">
              Take the first step towards expert medical treatment in India by submitting your
              diagnostic reports for a free, no-obligation review by one of our care coordinators.
            </p>

            {/* The three objections that stop people submitting, answered on
                the button itself rather than buried in small print. */}
            <ul className="mx-auto mb-space-xl flex flex-wrap items-center justify-center gap-x-space-lg gap-y-space-xs text-label-md text-primary-fixed-dim">
              {['No cost', 'No obligation', 'Reviewed by senior specialists'].map((item) => (
                <li key={item} className="flex items-center gap-space-2xs">
                  <Icon name="check_circle" className="!text-[18px] text-secondary-container" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap justify-center gap-space-md">
              <Button to="/contact" className="px-space-xl py-space-md shadow-lg">
                Start Free Case Review
                <Icon name="arrow_forward" className="!text-[18px]" />
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
