import { useMemo, useState } from 'react';
import { useApi } from '../lib/useApi';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import DoctorCard from '../components/DoctorCard';
import StateMessage from '../components/StateMessage';

export default function Doctors() {
  const { data: doctors, loading, error } = useApi('/doctors');
  const [specialty, setSpecialty] = useState('All');
  const [query, setQuery] = useState('');

  const specialties = useMemo(() => {
    if (!doctors) return ['All'];
    return ['All', ...new Set(doctors.map((d) => d.specialty).filter(Boolean))];
  }, [doctors]);

  const filtered = useMemo(() => {
    if (!doctors) return [];
    const q = query.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSpecialty = specialty === 'All' || doctor.specialty === specialty;
      const matchesQuery =
        !q ||
        `${doctor.name} ${doctor.specialty || ''} ${doctor.hospitals?.name || ''}`
          .toLowerCase()
          .includes(q);
      return matchesSpecialty && matchesQuery;
    });
  }, [doctors, specialty, query]);

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow="Leading Global Experts"
        eyebrowIcon="stethoscope"
        title="Our Doctors"
        subtitle="Experienced, board-certified specialists across our accredited partner hospitals in India."
        aside={
          <div className="flex items-center gap-space-md rounded-xl bg-surface-container/10 p-space-md backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">{doctors?.length ?? '—'}</span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">Specialists</span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">
                {specialties.length > 1 ? specialties.length - 1 : '—'}
              </span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">Specialties</span>
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
                {item === 'All' ? 'All Specialists' : item}
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
              placeholder="Search by name or hospital..."
              className="w-full rounded-lg bg-surface-container-lowest py-space-xs pr-space-md pl-12 text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {loading && <StateMessage>Loading doctors...</StateMessage>}
      {error && (
        <StateMessage>Couldn't load doctors right now. Please try again shortly.</StateMessage>
      )}

      {doctors && (
        <div className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-2xl">
          {filtered.length === 0 ? (
            <StateMessage>No doctors match that search.</StateMessage>
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
