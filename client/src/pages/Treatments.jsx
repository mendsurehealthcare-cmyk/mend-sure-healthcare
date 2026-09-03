import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import Button from '../components/Button';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import TreatmentCard from '../components/TreatmentCard';
import StateMessage from '../components/StateMessage';

// Maps the triage picker's symptom areas onto the specialty names used in the
// treatments table, so choosing a symptom filters the grid below.
const TRIAGE_MATCHES = [
  { value: 'heart', label: 'Chest Pain, Palpitations, Shortness of Breath', match: 'Cardiac' },
  { value: 'brain', label: 'Headaches, Neurological Deficits, Spine Pain', match: 'Neuro' },
  { value: 'joint', label: 'Joint Stiffness, Sports Injury, Bone Fracture', match: 'Ortho' },
  { value: 'cancer', label: 'Tumor Detection, Oncology Screening', match: 'Oncol' },
  { value: 'other', label: 'General Medical Consultation / Second Opinion', match: null },
];

export default function Treatments() {
  const { data: treatments, loading, error } = useApi('/treatments');
  const [searchParams] = useSearchParams();
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || 'All');
  const [query, setQuery] = useState('');
  const [symptom, setSymptom] = useState('heart');

  const specialties = useMemo(() => {
    if (!treatments) return ['All'];
    return ['All', ...new Set(treatments.map((t) => t.specialty))];
  }, [treatments]);

  const filtered = useMemo(() => {
    if (!treatments) return [];
    const q = query.trim().toLowerCase();

    return treatments.filter((treatment) => {
      const matchesSpecialty = specialty === 'All' || treatment.specialty === specialty;
      const matchesQuery =
        !q ||
        `${treatment.name} ${treatment.specialty} ${treatment.description || ''}`
          .toLowerCase()
          .includes(q);
      return matchesSpecialty && matchesQuery;
    });
  }, [treatments, specialty, query]);

  // The triage picker jumps the grid to the closest matching specialty.
  function handleTriage() {
    const chosen = TRIAGE_MATCHES.find((item) => item.value === symptom);
    const target =
      chosen?.match && specialties.find((item) => item.toLowerCase().includes(chosen.match.toLowerCase()));

    setSpecialty(target || 'All');
    setQuery('');
    document.getElementById('treatments-grid')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow="Comprehensive Clinical Excellence"
        eyebrowIcon="medical_services"
        title="Specialties & Treatments"
        subtitle="Explore our world-class medical departments powered by pioneering diagnostic technologies, leading global experts, and uncompromising patient-centric care pathways."
        aside={
          <div className="flex items-center gap-space-md rounded-xl bg-surface-container/10 p-space-md backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">Up to 80%</span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">Lower Cost</span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">
                {specialties.length > 1 ? specialties.length - 1 : '—'}
              </span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">Specialties</span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">24/7</span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">Expert Support</span>
            </div>
          </div>
        }
      />

      {/* Sticky filter bar — offset matches the fixed header height in Layout */}
      <div className="sticky top-[88px] z-40 bg-surface/90 px-space-md py-space-md shadow-sm backdrop-blur-xl sm:px-space-2xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-space-md">
          <div className="no-scrollbar flex items-center gap-space-sm overflow-x-auto py-space-2xs">
            {specialties.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSpecialty(item)}
                className={`rounded-lg px-space-md py-space-xs text-label-md whitespace-nowrap transition-all ${
                  specialty === item
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {item === 'All' ? 'All Specialties' : item}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Icon
              name="search"
              className="pointer-events-none absolute top-1/2 left-space-md -translate-y-1/2 !text-[20px] text-outline"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conditions or treatments..."
              className="w-full rounded-lg bg-surface-container-lowest py-space-xs pr-space-md pl-12 text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {loading && <StateMessage>Loading treatments...</StateMessage>}
      {error && (
        <StateMessage>Couldn't load treatments right now. Please try again shortly.</StateMessage>
      )}

      {treatments && (
        <div className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-2xl">
          {filtered.length === 0 ? (
            <StateMessage>No treatments match that search.</StateMessage>
          ) : (
            <div
              id="treatments-grid"
              className="grid scroll-mt-[160px] grid-cols-1 gap-space-xl md:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Personalized care path / triage matcher */}
      <div className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-2xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-space-2xl lg:flex-row">
          <div className="max-w-xl">
            <span className="mb-space-xs block text-label-md tracking-wider text-secondary uppercase">
              Personalized Care Path
            </span>
            <h2 className="mb-space-md text-headline-lg text-on-surface">
              Unsure which specialty or treatment matches your diagnosis?
            </h2>
            <p className="mb-space-lg text-body-lg leading-relaxed text-on-surface-variant">
              Our care team reviews your medical history and imaging to match you with the precise
              treatment and hospital tailored to your requirements.
            </p>
            <div className="flex flex-wrap gap-space-md">
              <Button to="/contact" variant="secondary" className="px-space-xl py-space-md">
                <Icon name="support_agent" className="!text-[20px]" />
                Request a Free Assessment
              </Button>
              <Button to="/how-it-works" variant="outline" className="px-space-xl py-space-md">
                Learn Our Process
              </Button>
            </div>
          </div>

          <div className="w-full rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:w-1/2">
            <h3 className="mb-space-md text-headline-md text-on-surface">Quick Treatment Matcher</h3>
            <div className="space-y-space-md">
              <div>
                <label className="mb-space-2xs block text-label-md text-on-surface">
                  Primary Symptom or Condition Area
                </label>
                <select
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  className="w-full rounded-lg bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none"
                >
                  {TRIAGE_MATCHES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleTriage}
                className="w-full rounded-lg bg-secondary py-space-md text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
              >
                Show Matching Treatments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
