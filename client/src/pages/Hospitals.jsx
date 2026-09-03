import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import Button from '../components/Button';
import Icon from '../components/Icon';
import StatBadge from '../components/StatBadge';
import HospitalWideCard from '../components/HospitalWideCard';
import StateMessage from '../components/StateMessage';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDE9idZWJ-5x6_Pndnsxh1wogzVY63HxhLQFj2BydHPNnrWaqlZusK4QJhI9pBfKyzy9cPC8wB0Ay_lyxbP5WalF9EKhv-VhkAewwS52nmgjCXv7afEtpuo8ozqgftcQDvdxZ1g_1o9KLI5Ey0opcgd7SaNBccDwHJLOkclb6BWORsBvvJvUVz4NNeggALJAalvMKwAUBuQkE8g5R1Wwk5j-Luj5aILjK9OdWnoOkMqhwkZsKhyuiSY';

const heroBadges = [
  { icon: 'shield_lock', label: 'Accredited Centers' },
  { icon: 'smart_toy', label: 'Advanced Surgical Suites' },
  { icon: 'language', label: '24/7 Multilingual Support' },
];

const journey = [
  {
    step: '1',
    title: 'Secure Record Review',
    text: 'Encrypted transfer of your scans and reports, reviewed by department heads within 48 hours.',
  },
  {
    step: '2',
    title: 'Door-to-Door Logistics',
    text: 'Medical visa invitation letters, flight guidance, and chauffeured airport transfers.',
  },
  {
    step: '3',
    title: 'Recovery & Follow-Up',
    text: 'Private recovery suites followed by continuous remote check-ins once you are back home.',
  },
];

