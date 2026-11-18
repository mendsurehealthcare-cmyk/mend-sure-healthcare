import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { specialtyIcon } from '../lib/specialtyIcons';
import {
  SEARCH_DEPARTMENTS,
  SEARCH_DEPARTMENT_OPTIONS,
  hasTreatmentGuide,
  hospitalsForTreatment,
  treatmentFromSlug,
  treatmentSlug,
} from '../lib/treatmentHospitals';
import HospitalWideCard from '../components/HospitalWideCard';
import Icon from '../components/Icon';
import PaginatedGrid from '../components/PaginatedGrid';
import StateMessage from '../components/StateMessage';

/*
  /hospitals/treatment/:treatmentSlug?city=Delhi

  Where the navbar's Hospitals menu lands: only the hospitals that offer the
  chosen treatment (see lib/treatmentHospitals.js for how that's decided),
  with a Country / City / Treatment search bar to switch between them. Each
  card opens the hospital's profile page.

  The treatment and city live in the URL, not state, so a result is
  shareable and survives the Back button from a hospital profile.
*/

// India is the only country the network covers today. Kept as a list so the
// bar's Country field has somewhere to grow into.
const COUNTRIES = ['India'];

// A styled replacement for <select> — the browser's native option list
// can't be themed, so it clashed with the site. `options` is a list of
// { value, label }, optionally grouped: a row with `subCount` is a main
// department, and rows with a matching `parent` are its sub-departments,
// kept hidden until the main row is hovered (or reached with the arrow
// keys). Supports click, Escape, and arrow/Enter keys.
function BarSelect({ id, label, icon, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  // Which main department's sub-departments are currently shown.
  const [expanded, setExpanded] = useState(null);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const selected = options.find((option) => option.value === value) || options[0];
  const visible = options.filter((option) => !option.parent || option.parent === expanded);

  // Moving onto a main department reveals its subs (and hides any other
  // group's); moving onto a sub keeps its own group open.
  function highlight(option) {
    if (option.subCount) setExpanded(option.value);
    else if (!option.parent) setExpanded(null);
    const list = options.filter(
      (item) =>
        !item.parent ||
        item.parent === (option.subCount ? option.value : option.parent || null)
    );
    setActive(Math.max(0, list.findIndex((item) => item.value === option.value)));
  }

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  // Keep the highlighted option in view while arrowing through a long list.
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const openList = () => {
    highlight(selected);
    setOpen(true);
  };
  const choose = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  function handleKeyDown(event) {
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      openList();
      return;
    }
    if (!open) return;
    if (event.key === 'Escape') setOpen(false);
    else if (event.key === 'ArrowDown') highlight(visible[Math.min(visible.length - 1, active + 1)]);
    else if (event.key === 'ArrowUp') highlight(visible[Math.max(0, active - 1)]);
    else if (event.key === 'Enter' || event.key === ' ') choose(visible[active]);
    else return;
    event.preventDefault();
  }

  return (
    <div
      ref={rootRef}
      className="relative flex-1 border-outline-variant/30 bg-surface-container-lowest first:rounded-t-lg last:rounded-b-lg md:border-l md:first:rounded-l-lg md:first:rounded-tr-none md:first:border-l-0 md:last:rounded-r-lg md:last:rounded-bl-none"
    >
      <button
        id={id}
        type="button"
        aria-label={`${label}: ${selected?.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className="flex h-full w-full items-center gap-space-xs px-space-md py-space-sm text-left text-body-md text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
      >
        {icon && <Icon name={icon} className="!text-[20px] text-secondary" />}
        <span className="flex-1 truncate">{selected?.label}</span>
        <Icon
          name="expand_more"
          className={`!text-[20px] text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={label}
          className="absolute top-full right-0 left-0 z-30 mt-space-xs max-h-80 overflow-y-auto rounded-xl bg-surface-container-lowest p-space-xs shadow-xl ring-1 ring-outline-variant/30"
        >
          {visible.map((option, index) => {
            const isSelected = option.value === value;
            const isOpenGroup = option.subCount > 0 && expanded === option.value;
            const isSub = Boolean(option.parent);
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-expanded={option.subCount ? isOpenGroup : undefined}
                onMouseEnter={() => highlight(option)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(option);
                }}
                className={`flex cursor-pointer items-center justify-between gap-space-sm rounded-lg py-space-xs pr-space-sm transition-colors ${
                  isSub
                    ? 'ml-space-md border-l-2 border-secondary/40 pl-space-md text-body-sm'
                    : 'pl-space-sm text-body-md'
                } ${
                  isSelected
                    ? 'bg-primary text-on-primary'
                    : index === active
                      ? 'bg-surface-container text-primary'
                      : 'text-on-surface'
                }`}
              >
                <span className="truncate">{option.label}</span>
                <span className="flex shrink-0 items-center gap-space-2xs">
                  {/* The "has sub-departments" hint: a small count pill and
                      a chevron that turns down once the group is open. */}
                  {option.subCount > 0 && (
                    <>
                      <span
                        className={`rounded-full px-space-xs text-label-sm ${
                          isSelected ? 'bg-on-primary/20' : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        {option.subCount}
                      </span>
                      <Icon
                        name="chevron_right"
                        className={`!text-[18px] transition-transform ${isOpenGroup ? 'rotate-90' : ''}`}
                      />
                    </>
                  )}
                  {isSelected && <Icon name="check" className="!text-[18px]" />}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Holds the bar's choices locally until Search is pressed. Keyed by the
// current URL in the parent, so it resets to match whenever the page moves
// to a new treatment or city (e.g. from the navbar menu).
function SearchBar({ initialTreatment, initialCity, cities }) {
  const navigate = useNavigate();
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [city, setCity] = useState(initialCity);
  const [treatment, setTreatment] = useState(initialTreatment);

  function handleSubmit(event) {
    event.preventDefault();
    const search = city ? `?city=${encodeURIComponent(city)}` : '';
    navigate(`/hospitals/treatment/${treatmentSlug(treatment)}${search}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-space-sm rounded-xl bg-primary p-space-md shadow-lg md:flex-row md:items-stretch"
    >
      <div className="flex flex-1 flex-col divide-y divide-outline-variant/30 rounded-lg md:flex-row md:divide-y-0">
        <BarSelect
          id="bar-country"
          label="Country"
          icon="public"
          value={country}
          onChange={setCountry}
          options={COUNTRIES.map((item) => ({ value: item, label: item }))}
        />
        <BarSelect
          id="bar-city"
          label="City"
          icon="location_on"
          value={city}
          onChange={setCity}
          options={[
            { value: '', label: 'All Cities' },
            ...cities.map((item) => ({ value: item, label: item })),
          ]}
        />
        {/* The sheet's departments; the current treatment is kept at the top
            when it's a guide specialty (from the navbar menu) that isn't one
            of them, so the dropdown still shows what's selected. */}
        <BarSelect
          id="bar-treatment"
          label="Treatment"
          icon="medical_services"
          value={treatment}
          onChange={setTreatment}
          options={
            SEARCH_DEPARTMENTS.includes(initialTreatment)
              ? SEARCH_DEPARTMENT_OPTIONS
              : [{ value: initialTreatment, label: initialTreatment }, ...SEARCH_DEPARTMENT_OPTIONS]
          }
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-space-xs rounded-lg bg-secondary px-space-2xl py-space-sm text-label-md font-semibold text-on-secondary transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
      >
        <Icon name="search" className="!text-[20px]" />
        Search
      </button>
    </form>
  );
}

export default function HospitalsByTreatment() {
  const { treatmentSlug: slug } = useParams();
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || '';
  const treatment = treatmentFromSlug(slug);

  const { data: hospitals, loading: hospitalsLoading, error: hospitalsError } =
    useApi('/hospitals?pageSize=300');
  const { data: doctors, loading: doctorsLoading, error: doctorsError } =
    useApi('/doctors?pageSize=300');
  const loading = hospitalsLoading || doctorsLoading;
  const error = hospitalsError || doctorsError;

  const matches = useMemo(
    () => (treatment ? hospitalsForTreatment(hospitals, doctors, treatment) : []),
    [hospitals, doctors, treatment]
  );

  const shown = useMemo(
    () =>
      matches
        .filter(({ hospital }) => !city || hospital.city === city)
        // Most specialists for this treatment first, then by name.
        .sort(
          (a, b) =>
            b.specialistCount - a.specialistCount ||
            (a.hospital.name || '').localeCompare(b.hospital.name || '')
        ),
    [matches, city]
  );

  // Every city in the network, not just this treatment's, so the bar can be
  // used to search a different treatment in a city this one doesn't cover.
  const cities = useMemo(
    () =>
      [...new Set((hospitals || []).map((hospital) => hospital.city).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [hospitals]
  );

  if (!treatment) {
    return (
      <StateMessage>
        We couldn't find that treatment.{' '}
        <Link to="/hospitals" className="text-secondary hover:underline">
          See all hospitals
        </Link>
      </StateMessage>
    );
  }

  const place = city ? `${city}, India` : 'India';

  return (
    <div className="flex w-full flex-col">
      <section className="bg-surface-container-low px-space-md pt-space-3xl pb-space-2xl sm:px-space-xl">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-space-xl text-center text-headline-xl text-primary">
            Best Hospitals for {treatment} in {place}
          </h1>
          <SearchBar
            key={`${slug}|${city}`}
            initialTreatment={treatment}
            initialCity={city}
            cities={cities}
          />
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-space-md py-space-2xl sm:px-space-xl">
        <p className="mb-space-2xl max-w-5xl text-body-lg leading-relaxed text-on-surface-variant">
          Looking for the best hospital for {treatment.toLowerCase()} in {place}? Below are the
          accredited hospitals in our network where our {treatment.toLowerCase()} specialists
          practise, with the ones with the most specialists first. Open any hospital to see its
          full profile, departments, and doctors — or send us your reports for a personalised
          treatment plan and quote.
          {hasTreatmentGuide(treatment) && (
            <>
              {' '}
              <Link
                to={`/treatments?specialty=${encodeURIComponent(treatment)}`}
                className="font-semibold text-secondary hover:underline"
              >
                Read the {treatment} guide and costs
              </Link>
              .
            </>
          )}
        </p>

        <div>
          <div className="mb-space-lg flex flex-wrap items-center justify-between gap-space-sm">
            <h2 className="flex items-center gap-space-sm text-headline-sm text-on-surface">
              <Icon name={specialtyIcon(treatment)} className="text-secondary" />
              {loading ? 'Finding hospitals…' : `${shown.length} ${shown.length === 1 ? 'hospital' : 'hospitals'} found`}
            </h2>
            {city && (
              <Link
                to={`/hospitals/treatment/${slug}`}
                className="text-label-md font-semibold text-secondary hover:underline"
              >
                Show all cities
              </Link>
            )}
          </div>

          {loading && <StateMessage>Loading hospitals...</StateMessage>}
          {error && (
            <StateMessage>Couldn't load hospitals right now. Please try again shortly.</StateMessage>
          )}

          {!loading && !error && shown.length === 0 && (
            <div className="rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
              <Icon name="local_hospital" className="!text-[40px] text-outline" />
              <p className="mt-space-sm text-body-lg text-on-surface">
                {city
                  ? `No partner hospital in ${city} is listed for ${treatment} yet.`
                  : `No partner hospital is listed for ${treatment} yet.`}
              </p>
              <p className="mt-space-xs text-body-md text-on-surface-variant">
                Our care team can still match you with the right hospital —{' '}
                <Link to="/contact" className="font-semibold text-secondary hover:underline">
                  send us your reports
                </Link>
                .
              </p>
            </div>
          )}

          {!loading && shown.length > 0 && (
            <PaginatedGrid
              key={`${slug}|${city}`}
              items={shown}
              pageSize={7}
              gridClassName="flex flex-col gap-space-xl"
              renderItem={({ hospital }) => (
                <HospitalWideCard key={hospital.id} hospital={hospital} contactActions />
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}
