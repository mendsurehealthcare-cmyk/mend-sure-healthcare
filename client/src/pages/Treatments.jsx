import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApi } from '../lib/useApi';
import Button from '../components/Button';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import TreatmentCard from '../components/TreatmentCard';
import CardiacSurgeryCostGuide from '../components/CardiacSurgeryCostGuide';
import CostGuideTable from '../components/CostGuideTable';
import TreatmentArticleGuide from '../components/TreatmentArticleGuide';
import { specialtyIcon } from '../lib/specialtyIcons';
import {
  ALL_GUIDE_SPECIALTIES,
  CARDIAC_SURGERY_SPECIALTY,
  TREATMENT_COST_GUIDES,
} from '../data/treatmentCostGuides';
import {
  ONCOLOGY_ARTICLE_SECTIONS,
  ONCOLOGY_DISCLAIMER,
  ONCOLOGY_FAQS,
  ONCOLOGY_INTRO,
} from '../data/oncologyArticle';
import {
  NEUROSURGERY_ARTICLE_SECTIONS,
  NEUROSURGERY_DISCLAIMER,
  NEUROSURGERY_FAQS,
  NEUROSURGERY_INTRO,
} from '../data/neurosurgeryArticle';
import {
  ORTHOPEDICS_ARTICLE_SECTIONS,
  ORTHOPEDICS_FAQS,
  ORTHOPEDICS_INTRO,
} from '../data/orthopedicsArticle';
import {
  SPINE_SURGERY_ARTICLE_SECTIONS,
  SPINE_SURGERY_FAQS,
  SPINE_SURGERY_INTRO,
} from '../data/spineSurgeryArticle';
import { IVF_ARTICLE_SECTIONS, IVF_DISCLAIMER, IVF_FAQS, IVF_INTRO } from '../data/ivfArticle';
import {
  GYNAECOLOGY_ARTICLE_SECTIONS,
  GYNAECOLOGY_FAQS,
  GYNAECOLOGY_INTRO,
} from '../data/gynaecologyArticle';
import {
  LIVER_TRANSPLANT_ARTICLE_SECTIONS,
  LIVER_TRANSPLANT_FAQS,
  LIVER_TRANSPLANT_INTRO,
} from '../data/liverTransplantArticle';
import {
  BONE_MARROW_ARTICLE_SECTIONS,
  BONE_MARROW_DOCTOR_SLUGS,
  BONE_MARROW_FAQS,
  BONE_MARROW_INTRO,
} from '../data/boneMarrowArticle';
import StateMessage from '../components/StateMessage';

