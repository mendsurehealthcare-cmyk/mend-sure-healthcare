import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../lib/useApi';
import { PRIORITY_DOCTOR_SLUGS, pickBySlug } from '../lib/priorityDoctors';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import DoctorCard from '../components/DoctorCard';
import PaginatedGrid from '../components/PaginatedGrid';
import StateMessage from '../components/StateMessage';

const PRIORITY_SLUG_SET = new Set(PRIORITY_DOCTOR_SLUGS);

export default function Doctors() {
  const { t } = useTranslation();
  // The whole directory in one request: filtering and searching happen in the
  // browser, so a paginated response would silently hide most of the roster.
  const { data: doctors, loading, error } = useApi('/doctors?pageSize=300');
  const [specialty, setSpecialty] = useState('All');
  const [query, setQuery] = useState('');

  // Ordered by how many doctors each covers, so the biggest departments come
  // first rather than whatever order the rows happened to arrive in.
  const specialties = useMemo(() => {
    if (!doctors) return ['All'];

    const counts = new Map();
    for (const doctor of doctors) {
      if (doctor.specialty) counts.set(doctor.specialty, (counts.get(doctor.specialty) || 0) + 1);
    }

    return [
      'All',
      ...[...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([s]) => s),
    ];
  }, [doctors]);

  const specialtyCounts = useMemo(() => {
    const counts = new Map();
    for (const doctor of doctors || []) {
      if (doctor.specialty) counts.set(doctor.specialty, (counts.get(doctor.specialty) || 0) + 1);
    }
    return counts;
  }, [doctors]);

  const filtered = useMemo(() => {
    if (!doctors) return [];
    const q = query.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSpecialty = specialty === 'All' || doctor.specialty === specialty;
      // Searching the department and job title too: patients look for
      // "cardiology" or "transplant", which are department words, and referrers
      // look for "Chairman".
      const matchesQuery =
        !q ||
        [
          doctor.name,
          doctor.specialty,
          doctor.department,
          doctor.designation,
          doctor.hospitals?.name,
          doctor.hospital_name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchesSpecialty && matchesQuery;
    });
  }, [doctors, specialty, query]);

  // The default view (no specialty chosen, no search typed) is split into two
  // sections instead of one 103-card grid: the priority specialists up front,
  // the rest paged nine at a time below. The moment a filter narrows the
  // list, that split stops making sense — a search for one name shouldn't
  // still be organised around "priority vs. everyone else" — so filtered
  // results fall back to a single flat grid, same as before this page had a
  // priority set at all.
  const isDefaultView = specialty === 'All' && query.trim() === '';

  const priorityDoctors = useMemo(
    () => pickBySlug(doctors, PRIORITY_DOCTOR_SLUGS),
    [doctors]
  );

  const otherDoctors = useMemo(
    () => (doctors || []).filter((doctor) => !PRIORITY_SLUG_SET.has(doctor.slug)),
    [doctors]
  );

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
eyebrow={t('pages.doctors.eyebrow')}
        eyebrowIcon="stethoscope"
title={t('pages.doctors.title')}
subtitle={t('pages.doctors.subtitle')}
        aside={
          <div className="flex items-center gap-space-md rounded-xl bg-surface-container/10 p-space-md backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">{doctors?.length ?? '—'}</span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">{t('pages.doctors.specialists')}</span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">
                {specialties.length > 1 ? specialties.length - 1 : '—'}
              </span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">{t('pages.doctors.specialties')}</span>
            </div>
          </div>
        }
      />

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
                {item === 'All'
                  ? `${t('pages.doctors.allSpecialists')} (${doctors?.length ?? 0})`
                  : `${item} (${specialtyCounts.get(item) ?? 0})`}
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
              placeholder={t('pages.doctors.searchPlaceholder')}
              className="w-full rounded-lg bg-surface-container-lowest py-space-xs pr-space-md pl-12 text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {loading && <StateMessage>{t('pages.doctors.loading')}</StateMessage>}
      {error && (
        <StateMessage>{t('pages.doctors.error')}</StateMessage>
      )}

      {doctors && (
        <div className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-2xl">
          {filtered.length === 0 ? (
            <StateMessage>{t('pages.doctors.noMatch')}</StateMessage>
          ) : isDefaultView ? (
            <>
              <section className="mb-space-3xl">
                <div className="mb-space-lg flex items-center gap-space-xs">
                  <Icon name="star" filled className="!text-[22px] text-secondary" />
                  <h2 className="text-headline-md font-bold text-primary">
                    {t('pages.doctors.priorityTitle')}
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-space-xl md:grid-cols-2 lg:grid-cols-3">
                  {priorityDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </section>

              {otherDoctors.length > 0 && (
                <section>
                  <h2 className="mb-space-lg text-headline-md font-bold text-primary">
                    {t('pages.doctors.moreTitle')}
                  </h2>
                  <PaginatedGrid
                    items={otherDoctors}
                    pageSize={9}
                    pageLabel={(page, count) => t('pages.doctors.pageOf', { page, count })}
                    prevLabel={t('pages.doctors.prevPage')}
                    nextLabel={t('pages.doctors.nextPage')}
                    renderItem={(doctor) => <DoctorCard key={doctor.id} doctor={doctor} />}
                  />
                </section>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 gap-space-xl md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
