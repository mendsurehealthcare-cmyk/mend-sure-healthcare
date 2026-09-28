import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApi } from '../lib/useApi';
import { PRIORITY_DOCTOR_SLUGS } from '../lib/priorityDoctors';
import { doctorImage } from '../lib/directoryImages';
import { specialtyIcon } from '../lib/specialtyIcons';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PaginatedGrid from '../components/PaginatedGrid';
import StateMessage from '../components/StateMessage';

// Featured doctors lead the list, in the order PRIORITY_DOCTOR_SLUGS gives
// them; everyone else follows alphabetically.
const PRIORITY_RANK = new Map(PRIORITY_DOCTOR_SLUGS.map((slug, index) => [slug, index]));

function byFeaturedThenName(a, b) {
  const rankA = PRIORITY_RANK.get(a.slug) ?? Infinity;
  const rankB = PRIORITY_RANK.get(b.slug) ?? Infinity;
  if (rankA !== rankB) return rankA - rankB;
  return (a.name || '').localeCompare(b.name || '');
}

// Most doctors first, then alphabetically.
function countsByKey(items, key) {
  const counts = new Map();
  for (const item of items) {
    const value = item[key];
    if (value) counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function Checkbox({ checked, onChange, label, count }) {
  return (
    <label className="group flex cursor-pointer items-start gap-space-sm rounded-lg px-space-2xs py-space-2xs transition-colors hover:bg-surface-container-low">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-secondary"
      />
      <span
        className={`flex-1 text-body-md ${checked ? 'font-semibold text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}
      >
        {label}
      </span>
      <span className="shrink-0 text-body-sm text-outline">{count}</span>
    </label>
  );
}

// One row in the results list: photo, name, role, hospital, experience.
function DoctorRow({ doctor }) {
  const hospital = doctor.hospitals?.name || doctor.hospital_name;
  const role = [doctor.designation, doctor.department || doctor.specialty].filter(Boolean).join(' · ');

  return (
    <Link
      to={`/doctors/${doctor.slug}`}
      className="group flex items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-sm shadow-sm transition-all hover:shadow-md sm:p-space-md"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-primary-fixed sm:h-24 sm:w-24">
        {doctorImage(doctor) ? (
          <img
            src={doctorImage(doctor)}
            alt={doctor.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary">
            <Icon name={specialtyIcon(doctor.specialty)} className="!text-[32px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-space-sm gap-y-space-3xs">
          <h3 className="text-label-md font-bold text-on-surface group-hover:text-primary sm:text-headline-sm">
            {doctor.name}
          </h3>
          {PRIORITY_RANK.has(doctor.slug) && (
            <span className="flex items-center gap-space-3xs rounded-full bg-secondary px-space-sm py-space-3xs text-label-sm font-semibold text-on-secondary">
              <Icon name="star" filled className="!text-[12px]" />
              Featured
            </span>
          )}
        </div>
        {role && <p className="mt-space-3xs text-body-sm text-on-surface-variant">{role}</p>}
        <div className="mt-space-xs flex flex-wrap gap-x-space-md gap-y-space-3xs text-body-sm text-on-surface-variant">
          {hospital && (
            <span className="flex items-center gap-space-3xs">
              <Icon name="local_hospital" className="!text-[16px] text-secondary" />
              {hospital}
            </span>
          )}
          {doctor.experience_years && (
            <span className="flex items-center gap-space-3xs">
              <Icon name="workspace_premium" className="!text-[16px] text-secondary" />
              {doctor.experience_years}+ years experience
            </span>
          )}
        </div>
      </div>

      <span className="hidden shrink-0 items-center gap-space-3xs rounded-lg bg-primary px-space-md py-space-xs text-label-sm font-semibold text-on-primary transition-colors group-hover:bg-primary-container sm:flex">
        View Profile
        <Icon name="chevron_right" className="!text-[16px]" />
      </span>
    </Link>
  );
}

export default function Doctors() {
  const { t } = useTranslation();
  // The whole directory in one request: filtering and searching happen in the
  // browser, so a paginated response would silently hide most of the roster.
  const { data: doctors, loading, error } = useApi('/doctors?pageSize=300');

  // Filters live in the URL rather than component state: clicking through to
  // a doctor's profile and pressing Back remounts this page, and state that
  // isn't in the URL doesn't survive that.
  //
  // Doctors are categorised by department (the "Department" column of
  // Mendsure_Departments_Doctors_Hospitals.xlsx), which can be ticked more
  // than once (?department=A&department=B). ?specialty= is still honoured —
  // the navbar's Doctors menu and a hospital page's specialty links use it —
  // and shows as a removable tag rather than a list of its own.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSpecialties = searchParams.getAll('specialty');
  const selectedDepartments = searchParams.getAll('department');
  const query = searchParams.get('q') || '';
  // ?hospital=<slug>, set by a hospital page's "Specialties Available Here"
  // links: narrows everything below — counts included — to that hospital.
  const hospitalSlug = searchParams.get('hospital') || '';

  const update = (change) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        change(next);
        return next;
      },
      { replace: true }
    );

  const toggleDepartment = (department) =>
    update((next) => {
      const values = next.getAll('department');
      next.delete('department');
      (values.includes(department)
        ? values.filter((item) => item !== department)
        : [...values, department]
      ).forEach((item) => next.append('department', item));
    });

  const removeSpecialty = (specialty) =>
    update((next) => {
      const values = next.getAll('specialty').filter((item) => item !== specialty);
      next.delete('specialty');
      values.forEach((item) => next.append('specialty', item));
    });

  const setQuery = (value) =>
    update((next) => {
      if (value) next.set('q', value);
      else next.delete('q');
    });

  const clearAll = () =>
    update((next) => {
      next.delete('specialty');
      next.delete('department');
      next.delete('q');
      next.delete('hospital');
    });

  const clearHospital = () => update((next) => next.delete('hospital'));

  // The doctors the department list and results are drawn from: narrowed by
  // hospital and specialty when a link set them, so the counts match.
  const pool = useMemo(
    () =>
      doctors?.filter(
        (doctor) =>
          (!hospitalSlug || doctor.hospitals?.slug === hospitalSlug) &&
          (selectedSpecialties.length === 0 || selectedSpecialties.includes(doctor.specialty))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [doctors, hospitalSlug, selectedSpecialties.join('|')]
  );
  const hospitalName =
    doctors?.find((doctor) => doctor.hospitals?.slug === hospitalSlug)?.hospitals?.name || '';

  const departments = useMemo(() => countsByKey(pool || [], 'department'), [pool]);
  const totalDepartments = useMemo(
    () => new Set((doctors || []).map((doctor) => doctor.department).filter(Boolean)).size,
    [doctors]
  );

  const filtered = useMemo(() => {
    if (!pool) return [];
    const q = query.trim().toLowerCase();

    return pool
      .filter((doctor) => {
        const matchesDepartment =
          selectedDepartments.length === 0 || selectedDepartments.includes(doctor.department);
        // Searching the department and job title too: patients look for
        // "cardiology" or "transplant", which are department words, and
        // referrers look for "Chairman".
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
        return matchesDepartment && matchesQuery;
      })
      .sort(byFeaturedThenName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, selectedDepartments.join('|'), query]);

  const activeFilters = [...selectedSpecialties, ...selectedDepartments];
  const hasFilters = activeFilters.length > 0 || query.trim() !== '' || hospitalSlug !== '';

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
              <span className="text-body-sm text-inverse-on-surface opacity-80">
                {t('pages.doctors.specialists')}
              </span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">{totalDepartments || '—'}</span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">
                {t('pages.doctors.departments')}
              </span>
            </div>
          </div>
        }
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-space-xl px-space-md py-space-2xl sm:px-space-2xl lg:grid-cols-12">
        {/* Filters */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:sticky lg:top-[110px] lg:max-h-[calc(100vh-130px)] lg:overflow-y-auto">
            <h2 className="mb-space-md text-headline-sm font-bold text-primary">
              {t('pages.doctors.findSpecialist')}
            </h2>

            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute top-1/2 left-space-sm -translate-y-1/2 !text-[20px] text-outline"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('pages.doctors.searchPlaceholder')}
                aria-label={t('pages.doctors.searchPlaceholder')}
                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest py-space-xs pr-space-md pl-10 text-body-md text-on-surface transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/30 focus:outline-none"
              />
            </div>

            <div className="my-space-lg h-px bg-outline-variant/30" />

            <h3 className="mb-space-xs text-label-md font-bold text-primary">
              {t('pages.doctors.departments')}
            </h3>
            <div className="flex flex-col">
              {departments.map(([department, count]) => (
                <Checkbox
                  key={department}
                  checked={selectedDepartments.includes(department)}
                  onChange={() => toggleDepartment(department)}
                  label={department}
                  count={count}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="lg:col-span-8 xl:col-span-9">
          <div className="mb-space-md flex flex-wrap items-baseline justify-between gap-space-sm">
            <h2 className="text-headline-md font-bold text-primary">{t('pages.doctors.resultsTitle')}</h2>
            {doctors && (
              <span className="text-body-sm text-on-surface-variant">
                {t('pages.doctors.resultCount', { count: filtered.length })}
              </span>
            )}
          </div>

          <div className="mb-space-lg flex flex-wrap items-center justify-between gap-space-sm rounded-xl bg-primary-fixed/60 px-space-md py-space-sm text-body-md text-on-surface">
            <span>
              {selectedDepartments.length > 0
                ? t('pages.doctors.showingFor', { filters: selectedDepartments.join(', ') })
                : t('pages.doctors.showingAll')}
              {query.trim() && ` · “${query.trim()}”`}
            </span>
            {selectedSpecialties.map((specialty) => (
              <span
                key={specialty}
                className="flex items-center gap-space-3xs rounded-full bg-surface-container-lowest px-space-sm py-space-3xs text-label-sm font-semibold text-primary"
              >
                {specialty}
                <button
                  type="button"
                  onClick={() => removeSpecialty(specialty)}
                  aria-label={t('pages.doctors.removeFilter', { filter: specialty })}
                  className="ml-space-3xs flex items-center rounded-full text-on-surface-variant hover:text-error"
                >
                  <Icon name="close" className="!text-[14px]" />
                </button>
              </span>
            ))}
            {hospitalSlug && (
              <span className="flex items-center gap-space-3xs rounded-full bg-surface-container-lowest px-space-sm py-space-3xs text-label-sm font-semibold text-primary">
                <Icon name="local_hospital" className="!text-[14px] text-secondary" />
                {t('pages.doctors.atHospital', { hospital: hospitalName || hospitalSlug })}
                <button
                  type="button"
                  onClick={clearHospital}
                  aria-label={t('pages.doctors.removeHospital')}
                  className="ml-space-3xs flex items-center rounded-full text-on-surface-variant hover:text-error"
                >
                  <Icon name="close" className="!text-[14px]" />
                </button>
              </span>
            )}
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="text-label-sm font-semibold text-secondary hover:underline"
              >
                {t('pages.doctors.clearFilters')}
              </button>
            )}
          </div>

          {loading && <StateMessage>{t('pages.doctors.loading')}</StateMessage>}
          {error && <StateMessage>{t('pages.doctors.error')}</StateMessage>}

          {doctors &&
            (filtered.length === 0 ? (
              <StateMessage>{t('pages.doctors.noMatch')}</StateMessage>
            ) : (
              <PaginatedGrid
                key={`${activeFilters.join('|')}|${query}|${hospitalSlug}`}
                items={filtered}
                pageSize={10}
                gridClassName="flex flex-col gap-space-md"
                pageLabel={(page, count) => t('pages.doctors.pageOf', { page, count })}
                prevLabel={t('pages.doctors.prevPage')}
                nextLabel={t('pages.doctors.nextPage')}
                renderItem={(doctor) => <DoctorRow key={doctor.id} doctor={doctor} />}
              />
            ))}
        </section>
      </div>
    </div>
  );
}