// The specialties (besides Cardiac Surgery, which keeps its own bespoke
// component) with the fuller article treatment — intro, doctors, hospitals,
// patient-education sections, FAQ — rather than just a price table. Each
// entry's priceTables reuses the same TREATMENT_COST_GUIDES data the plain
// table view below renders for every other specialty, so a price never has
// to be kept in sync between two places.
//
// Keyed by specialty and spread into <TreatmentArticleGuide>, so adding the
// next one is a data entry here plus its own content file
// (client/src/data/<specialty>Article.js), not another branch in the render
// logic below.
const ARTICLE_GUIDES = {
  Oncology: {
    title: 'Cancer Treatment & Oncology Care',
    intro: ONCOLOGY_INTRO,
    priceTables: TREATMENT_COST_GUIDES.Oncology,
    doctorSpecialty: 'Oncology Care',
    doctorsHeading: 'Meet Our Oncology Specialists',
    hospitalsHeading: 'Hospitals for Cancer Care',
    articleSections: ONCOLOGY_ARTICLE_SECTIONS,
    faqs: ONCOLOGY_FAQS,
    disclaimer: ONCOLOGY_DISCLAIMER,
  },
  Neurosurgery: {
    title: 'Neurosurgery & Brain and Spine Care',
    intro: NEUROSURGERY_INTRO,
    priceTables: TREATMENT_COST_GUIDES.Neurosurgery,
    // The doctors table doesn't carry a bare "Neurosurgery" specialty of its
    // own — doctors.json groups neurosurgeons together with most spine
    // surgeons under this broader label, and splits out only two dedicated
    // spine specialists under "Spine Surgery" instead.
    doctorSpecialty: 'Neuro and Spine Surgery',
    doctorsHeading: 'Meet Our Neurosurgery Specialists',
    hospitalsHeading: 'Hospitals for Neurosurgery',
    articleSections: NEUROSURGERY_ARTICLE_SECTIONS,
    faqs: NEUROSURGERY_FAQS,
    disclaimer: NEUROSURGERY_DISCLAIMER,
  },
  Orthopedics: {
    title: 'Orthopaedic Surgery & Joint Care',
    intro: ORTHOPEDICS_INTRO,
    priceTables: TREATMENT_COST_GUIDES.Orthopedics,
    doctorSpecialty: 'Orthopaedic Care',
    doctorsHeading: 'Meet Our Orthopaedic Specialists',
    hospitalsHeading: 'Hospitals for Orthopaedic Care',
    articleSections: ORTHOPEDICS_ARTICLE_SECTIONS,
    faqs: ORTHOPEDICS_FAQS,
    // No closing disclaimer was supplied for this guide, unlike Cardiac
    // Surgery's and Oncology's — TreatmentArticleGuide already treats it as
    // optional, so it's simply omitted rather than invented.
  },
  'Spine Surgery': {
    title: 'Spine Surgery & Back Care',
    intro: SPINE_SURGERY_INTRO,
    priceTables: TREATMENT_COST_GUIDES['Spine Surgery'],
    // Spine conditions are treated by both orthopaedic spine surgeons and
    // neurosurgeons — the article itself says so — and the doctor directory
    // splits them across two specialty values, so both are included here.
    // The eight "Neuro and Spine Surgery" doctors also appear on the
    // Neurosurgery page; that overlap is real, not a bug, since the same
    // neurosurgeons treat both.
    doctorSpecialty: ['Spine Surgery', 'Neuro and Spine Surgery'],
    doctorsHeading: 'Meet Our Spine Specialists',
    hospitalsHeading: 'Hospitals for Spine Surgery',
    articleSections: SPINE_SURGERY_ARTICLE_SECTIONS,
    faqs: SPINE_SURGERY_FAQS,
  },
  IVF: {
    title: 'IVF & Fertility Treatments',
    intro: IVF_INTRO,
    priceTables: TREATMENT_COST_GUIDES.IVF,
    // The doctor directory has no fertility/reproductive-endocrinology
    // specialist under any specialty value at present, so this deliberately
    // resolves to zero doctors rather than reassigning a gynaecologist (whose
    // actual specialty is oncology or general gynaecology, not fertility) to
    // fill the gap. TreatmentArticleGuide already hides the doctors and
    // hospitals sections entirely when there are none to show, so the page
    // still reads cleanly — it just runs straight from the price table into
    // the article. Once a fertility specialist is added to the directory
    // under this specialty, their photo appears here with no code change.
    doctorSpecialty: 'Fertility',
    doctorsHeading: 'Meet Our Fertility Specialists',
    hospitalsHeading: 'Hospitals for IVF & Fertility Treatment',
    articleSections: IVF_ARTICLE_SECTIONS,
    faqs: IVF_FAQS,
    disclaimer: IVF_DISCLAIMER,
  },
  Gynaecology: {
    title: 'Gynaecological Surgery & Women’s Health',
    intro: GYNAECOLOGY_INTRO,
    priceTables: TREATMENT_COST_GUIDES.Gynaecology,
    doctorSpecialty: 'Gynaecology',
    doctorsHeading: 'Meet Our Gynaecology Specialists',
    hospitalsHeading: 'Hospitals for Gynaecological Care',
    articleSections: GYNAECOLOGY_ARTICLE_SECTIONS,
    faqs: GYNAECOLOGY_FAQS,
    // No closing disclaimer was supplied for this guide, same as
    // Orthopedics and Spine Surgery.
  },
  'Liver Transplant': {
    title: 'Liver Transplant',
    intro: LIVER_TRANSPLANT_INTRO,
    priceTables: TREATMENT_COST_GUIDES['Liver Transplant'],
    doctorSpecialty: 'Liver Transplant',
    doctorsHeading: 'Meet Our Liver Transplant Specialists',
    hospitalsHeading: 'Hospitals for Liver Transplant',
    articleSections: LIVER_TRANSPLANT_ARTICLE_SECTIONS,
    faqs: LIVER_TRANSPLANT_FAQS,
    // No closing disclaimer was supplied for this guide either.
  },
  'Bone Marrow': {
    title: 'Bone Marrow Transplant (Stem Cell Transplant)',
    intro: BONE_MARROW_INTRO,
    priceTables: TREATMENT_COST_GUIDES['Bone Marrow'],
    // No "Bone Marrow" specialty exists in the doctor directory — every BMT
    // doctor is filed under "Oncology Care", with the sub-specialty living in
    // a department column the live database doesn't have yet (see
    // boneMarrowArticle.js). Named by slug instead.
    doctorSlugs: BONE_MARROW_DOCTOR_SLUGS,
    doctorsHeading: 'Meet Our Bone Marrow Transplant Specialists',
    hospitalsHeading: 'Hospitals for Bone Marrow Transplant',
    articleSections: BONE_MARROW_ARTICLE_SECTIONS,
    faqs: BONE_MARROW_FAQS,
    // No closing disclaimer was supplied for this guide either.
  },
};

// Every other specialty with a static cost guide (client/src/data/
// treatmentCostGuides.js) instead of a card grid. Checked ahead of the
// treatments-table filtering below, same reasoning as Cardiac Surgery: this
// is reference content, not bookable catalog rows.
const STATIC_GUIDE_SPECIALTIES = Object.keys(TREATMENT_COST_GUIDES);

