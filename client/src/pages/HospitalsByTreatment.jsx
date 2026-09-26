import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { specialtyIcon } from '../lib/specialtyIcons';
import {
  hospitalsForTreatment,
  treatmentFromSlug,
  treatmentSlug,
} from '../lib/treatmentHospitals';
import { ALL_GUIDE_SPECIALTIES } from '../data/treatmentCostGuides';
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

const selectClasses =
  'h-full w-full cursor-pointer appearance-none bg-transparent px-space-md py-space-sm pr-10 text-body-md text-on-surface focus:outline-none';

function BarSelect({ id, label, value, onChange, children }) {
  return (
    <div className="relative flex-1 border-outline-variant/30 bg-surface-container-lowest first:rounded-t-lg md:border-l md:first:rounded-l-lg md:first:rounded-tr-none md:first:border-l-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={selectClasses}>
        {children}
      </select>
      <Icon
        name="expand_more"
        className="pointer-events-none absolute top-1/2 right-space-sm -translate-y-1/2 !text-[20px] text-on-surface-variant"
      />
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
      <div className="flex flex-1 flex-col divide-y divide-outline-variant/30 overflow-hidden rounded-lg md:flex-row md:divide-y-0">
        <BarSelect id="bar-country" label="Country" value={country} onChange={setCountry}>
          {COUNTRIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </BarSelect>
        <BarSelect id="bar-city" label="City" value={city} onChange={setCity}>
          <option value="">All Cities</option>
          {cities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </BarSelect>
        <BarSelect id="bar-treatment" label="Treatment" value={treatment} onChange={setTreatment}>
          {ALL_GUIDE_SPECIALTIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </BarSelect>
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
          treatment plan and quote.{' '}
          <Link
            to={`/treatments?specialty=${encodeURIComponent(treatment)}`}
            className="font-semibold text-secondary hover:underline"
          >
            Read the {treatment} guide and costs
          </Link>
          .
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
