import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApi } from '../lib/useApi';
import { specialtyIcon } from '../lib/specialtyIcons';
import { INDIA_CITY_INDEX } from '../lib/locations';
import { COMPANY } from '../lib/company';
import Autocomplete from '../components/Autocomplete';
import SocialIcon from '../components/SocialIcon';
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

// Static content is stored as translation keys and resolved at render time,
// so switching language re-renders these lists in place.
const heroHighlights = ['home.hero.highlight1', 'home.hero.highlight2', 'home.hero.highlight3'];

const journeySteps = [
  { number: '01', icon: 'rate_review', key: 'step1' },
  { number: '02', icon: 'domain_verification', key: 'step2' },
  { number: '03', icon: 'flight_takeoff', key: 'step3' },
  { number: '04', icon: 'support_agent', key: 'step4' },
];

const patientServices = [
  { icon: 'clinical_notes', key: 'opinion' },
  { icon: 'stethoscope', key: 'preTravel' },
  { icon: 'approval', key: 'visa' },
  { icon: 'currency_exchange', key: 'money' },
  { icon: 'translate', key: 'interpreter' },
  { icon: 'airport_shuttle', key: 'transport' },
  { icon: 'hotel', key: 'stay' },
  { icon: 'local_pharmacy', key: 'admission' },
  { icon: 'personal_injury', key: 'nursing' },
];

const faqKeys = ['1', '2', '3', '4'];

