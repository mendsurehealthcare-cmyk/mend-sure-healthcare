import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import SpecialistCard from '../components/SpecialistCard';
import StateMessage from '../components/StateMessage';

export default function OurSpecialists() {
  // Whole directory in one request — this is a small, curated list (named
  // department heads), not the full doctor directory, so there's nothing to
  // paginate.
  const { data: hospitals, loading, error } = useApi('/hospitals?pageSize=300');

  // Which hospital's specialists are on screen. Only one at a time — with
  // dozens of hospitals now on file, rendering every specialist from every
  // hospital in one long scroll was the problem being fixed here.
  const [selectedSlug, setSelectedSlug] = useState(null);

  // One entry per hospital that actually has named department heads on file.
  // Heads without a name (a department with only a "no named HOD published"
  // note) are dropped here rather than shown as an empty card.
  const sections = useMemo(() => {
    if (!hospitals) return [];

    return hospitals
      .map((hospital) => {
        const specialists = (hospital.department_heads || []).flatMap((dept) =>
          (dept.heads || [])
            .filter((head) => head?.name)
            .map((head) => ({
              ...head,
              department: dept.department,
              hospitalName: hospital.name,
              hospitalSlug: hospital.slug,
            }))
        );
        return { hospital, specialists };
      })
      .filter((section) => section.specialists.length > 0);
  }, [hospitals]);

  const totalSpecialists = useMemo(
    () => sections.reduce((sum, section) => sum + section.specialists.length, 0),
    [sections]
  );

  // Falls back to the first hospital in the list once sections load, and
  // again if the selected one ever disappears from it — never left pointing
  // at nothing.
  const activeSlug =
    selectedSlug && sections.some((section) => section.hospital.slug === selectedSlug)
      ? selectedSlug
      : sections[0]?.hospital.slug;

  const activeSection = sections.find((section) => section.hospital.slug === activeSlug);

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow="Leadership"
        eyebrowIcon="stethoscope"
        title="Our Specialists"
        subtitle="Meet the named department heads and senior specialists leading care at our partner hospitals."
        aside={
          <div className="flex items-center gap-space-md rounded-xl bg-surface-container/10 p-space-md backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">
                {totalSpecialists || '—'}
              </span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">Specialists</span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-headline-md text-secondary-fixed">{sections.length || '—'}</span>
              <span className="text-body-sm text-inverse-on-surface opacity-80">Hospitals</span>
            </div>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        {loading && <StateMessage>Loading our specialists...</StateMessage>}
        {error && <StateMessage>We couldn't load our specialists. Please try again shortly.</StateMessage>}

        {!loading && !error && sections.length === 0 && (
          <StateMessage>No named specialists are on file yet.</StateMessage>
        )}

        {!loading && !error && sections.length > 0 && (
          <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-4">
            {/* Selector renders first on mobile (pick a hospital, then see
                its specialists below) and moves to the right rail on
                desktop, per the layout being asked for. */}
            <div className="order-first lg:order-2 lg:col-span-1">
              <div className="lg:sticky lg:top-[112px]">
                <h2 className="mb-space-sm px-space-2xs text-label-md font-semibold tracking-wide text-on-surface-variant uppercase">
                  Hospitals
                </h2>
                <div className="flex flex-col gap-space-3xs rounded-xl bg-surface-container-lowest p-space-xs shadow-sm lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto">
                  {sections.map(({ hospital, specialists }) => {
                    const active = hospital.slug === activeSlug;
                    return (
                      <button
                        key={hospital.slug}
                        type="button"
                        onClick={() => setSelectedSlug(hospital.slug)}
                        className={`flex items-center justify-between gap-space-sm rounded-lg px-space-sm py-space-xs text-left text-body-sm transition-colors ${
                          active
                            ? 'bg-primary font-semibold text-on-primary'
                            : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <span className="truncate">{hospital.name}</span>
                        <span
                          className={`shrink-0 rounded-full px-space-xs py-space-3xs text-label-sm ${
                            active
                              ? 'bg-on-primary/20 text-on-primary'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {specialists.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="order-last lg:order-1 lg:col-span-3">
              {activeSection && (
                <section>
                  <div className="mb-space-lg flex flex-wrap items-end justify-between gap-space-sm">
                    <div>
                      <h2 className="text-headline-lg font-bold text-primary">
                        {activeSection.hospital.name} Specialists
                      </h2>
                      <p className="mt-space-3xs text-body-sm text-on-surface-variant">
                        {activeSection.specialists.length} specialist
                        {activeSection.specialists.length === 1 ? '' : 's'} across{' '}
                        {activeSection.hospital.department_heads.length} department
                        {activeSection.hospital.department_heads.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <Link
                      to={`/hospitals/${activeSection.hospital.slug}`}
                      className="flex shrink-0 items-center gap-space-2xs text-label-md font-semibold text-secondary hover:underline"
                    >
                      View hospital
                      <Icon name="arrow_forward" className="!text-[18px]" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 xl:grid-cols-3">
                    {activeSection.specialists.map((specialist) => (
                      <SpecialistCard key={specialist.name} specialist={specialist} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
