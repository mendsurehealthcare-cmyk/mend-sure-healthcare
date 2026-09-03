import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { specialtyIcon } from '../lib/specialtyIcons';
import { INDIA_CITY_INDEX } from '../lib/locations';
import Autocomplete from '../components/Autocomplete';
import Button from '../components/Button';
import Icon from '../components/Icon';
import SectionHeading from '../components/SectionHeading';
import FaqAccordion from '../components/FaqAccordion';
import TreatmentCard from '../components/TreatmentCard';
import HospitalCard from '../components/HospitalCard';
import DoctorCard from '../components/DoctorCard';
import TestimonialCard from '../components/TestimonialCard';
import ConsultationForm from '../components/ConsultationForm';
import ScrollRow from '../components/ScrollRow';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuArQC0LyQMK8whY8IexzxlaaZSRBkSlNKlUF7QW5t1TCggVcJwugoLKqHMpdz37cfgSwZbZrL0zpYAudCoT49ZFP-aOltpdMEtZDbMhocUSUqIIORs1zzU5hnhfewV4362MmXgKD7S0zLlNX26iS6wPmRqCeNax0b7VX_5kgExbq_M--zaBI4CwvJ6PpOK36k1BoTBrSOdOQL7HHAeClOkD1V5z7CGvxhkRSsEeGn_Q0LuyLp-KqmKQ';

const CTA_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCufdBhQRB3aOi-VToAAVIXhTEN8OUX7P-OTTAH5l9YL9D7qXytVZguRJ3e1zthNkxvkbdP7Q0YzIphzUQEWMg4xVbh5a2QNWlTSaC-_TkZ6ELGpHTQ5HtWegTY006WpnQJQVNo8nt8100c50VcDOPxDmFUG2oAbv_HC48UUB8WV6-mjvrEH6RjaMsyfcxOypqu4Sssn6tqqGznJdgiBjMVt_GWgm8JFPYk6Ukb3DQWgDHJUjO1WXBd';

const heroHighlights = [
  'Up to 80% Average Savings',
  'Free 2nd Medical Opinion',
  'Dedicated Care Manager',
];

const journeySteps = [
  {
    number: '01',
    icon: 'rate_review',
    title: 'Expert Review',
    text: 'Share your medical reports securely. Our partner specialists review your case and send back a treatment plan and second opinion.',
    meta: 'Duration: 24 Hours',
  },
  {
    number: '02',
    icon: 'domain_verification',
    title: 'Hospital Matching',
    text: 'Choose from accredited hospitals matched precisely to your condition, budget, and preferred destination city.',
    meta: 'Transparent Quotes',
  },
  {
    number: '03',
    icon: 'flight_takeoff',
    title: 'Travel & Admission',
    text: 'We handle medical visa invitation letters, airport pickups, recovery accommodation, and priority hospital admission.',
    meta: 'Dedicated Concierge',
  },
  {
    number: '04',
    icon: 'support_agent',
    title: 'Post-Op Recovery',
    text: 'Continuous follow-up care, physical therapy coordination, and check-ins after you return safely to your home country.',
    meta: 'Lifetime Support',
  },
];

const patientServices = [
  {
    icon: 'clinical_notes',
    title: 'Medical Opinion & Cost Estimations',
    text: 'Share your reports and receive a verified second opinion from our specialists, with itemized, all-in pricing before you commit to anything.',
  },
  {
    icon: 'stethoscope',
    title: 'Pre-Travel Consultations',
    text: 'Talk to your treating doctor by video before you fly, so the treatment plan, timeline, and fitness to travel are settled in advance.',
  },
  {
    icon: 'approval',
    title: 'Visa Assistance',
    text: 'Medical visa invitation letters, documentation checklists, and embassy liaison for you and your accompanying attendant.',
  },
  {
    icon: 'currency_exchange',
    title: 'Money Exchange',
    text: 'Guidance on authorised currency exchange and secure payment channels, so you get fair rates without carrying unnecessary cash.',
  },
  {
    icon: 'translate',
    title: 'Interpreters & Translators',
    text: 'Language support in the consultation room and on the ward, plus translation of medical records and discharge summaries.',
  },
  {
    icon: 'airport_shuttle',
    title: 'Transportation Assistance',
    text: 'Airport pickup and drop, hospital transfers, and local travel arranged around your appointment and treatment schedule.',
  },
  {
    icon: 'hotel',
    title: 'Accommodation Options',
    text: 'Verified stays near your hospital across budgets — guest houses, serviced apartments, and hotels for you and your family.',
  },
  {
    icon: 'local_pharmacy',
    title: 'Admission, Appointment & Pharma Care',
    text: 'Priority admission, appointment scheduling with your consultant, and help sourcing prescribed medication during and after your stay.',
  },
  {
    icon: 'personal_injury',
    title: 'Private Duty Nursing',
    text: 'Trained attendants and nurses for bedside care in hospital or at your accommodation through the recovery period.',
  },
];

