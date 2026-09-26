import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import CostGuideTable from '../components/CostGuideTable';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import StateMessage from '../components/StateMessage';
import { formatINR, formatUSD } from '../lib/format';
import { slugify } from '../lib/slug';
import { specialtyIcon } from '../lib/specialtyIcons';
import {
  ALL_GUIDE_SPECIALTIES,
  CARDIAC_INDIA_COSTS,
  CARDIAC_SURGERY_SPECIALTY,
  TREATMENT_COST_GUIDES,
} from '../data/treatmentCostGuides';

/*
  Every priced procedure on the site, on one page, grouped by specialty.

  Reads the same static data the Treatments page's per-specialty guides do
  (treatmentCostGuides.js), so a price is only ever edited in one place.
  Cardiac Surgery's list is stored as numbers rather than pre-formatted
  strings, so it's converted into the shared CostGuideTable shape here.
*/
const CARDIAC_TABLE = {
  title: 'Average Cost of Various Heart Surgeries in India',
  columns: ['Procedure', 'Cost in India (INR)', 'Cost in India (USD)'],
  rows: CARDIAC_INDIA_COSTS.map((row) => [row.procedure, formatINR(row.inr), formatUSD(row.usd)]),
};

const COST_TABLES = {
  [CARDIAC_SURGERY_SPECIALTY]: [CARDIAC_TABLE],
  ...TREATMENT_COST_GUIDES,
};

export default function Cost() {
  const { t } = useTranslation();
  const { hash, key } = useLocation();
  const [query, setQuery] = useState('');

  // The navbar's Cost menu links to /cost#cost-<specialty>. A typed search
  // could have filtered that section out, so a new hash clears it first
  // (adjusted during render, React's "state on prop change" pattern)...
  const [lastHash, setLastHash] = useState(hash);
  if (hash !== lastHash) {
    setLastHash(hash);
    setQuery('');
  }

  // ...then scrolls to it, since React Router doesn't scroll to hashes on its
  // own. Keyed on the navigation too, so picking the same item again (same
  // hash) still scrolls back to it. The section's scroll-mt clears the fixed
  // header and sticky bar.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash, key]);

  // Filters rows by procedure name; a match on the specialty name itself
  // keeps that specialty's tables whole. Tables left with no rows are dropped,
  // and so is any specialty left with no tables.
  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();

    return ALL_GUIDE_SPECIALTIES.map((specialty) => {
      const tables = COST_TABLES[specialty] || [];
      if (!q || specialty.toLowerCase().includes(q)) return { specialty, tables };

      const matching = tables
        .map((table) => ({
          ...table,
          rows: table.rows.filter((row) => row[0].toLowerCase().includes(q)),
        }))
        .filter((table) => table.rows.length > 0);

      return { specialty, tables: matching };
    }).filter((section) => section.tables.length > 0);
  }, [query]);

  const procedureCount = useMemo(
    () =>
      Object.values(COST_TABLES)
        .flat()
        .reduce((total, table) => total + table.rows.length, 0),
    []
  );

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow={t('pages.cost.eyebrow')}
        eyebrowIcon="payments"
        title={t('pages.cost.title')}
        subtitle={t('pages.cost.subtitle')}
        aside={
          <div className="flex items-center gap-space-md rounded-xl bg-surface-container/10 p-space-md backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">{procedureCount}</span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">
                {t('pages.cost.procedures')}
              </span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">
                {ALL_GUIDE_SPECIALTIES.length}
              </span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">
                {t('pages.cost.specialties')}
              </span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">Up to 80%</span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">
                {t('pages.cost.savings')}
              </span>
            </div>
          </div>
        }
      />

      {/* Sticky jump bar — offset matches the fixed header height in Layout */}
      <div className="sticky top-[88px] z-40 bg-surface/90 px-space-md py-space-md shadow-sm backdrop-blur-xl sm:px-space-2xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-space-md">
          <div className="no-scrollbar flex items-center gap-space-sm overflow-x-auto py-space-2xs">
            {sections.map(({ specialty }) => (
              <a
                key={specialty}
                href={`#cost-${slugify(specialty)}`}
                className="rounded-lg bg-surface-container px-space-md py-space-xs text-label-md whitespace-nowrap text-on-surface transition-all hover:bg-surface-container-high"
              >
                {specialty}
              </a>
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
              placeholder={t('pages.cost.searchPlaceholder')}
              aria-label={t('pages.cost.searchPlaceholder')}
              className="w-full rounded-lg bg-surface-container-lowest py-space-xs pr-space-md pl-12 text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-space-3xl px-space-md py-space-3xl sm:px-space-2xl">
        {sections.length === 0 ? (
          <StateMessage>{t('pages.cost.noMatch')}</StateMessage>
        ) : (
          sections.map(({ specialty, tables }) => (
            <section key={specialty} id={`cost-${slugify(specialty)}`} className="scroll-mt-[180px]">
              <div className="mb-space-lg flex flex-wrap items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                    <Icon name={specialtyIcon(specialty)} className="!text-[20px]" />
                  </div>
                  <h2 className="text-headline-md font-bold text-primary">{specialty}</h2>
                </div>
                <Link
                  to={`/treatments?specialty=${encodeURIComponent(specialty)}`}
                  className="flex items-center gap-space-3xs text-label-md font-semibold text-secondary hover:underline"
                >
                  {t('pages.cost.fullGuide')}
                  <Icon name="chevron_right" className="!text-[16px]" />
                </Link>
              </div>
              <div className="space-y-space-xl">
                {tables.map((table) => (
                  <CostGuideTable key={table.title} {...table} />
                ))}
              </div>
            </section>
          ))
        )}

        <p className="text-body-sm text-on-surface-variant">{t('pages.cost.disclaimer')}</p>
      </div>

      <div className="bg-surface-container-low px-space-md py-space-3xl sm:px-space-2xl">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-space-lg lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="mb-space-sm text-headline-lg text-on-surface">{t('pages.cost.ctaTitle')}</h2>
            <p className="text-body-lg leading-relaxed text-on-surface-variant">{t('pages.cost.ctaBody')}</p>
          </div>
          <Button to="/contact" variant="secondary" className="px-space-xl py-space-md">
            <Icon name="request_quote" className="!text-[20px]" />
            {t('pages.cost.ctaButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}