// Leftover rows from the original seed data — not a considered list of the
// site's specialties (see the same note on the home page's specialty grid in
// Home.jsx). Excluded by name rather than by emptying the treatments table,
// since the table itself isn't ours to clear out from here.
const LEGACY_PLACEHOLDER_SPECIALTIES = new Set(['Bariatric Surgery', 'Dental', 'Transplant']);

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
  const { t } = useTranslation();
  const { data: treatments, loading, error } = useApi('/treatments');
  const [searchParams] = useSearchParams();
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || 'All');
  const [query, setQuery] = useState('');
  const [symptom, setSymptom] = useState('heart');

  const specialties = useMemo(() => {
    // Static-guide specialties are guaranteed unconditionally — including
    // while `treatments` is still null, whether that's because the request
    // hasn't resolved yet or because it failed outright. Their chips, and the
    // guides those chips reveal, don't depend on the treatments table at all
    // (see the render logic below), so they can't be allowed to depend on
    // that fetch merely to appear in this list.
    const fromData = new Set(
      treatments
        ? treatments.map((t) => t.specialty).filter((item) => !LEGACY_PLACEHOLDER_SPECIALTIES.has(item))
        : []
    );
    fromData.add(CARDIAC_SURGERY_SPECIALTY);
    STATIC_GUIDE_SPECIALTIES.forEach((item) => fromData.add(item));
    return ['All', ...fromData];
  }, [treatments]);

  const filtered = useMemo(() => {
    if (!treatments) return [];
    const q = query.trim().toLowerCase();

    return treatments.filter((treatment) => {
      if (LEGACY_PLACEHOLDER_SPECIALTIES.has(treatment.specialty)) return false;
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

      {/*
        Static guides (Cardiac Surgery and the eight others in
        TREATMENT_COST_GUIDES) render unconditionally here, ahead of and
        independent of the treatments-table loading/error states below.
        They're reference content with no treatments-table rows behind them,
        so they must not sit behind `{treatments && ...}` the way the
        database-driven grid does — that would make the whole guide
        disappear any time /api/treatments is slow, erroring, or simply
        misconfigured on a given deploy, which defeats the point of them
        being static in the first place.
      */}
      {specialty === CARDIAC_SURGERY_SPECIALTY && !query.trim() ? (
        <div
          id="treatments-grid"
          className="mx-auto w-full max-w-7xl scroll-mt-[160px] px-space-md py-space-3xl sm:px-space-2xl"
        >
          <CardiacSurgeryCostGuide />
        </div>
      ) : ARTICLE_GUIDES[specialty] && !query.trim() ? (
        <div
          id="treatments-grid"
          className="mx-auto w-full max-w-7xl scroll-mt-[160px] px-space-md py-space-3xl sm:px-space-2xl"
        >
          <TreatmentArticleGuide {...ARTICLE_GUIDES[specialty]} />
        </div>
      ) : TREATMENT_COST_GUIDES[specialty] && !query.trim() ? (
        <div
          id="treatments-grid"
          className="mx-auto w-full max-w-7xl scroll-mt-[160px] px-space-md py-space-3xl sm:px-space-2xl"
        >
          <div className="space-y-space-2xl">
            {TREATMENT_COST_GUIDES[specialty].map((table) => (
              <CostGuideTable key={table.title} {...table} />
            ))}
          </div>
        </div>
      ) : specialty === 'All' && !query.trim() ? (
        // The default landing view lists every core specialty as a static,
        // clickable row rather than the database-driven card grid below —
        // same reasoning as the guides above: this list must not disappear
        // just because /api/treatments is slow or erroring, since it's the
        // very content that used to sit behind that error message.
        <div
          id="treatments-grid"
          className="mx-auto w-full max-w-7xl scroll-mt-[160px] px-space-md py-space-3xl sm:px-space-2xl"
        >
          <h2 className="mb-space-sm text-headline-lg font-bold text-primary">
            Explore Our Core Medical Specialties
          </h2>
          <p className="mb-space-xl text-body-md text-on-surface-variant">
            {t('home.specialties.cardText')}
          </p>
          <div className="space-y-space-sm">
            {ALL_GUIDE_SPECIALTIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSpecialty(item);
                  document.getElementById('treatments-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex w-full items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-space-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                    <Icon name={specialtyIcon(item)} className="!text-[20px]" />
                  </div>
                  <div>
                    <p className="text-label-md font-semibold text-on-surface">{item}</p>
                    <p className="text-body-sm text-on-surface-variant">{t('home.specialties.cardText')}</p>
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-space-3xs rounded-lg bg-primary px-space-md py-space-xs text-label-sm font-semibold text-on-primary">
                  {t('common.exploreTreatments')}
                  <Icon name="chevron_right" className="!text-[16px]" />
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {loading && <StateMessage>Loading treatments...</StateMessage>}
          {error && (
            <StateMessage>Couldn't load treatments right now. Please try again shortly.</StateMessage>
          )}

          {treatments && (
            <div
              id="treatments-grid"
              className="mx-auto w-full max-w-7xl scroll-mt-[160px] px-space-md py-space-3xl sm:px-space-2xl"
            >
              {filtered.length === 0 ? (
                <StateMessage>No treatments match that search.</StateMessage>
              ) : (
                <div className="grid grid-cols-1 gap-space-xl md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((treatment) => (
                    <TreatmentCard key={treatment.id} treatment={treatment} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
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