const faqs = [
  {
    q: 'How do I get started?',
    a: "Fill out the consultation form on this page with your condition and any medical reports you have. Our care team reviews it and sends back a treatment plan with clear, all-in pricing — usually within 48 hours.",
  },
  {
    q: 'Do you accept international insurance?',
    a: "Coverage varies by insurer and hospital. Once you share your policy details with our care team, we'll confirm what's covered before you commit to anything.",
  },
  {
    q: 'What support do you provide for traveling patients?',
    a: 'Medical visa assistance, accommodation options, airport transfers, and interpreter services — all coordinated so your trip is as stress-free as the treatment itself.',
  },
  {
    q: 'Can I get a cost estimate before I travel?',
    a: "Yes — that's the whole point of the free quote. You'll see itemized, all-in pricing based on your specific case before you book a single flight.",
  },
];

export default function Home() {
  const { data: treatments } = useApi('/treatments');
  const { data: hospitals } = useApi('/hospitals');
  const { data: doctors } = useApi('/doctors');
  const { data: testimonials } = useApi('/testimonials');
  const navigate = useNavigate();

  const [specialtySearch, setSpecialtySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  const specialties = useMemo(() => {
    if (!treatments) return [];
    return [...new Set(treatments.map((t) => t.specialty))];
  }, [treatments]);

  // Derived from live data rather than hardcoded: the API filters city with an
  // exact match, so a chip for a city we have no hospitals in would dead-end.
  const cities = useMemo(() => {
    if (!hospitals) return [];
    return [...new Set(hospitals.map((h) => h.city).filter(Boolean))];
  }, [hospitals]);

  function handleHeroSearch(event) {
    event.preventDefault();
    if (specialtySearch.trim()) {
      navigate(`/treatments?specialty=${encodeURIComponent(specialtySearch.trim())}`);
    } else if (locationSearch.trim()) {
      navigate(`/hospitals?city=${encodeURIComponent(locationSearch.trim())}`);
    }
  }

  return (
    <div className="flex w-full flex-col">
      {/* 1. Hero + quick consultation form */}
      {/* The decorations are clipped by their own wrapper rather than by the
          section, so the city autocomplete can overflow the hero's bottom edge
          instead of being cut off mid-list. */}
      <section className="relative bg-primary px-space-md pt-space-2xl pb-space-3xl text-on-primary sm:px-space-xl">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          />
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
          <div className="space-y-space-lg lg:col-span-7">
            <div className="inline-flex items-center gap-space-xs rounded-full bg-primary-container px-space-md py-space-2xs text-label-sm font-semibold tracking-wide text-on-primary-container">
              <Icon name="verified" className="!text-[16px]" />
              <span>ACCREDITED GLOBAL HEALTHCARE NETWORK</span>
            </div>

            <h1 className="text-headline-xl font-extrabold tracking-tight lg:text-5xl lg:leading-tight">
              World-class surgery, at the{' '}
              <span className="text-secondary-container">lowest guaranteed cost</span>
            </h1>

            <p className="max-w-xl text-body-lg leading-relaxed text-primary-fixed-dim">
              Mend Sure connects patients from the US, UK, and beyond with accredited
              hospitals in India — the same quality of care, at a fraction of the cost.
            </p>

            <form onSubmit={handleHeroSearch} className="flex flex-col gap-space-sm sm:flex-row">
              <div className="relative flex-1">
                <Icon
                  name="person_search"
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 !text-[20px] text-outline"
                />
                <input
                  type="text"
                  value={specialtySearch}
                  onChange={(e) => setSpecialtySearch(e.target.value)}
                  placeholder="Find a treatment or specialty"
                  className="w-full rounded-lg bg-surface-container-lowest py-space-sm pr-space-md pl-10 text-body-md text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <Autocomplete
                  index={INDIA_CITY_INDEX}
                  value={locationSearch}
                  onChange={setLocationSearch}
                  priority={cities}
                  priorityLabel="Partner hospitals"
                  icon="location_on"
                  placeholder="City in India (optional)"
                  aria-label="City in India"
                  inputClassName="w-full rounded-lg bg-surface-container-lowest py-space-sm pr-space-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
              >
                <Icon name="search" className="!text-[18px]" /> Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-space-lg pt-space-sm text-label-md">
              {heroHighlights.map((item) => (
                <div key={item} className="flex items-center gap-space-xs">
                  <Icon name="check_circle" className="text-tertiary-fixed-dim" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-space-lg text-on-surface shadow-xl lg:col-span-5">
            <div className="mb-space-lg">
              <h3 className="mb-space-3xs text-headline-md font-bold text-primary">
                Request Free Expert Opinion
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Get a callback and cost estimate within 48 hours.
              </p>
            </div>
            <ConsultationForm sourcePage="home-hero" />
          </div>
        </div>
      </section>

      {/* 2. Specialty grid */}
      {specialties.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
          <SectionHeading
            eyebrow="Comprehensive Clinical Excellence"
            title={`Explore Our ${specialties.length} Core Medical Specialties`}
            subtitle="Led by world-renowned specialists using cutting-edge medical technology and personalized treatment plans."
          />

          <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {specialties.map((specialty) => (
              <Link
                key={specialty}
                to={`/treatments?specialty=${encodeURIComponent(specialty)}`}
                className="group cursor-pointer rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-lg bg-primary-fixed text-primary transition-colors group-hover:bg-secondary group-hover:text-on-secondary">
                  <Icon name={specialtyIcon(specialty)} className="!text-[24px]" />
                </div>
                <h3 className="mb-space-2xs text-headline-sm font-bold text-primary">{specialty}</h3>
                <p className="mb-space-md text-body-sm text-on-surface-variant">
                  Accredited centers and experienced surgeons across our partner network.
                </p>
                <span className="flex items-center gap-space-3xs text-label-sm font-semibold text-secondary">
                  Explore Treatments <Icon name="chevron_right" className="!text-[16px]" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Popular treatments */}
      {treatments?.length > 0 && (
        <section className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-xl">
          <div className="mx-auto max-w-7xl">
            <div className="mb-space-2xl flex flex-col justify-between md:flex-row md:items-end">
              <div>
                <span className="mb-space-xs block text-label-sm font-bold tracking-widest text-secondary uppercase">
                  Transparent, All-In Pricing
                </span>
                <h2 className="text-headline-lg font-bold text-primary">Popular Treatments</h2>
              </div>
              <Button to="/treatments" variant="outline" className="mt-space-sm md:mt-0">
                View All Treatments
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-space-xl md:grid-cols-2 lg:grid-cols-4">
              {treatments.slice(0, 8).map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Partner hospitals */}
      {hospitals?.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
          <div className="mb-space-2xl flex flex-col justify-between md:flex-row md:items-end">
            <div>
              <span className="mb-space-xs block text-label-sm font-bold tracking-widest text-secondary uppercase">
                World-Class Partner Facilities
              </span>
              <h2 className="text-headline-lg font-bold text-primary">Accredited Premier Hospitals</h2>
            </div>
            <p className="mt-space-sm max-w-md text-body-md text-on-surface-variant md:mt-0">
              Partnered exclusively with accredited medical centers featuring state-of-the-art
              surgical suites and international patient wings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-3">
            {hospitals.slice(0, 3).map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Lowest quotes assured */}
      <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-space-lg text-on-primary shadow-xl sm:p-space-2xl">
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-secondary/30 blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
            <div className="space-y-space-md lg:col-span-8">
              <span className="block text-label-sm font-bold tracking-widest text-secondary-container uppercase">
                Absolute Financial Transparency
              </span>
              <h2 className="text-headline-lg font-bold">
                Lowest Quotes Assured with 100% Price Match Guarantee
              </h2>
              <p className="max-w-2xl text-body-lg leading-relaxed text-primary-fixed-dim">
                We eliminate hidden hospital fees and broker markups. Enjoy direct savings on
                surgery compared to standard US and UK billing rates, backed by our Price Match
                Guarantee.
              </p>

              <div className="grid grid-cols-1 gap-space-lg pt-space-md sm:grid-cols-3">
                {[
                  { value: 'Up to 80%', label: 'Average Patient Savings' },
                  { value: '0%', label: 'Hidden Booking Fees' },
                  { value: '100%', label: 'Price Match Policy' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-surface-container-lowest/10 p-space-md backdrop-blur-md">
                    <div className="mb-space-3xs text-headline-md font-extrabold text-secondary-container">
                      {stat.value}
                    </div>
                    <div className="text-body-sm text-primary-fixed-dim">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start lg:col-span-4 lg:items-end">
              <div className="w-full max-w-sm space-y-space-md rounded-xl bg-surface p-space-lg text-on-surface shadow-xl">
                <h4 className="text-headline-sm font-bold text-primary">Compare &amp; Save Today</h4>
                <p className="text-body-sm text-on-surface-variant">
                  Send us your existing hospital quotation and our care team will verify or beat it.
                </p>
                <Button to="/contact" className="w-full">
                  <Icon name="upload_file" className="!text-[18px]" />
                  Send Your Estimate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Four-step care journey */}
      <section className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-xl">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Seamless End-to-End Support"
            title="Your 4-Step Care Journey with Mend Sure"
            subtitle="We handle every clinical and logistical detail so you can focus entirely on healing and recovery."
          />

          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-4">
            {journeySteps.map((step) => (
              <div
                key={step.number}
                className="relative flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
              >
                <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-label-md font-bold text-on-secondary shadow-md">
                  {step.number}
                </div>
                <div className="mb-space-lg pt-space-xs">
                  <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                    <Icon name={step.icon} className="!text-[24px]" />
                  </div>
                  <h3 className="mb-space-xs text-headline-sm font-bold text-primary">{step.title}</h3>
                  <p className="text-body-sm text-on-surface-variant">{step.text}</p>
                </div>
                <div className="text-label-sm font-semibold text-secondary">{step.meta}</div>
              </div>
            ))}
          </div>

          <div className="mt-space-2xl text-center">
            <Button to="/how-it-works" variant="secondary">
              See the Full Process
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Doctors */}
      {doctors?.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
          <SectionHeading
            eyebrow="Leading Global Experts"
            title="Meet Our Specialists"
            subtitle="Board-certified surgeons and physicians across our partner hospital network."
          />
          <ScrollRow>
            {doctors.map((doctor) => (
              <div key={doctor.id} className="w-72 shrink-0">
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </ScrollRow>
          <div className="mt-space-2xl text-center">
            <Button to="/doctors" variant="secondary">
              Find a Specialist
            </Button>
          </div>
        </section>
      )}

      {/* 8. Patient services */}
      <section className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-xl">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Comprehensive Patient Assistance"
            title="Our Services Cover Every Need"
            subtitle="From your first medical opinion to private nursing during recovery, every part of your treatment journey is arranged for you."
          />

          <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-3">
            {patientServices.map((service) => (
              <div
                key={service.title}
                className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-space-md flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
                  <Icon name={service.icon} className="!text-[24px]" />
                </div>
                <h3 className="mb-space-xs text-headline-sm font-bold text-balance text-primary">
                  {service.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant">{service.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-space-2xl text-center">
            <Button to="/contact" variant="secondary">
              Talk to a Care Manager
            </Button>
          </div>
        </div>
      </section>

      {/* 9. Cities */}
      {cities.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl text-center sm:px-space-xl">
          <SectionHeading
            eyebrow="Our Network Across India"
            title="Where We Treat You In India"
            subtitle="Our partner hospitals span India's major medical hubs."
          />
          <div className="flex flex-wrap justify-center gap-space-sm">
            {cities.map((city) => (
              <Link
                key={city}
                to={`/hospitals?city=${encodeURIComponent(city)}`}
                className="rounded-full bg-surface-container-highest px-space-lg py-space-sm text-label-md text-on-surface transition-colors hover:bg-primary hover:text-on-primary"
              >
                {city}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 10. Testimonials */}
      {testimonials?.length > 0 && (
        <section className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-xl">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Real Patient Success Stories"
              title="Satisfied Patients, Proud Service"
              subtitle="Hear from people who transformed their health and reclaimed their lives through Mend Sure."
            />
            <div className="grid grid-cols-1 gap-space-xl md:grid-cols-3">
              {testimonials.slice(0, 3).map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. FAQ */}
      <section className="mx-auto w-full max-w-4xl px-space-md py-space-3xl sm:px-space-xl">
        <SectionHeading
          eyebrow="Got Questions?"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about medical travel, costs, safety, and second opinions."
        />
        <FaqAccordion items={faqs} />
      </section>

      {/* 12. Final CTA */}
      <section className="relative overflow-hidden bg-primary px-space-md py-space-3xl text-center text-on-primary sm:px-space-xl">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url('${CTA_IMAGE}')` }}
        />
        <div className="relative z-10 mx-auto max-w-4xl space-y-space-lg">
          <span className="block text-label-sm font-bold tracking-widest text-secondary-container uppercase">
            Start Your Healing Journey Today
          </span>
          <h2 className="text-headline-xl font-extrabold tracking-tight">
            Ready for World-Class Healthcare at Lower Cost?
          </h2>
          <p className="mx-auto max-w-2xl text-body-lg text-primary-fixed-dim">
            Speak with a senior patient care advisor now for a free consultation and personalized
            cost estimate.
          </p>
          <div className="flex flex-wrap justify-center gap-space-md pt-space-sm">
            <Button to="/contact" className="px-space-xl py-space-md">
              Book Free Consultation
              <Icon name="arrow_forward" className="!text-[18px]" />
            </Button>
            <a
              href="https://wa.me/910000000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-space-xs rounded-lg bg-primary-container px-space-xl py-space-md text-label-md text-on-primary-container transition-colors hover:bg-surface hover:text-on-surface"
            >
              <Icon name="call" className="!text-[18px]" />
              Talk to Our Care Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