export default function Home() {
  const { t } = useTranslation();
  const { data: treatments } = useApi('/treatments');
  const { data: hospitals } = useApi('/hospitals');
  const { data: doctors } = useApi('/doctors');
  const { data: testimonials } = useApi('/testimonials');
  const navigate = useNavigate();

  const [specialtySearch, setSpecialtySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  const specialties = useMemo(() => {
    if (!treatments) return [];
    return [...new Set(treatments.map((item) => item.specialty))];
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
              <span>{t('home.hero.badge')}</span>
            </div>

            <h1 className="text-headline-xl font-extrabold tracking-tight lg:text-5xl lg:leading-tight">
              {t('home.hero.titleLead')}{' '}
              <span className="text-secondary-container">{t('home.hero.titleHighlight')}</span>
            </h1>

            <p className="max-w-xl text-body-lg leading-relaxed text-primary-fixed-dim">
              {t('home.hero.subtitle')}
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
                  placeholder={t('home.hero.searchSpecialty')}
                  className="w-full rounded-lg bg-surface-container-lowest py-space-sm pr-space-md pl-10 text-body-md text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <Autocomplete
                  index={INDIA_CITY_INDEX}
                  value={locationSearch}
                  onChange={setLocationSearch}
                  priority={cities}
                  priorityLabel={t('home.hero.partnerHospitals')}
                  icon="location_on"
                  placeholder={t('home.hero.searchCity')}
                  aria-label={t('home.hero.searchCityLabel')}
                  inputClassName="w-full rounded-lg bg-surface-container-lowest py-space-sm pr-space-md text-body-md text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
              >
                <Icon name="search" className="!text-[18px]" /> {t('home.hero.searchButton')}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-space-lg pt-space-sm text-label-md">
              {heroHighlights.map((item) => (
                <div key={item} className="flex items-center gap-space-xs">
                  <Icon name="check_circle" className="text-tertiary-fixed-dim" />
                  <span>{t(item)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-space-lg text-on-surface shadow-xl lg:col-span-5">
            <div className="mb-space-lg">
              <h3 className="mb-space-3xs text-headline-md font-bold text-primary">
                {t('home.hero.formTitle')}
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                {t('home.hero.formSubtitle')}
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
            eyebrow={t('home.specialties.eyebrow')}
            title={t('home.specialties.title', { count: specialties.length })}
            subtitle={t('home.specialties.subtitle')}
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
                  {t('home.specialties.cardText')}
                </p>
                <span className="flex items-center gap-space-3xs text-label-sm font-semibold text-secondary">
                  {t('common.exploreTreatments')} <Icon name="chevron_right" className="!text-[16px]" />
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
                  {t('home.treatments.eyebrow')}
                </span>
                <h2 className="text-headline-lg font-bold text-primary">{t('home.treatments.title')}</h2>
              </div>
              <Button to="/treatments" variant="outline" className="mt-space-sm md:mt-0">
                {t('home.treatments.viewAll')}
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
                {t('home.hospitals.eyebrow')}
              </span>
              <h2 className="text-headline-lg font-bold text-primary">{t('home.hospitals.title')}</h2>
            </div>
            <p className="mt-space-sm max-w-md text-body-md text-on-surface-variant md:mt-0">
              {t('home.hospitals.subtitle')}
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
                {t('home.pricing.eyebrow')}
              </span>
              <h2 className="text-headline-lg font-bold">{t('home.pricing.title')}</h2>
              <p className="max-w-2xl text-body-lg leading-relaxed text-primary-fixed-dim">
                {t('home.pricing.body')}
              </p>

              <div className="grid grid-cols-1 gap-space-lg pt-space-md sm:grid-cols-3">
                {[
                  { value: t('home.pricing.stat1Value'), label: t('home.pricing.stat1Label') },
                  { value: t('home.pricing.stat2Value'), label: t('home.pricing.stat2Label') },
                  { value: t('home.pricing.stat3Value'), label: t('home.pricing.stat3Label') },
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
                <h4 className="text-headline-sm font-bold text-primary">{t('home.pricing.cardTitle')}</h4>
                <p className="text-body-sm text-on-surface-variant">
                  {t('home.pricing.cardBody')}
                </p>
                <Button to="/contact" className="w-full">
                  <Icon name="upload_file" className="!text-[18px]" />
                  {t('home.pricing.cardButton')}
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
            eyebrow={t('home.journey.eyebrow')}
            title={t('home.journey.title')}
            subtitle={t('home.journey.subtitle')}
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
                  <h3 className="mb-space-xs text-headline-sm font-bold text-primary">
                    {t(`home.journey.${step.key}Title`)}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    {t(`home.journey.${step.key}Text`)}
                  </p>
                </div>
                <div className="text-label-sm font-semibold text-secondary">
                  {t(`home.journey.${step.key}Meta`)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-space-2xl text-center">
            <Button to="/how-it-works" variant="secondary">
              {t('home.journey.cta')}
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Doctors */}
      {doctors?.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
          <SectionHeading
            eyebrow={t('home.doctors.eyebrow')}
            title={t('home.doctors.title')}
            subtitle={t('home.doctors.subtitle')}
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
              {t('home.doctors.cta')}
            </Button>
          </div>
        </section>
      )}

      {/* 8. Patient services */}
      <section className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-xl">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t('home.services.eyebrow')}
            title={t('home.services.title')}
            subtitle={t('home.services.subtitle')}
          />

          <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-3">
            {patientServices.map((service) => (
              <div
                key={service.key}
                className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-space-md flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
                  <Icon name={service.icon} className="!text-[24px]" />
                </div>
                <h3 className="mb-space-xs text-headline-sm font-bold text-balance text-primary">
                  {t(`home.services.${service.key}Title`)}
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  {t(`home.services.${service.key}Text`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-space-2xl text-center">
            <Button to="/contact" variant="secondary">
              {t('home.services.cta')}
            </Button>
          </div>
        </div>
      </section>

      {/* 9. Cities */}
      {cities.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl text-center sm:px-space-xl">
          <SectionHeading
            eyebrow={t('home.cities.eyebrow')}
            title={t('home.cities.title')}
            subtitle={t('home.cities.subtitle')}
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
              eyebrow={t('home.testimonials.eyebrow')}
              title={t('home.testimonials.title')}
              subtitle={t('home.testimonials.subtitle')}
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
          eyebrow={t('home.faq.eyebrow')}
          title={t('home.faq.title')}
          subtitle={t('home.faq.subtitle')}
        />
        <FaqAccordion
          items={faqKeys.map((n) => ({ q: t(`home.faq.q${n}`), a: t(`home.faq.a${n}`) }))}
        />
      </section>

      {/* 12. Final CTA */}
      <section className="relative overflow-hidden bg-primary px-space-md py-space-3xl text-center text-on-primary sm:px-space-xl">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url('${CTA_IMAGE}')` }}
        />
        <div className="relative z-10 mx-auto max-w-4xl space-y-space-lg">
          <span className="block text-label-sm font-bold tracking-widest text-secondary-container uppercase">
            {t('home.cta.eyebrow')}
          </span>
          <h2 className="text-headline-xl font-extrabold tracking-tight">{t('home.cta.title')}</h2>
          <p className="mx-auto max-w-2xl text-body-lg text-primary-fixed-dim">
            {t('home.cta.body')}
          </p>
          <div className="flex flex-wrap justify-center gap-space-md pt-space-sm">
            <Button to="/contact" className="px-space-xl py-space-md">
              {t('home.cta.book')}
              <Icon name="arrow_forward" className="!text-[18px]" />
            </Button>
            <a
              href={COMPANY.whatsapp.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-space-xs rounded-lg bg-primary-container px-space-xl py-space-md text-label-md text-on-primary-container transition-colors hover:bg-surface hover:text-on-surface"
            >
              <SocialIcon name="whatsapp" className="h-[18px] w-[18px]" />
              {t('home.cta.talk')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