export default function Hospitals() {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city');
  const {
    data: hospitals,
    loading,
    error,
  } = useApi(cityParam ? `/hospitals?city=${encodeURIComponent(cityParam)}` : '/hospitals');

  const [query, setQuery] = useState('');
  const [city, setCity] = useState('all');

  const cities = useMemo(() => {
    if (!hospitals) return [];
    return [...new Set(hospitals.map((h) => h.city).filter(Boolean))];
  }, [hospitals]);

  const filtered = useMemo(() => {
    if (!hospitals) return [];
    const q = query.trim().toLowerCase();

    return hospitals.filter((hospital) => {
      const matchesCity = city === 'all' || hospital.city === city;
      const matchesQuery =
        !q ||
        `${hospital.name} ${hospital.city || ''} ${(hospital.departments || []).join(' ')}`
          .toLowerCase()
          .includes(q);
      return matchesCity && matchesQuery;
    });
  }, [hospitals, query, city]);

  const totalDepartments = useMemo(() => {
    if (!hospitals) return 0;
    return new Set(hospitals.flatMap((h) => h.departments || [])).size;
  }, [hospitals]);

  return (
    <div className="flex w-full flex-col">
      {/* Hero with the facility finder card */}
      <section className="relative flex min-h-[480px] w-full items-center justify-center overflow-hidden bg-primary">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary via-primary/90 to-transparent" />

        <div className="relative z-20 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-space-xl px-space-md py-space-3xl sm:px-space-xl lg:grid-cols-12">
          <div className="flex flex-col items-start lg:col-span-8">
            <div className="mb-space-md flex items-center gap-space-xs rounded-full bg-secondary/20 px-space-md py-space-2xs text-secondary-fixed">
              <Icon name="verified" className="!text-[16px]" />
              <span className="text-label-sm font-semibold tracking-wider uppercase">
                Accredited Hospital Network
              </span>
            </div>

            <h1 className="mb-space-md text-headline-xl text-on-primary">
              World-Class Partner Hospitals &amp; Advanced Medical Facilities
            </h1>
            <p className="mb-space-xl max-w-2xl text-body-lg leading-relaxed text-inverse-on-surface">
              Access internationally accredited institutions across India, with dedicated
              international patient wings and concierge recovery support.
            </p>

            <div className="flex flex-wrap gap-space-md">
              {heroBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-space-xs rounded-lg bg-surface-container-lowest/10 px-space-lg py-space-sm text-on-primary backdrop-blur-md"
                >
                  <Icon name={badge.icon} className="text-secondary-fixed" />
                  <span className="text-label-md font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-xl lg:col-span-4">
            <h3 className="text-headline-sm text-on-surface">Find a Facility</h3>

            <div className="flex flex-col gap-space-sm">
              <label className="text-label-sm text-on-surface-variant">Search by name or department</label>
              <div className="relative">
                <Icon
                  name="search"
                  className="pointer-events-none absolute top-3 left-3 !text-[20px] text-outline"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Cardiology, Chennai..."
                  className="w-full rounded-lg bg-surface-container-low py-space-sm pr-space-md pl-10 text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-space-sm">
              <label className="text-label-sm text-on-surface-variant">Filter by city</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none"
              >
                <option value="all">All cities</option>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-body-sm text-on-surface-variant">
              {filtered.length} {filtered.length === 1 ? 'facility' : 'facilities'} matching
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-space-3xl px-space-md py-space-3xl sm:px-space-xl">
        {/* Stats banner */}
        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-4">
          <StatBadge
            icon="local_hospital"
            value={hospitals ? `${hospitals.length}` : '—'}
            label="Partner Hospitals"
          />
          <StatBadge icon="globe" value={cities.length || '—'} label="Cities Covered" />
          <StatBadge
            icon="medical_services"
            value={totalDepartments || '20+'}
            label="Departments Available"
          />
          <StatBadge icon="support_agent" value="24/7" label="Patient Support" />
        </div>

        {cityParam && (
          <p className="text-body-sm text-on-surface-variant">
            Showing hospitals in <span className="font-semibold text-on-surface">{cityParam}</span> ·{' '}
            <Link to="/hospitals" className="text-secondary hover:underline">
              Clear filter
            </Link>
          </p>
        )}

        {loading && <StateMessage>Loading hospitals...</StateMessage>}
        {error && (
          <StateMessage>Couldn't load hospitals right now. Please try again shortly.</StateMessage>
        )}

        {hospitals && filtered.length === 0 && (
          <StateMessage>No hospitals found{cityParam ? ` in ${cityParam}` : ''}.</StateMessage>
        )}

        {filtered.length > 0 && (
          <div className="flex flex-col gap-space-xl">
            {filtered.map((hospital) => (
              <HospitalWideCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        )}

        {/* Patient experience band */}
        <div className="relative flex flex-col items-center gap-space-2xl overflow-hidden rounded-xl bg-primary p-space-lg text-on-primary sm:p-space-3xl lg:flex-row">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-space-md lg:w-1/2">
            <span className="text-label-sm font-semibold tracking-widest text-secondary-fixed uppercase">
              Uncompromising Standards
            </span>
            <h2 className="text-headline-lg text-on-primary">The Mend Sure Patient Journey</h2>
            <p className="text-body-lg leading-relaxed text-inverse-on-surface">
              From the moment you request an evaluation to your recovery back home, our care team
              manages every logistical and clinical detail.
            </p>

            <div className="mt-space-sm space-y-space-md">
              {journey.map((item) => (
                <div key={item.step} className="flex items-start gap-space-md">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-on-secondary">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-label-md font-semibold text-on-primary">{item.title}</h4>
                    <p className="text-body-sm text-inverse-on-surface">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex w-full flex-col gap-space-lg rounded-xl border border-outline-variant/20 bg-surface-container-lowest/10 p-space-lg backdrop-blur-xl lg:w-1/2">
            <h3 className="text-headline-md text-on-primary">Request a Facility Match &amp; Quote</h3>
            <p className="text-body-md text-inverse-on-surface">
              Tell us your medical requirement and we'll match you with the right hospital in our
              network, with a full cost breakdown.
            </p>
            <Button to="/contact" className="w-full py-space-md shadow-lg">
              Connect With a Care Coordinator
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
