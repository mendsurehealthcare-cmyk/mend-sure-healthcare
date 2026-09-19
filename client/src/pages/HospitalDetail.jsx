import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { hospitalImage } from '../lib/directoryImages';
import { specialtyIcon } from '../lib/specialtyIcons';
import Icon from '../components/Icon';
import CardMedia from '../components/CardMedia';
import StatBadge from '../components/StatBadge';
import StateMessage from '../components/StateMessage';
import ConsultationForm from '../components/ConsultationForm';

export default function HospitalDetail() {
  const { slug } = useParams();
  const { data: hospital, loading, error } = useApi(`/hospitals/${slug}`);
  // The doctors already linked to this hospital, rather than a separately
  // maintained "specialties available" list — so it can never say something
  // the doctor directory itself doesn't back up.
  const { data: hospitalDoctors } = useApi(`/doctors?hospital=${slug}&pageSize=300`);

  const specialtiesHere = useMemo(() => {
    if (!hospitalDoctors) return [];
    return [...new Set(hospitalDoctors.map((doctor) => doctor.specialty).filter(Boolean))].sort();
  }, [hospitalDoctors]);

  if (loading) return <StateMessage>Loading hospital details...</StateMessage>;
  if (error || !hospital) return <StateMessage>We couldn't find that hospital.</StateMessage>;

  const treatmentLinks = hospital.hospital_treatments || [];
  const yearsOpen = hospital.established_year
    ? new Date().getFullYear() - hospital.established_year
    : null;

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto w-full max-w-7xl px-space-md pt-space-xl sm:px-space-xl">
        {/* Profile header: an actual, visible photo — not a faint tinted
            background — plus the name and the facts that build trust
            fastest: what kind of facility this is, who runs it, how big it
            is, and its accreditations. */}
        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
          <CardMedia
            image={hospitalImage(hospital)}
            alt={hospital.name}
            label={hospital.name}
            icon="local_hospital"
            className="h-56 sm:h-72"
          />

          <div className="p-space-lg sm:p-space-xl">
            <div className="flex flex-wrap items-start justify-between gap-space-lg">
              <div className="min-w-0">
                <div className="flex items-center gap-space-2xs text-body-sm text-on-surface-variant">
                  <Icon name="location_on" className="!text-[16px] text-secondary" />
                  {hospital.city}
                </div>
                <h1 className="mt-space-3xs text-headline-lg font-bold text-on-surface">
                  {hospital.name}
                </h1>
                {hospital.hospital_type && (
                  <p className="mt-space-2xs text-body-md text-on-surface-variant">
                    {hospital.hospital_type}
                  </p>
                )}
                {hospital.ownership && (
                  <p className="mt-space-3xs text-body-sm text-on-surface-variant">
                    {hospital.ownership}
                  </p>
                )}
              </div>

              {hospital.accreditations?.length > 0 && (
                <div className="flex flex-wrap gap-space-xs">
                  {hospital.accreditations.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-tertiary-fixed px-space-sm py-space-3xs text-label-sm font-medium text-on-tertiary-fixed"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {(yearsOpen !== null || hospital.bed_count || hospital.icu_beds) && (
              <div className="mt-space-lg grid grid-cols-2 gap-space-lg border-t border-outline-variant/20 pt-space-lg sm:grid-cols-3">
                {yearsOpen !== null && (
                  <StatBadge
                    tone="plain"
                    value={hospital.established_year}
                    label={`Established — ${yearsOpen}+ yrs`}
                  />
                )}
                {hospital.bed_count && (
                  <StatBadge tone="plain" value={hospital.bed_count} label="Beds" />
                )}
                {hospital.icu_beds && (
                  <StatBadge tone="plain" value={hospital.icu_beds} label="ICU / critical beds" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-3">
          <div className="space-y-space-2xl lg:col-span-2">
            {hospital.description && (
              <section>
                <h2 className="mb-space-md text-headline-md font-bold text-primary">About</h2>
                <p className="rounded-xl bg-surface-container-lowest p-space-lg text-body-md leading-relaxed text-on-surface-variant shadow-sm">
                  {hospital.description}
                </p>
              </section>
            )}

            {(hospital.address || hospital.timings) && (
              <section>
                <h2 className="mb-space-md text-headline-md font-bold text-primary">At a Glance</h2>
                <div className="grid gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:grid-cols-2">
                  {hospital.address && (
                    <div className="flex items-start gap-space-sm">
                      <Icon name="location_on" className="mt-0.5 shrink-0 text-secondary" />
                      <div>
                        <p className="text-label-sm font-semibold text-on-surface">Address</p>
                        <p className="text-body-sm text-on-surface-variant">{hospital.address}</p>
                      </div>
                    </div>
                  )}

                  {hospital.timings && (
                    <div className="flex items-start gap-space-sm">
                      <Icon name="schedule" className="mt-0.5 shrink-0 text-secondary" />
                      <div>
                        <p className="text-label-sm font-semibold text-on-surface">Hours</p>
                        <p className="text-body-sm text-on-surface-variant">{hospital.timings}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {specialtiesHere.length > 0 && (
              <section>
                <h2 className="mb-space-md text-headline-md font-bold text-primary">
                  Specialties Available Here
                </h2>
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                  <ul className="grid gap-space-md sm:grid-cols-2">
                    {specialtiesHere.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-space-sm text-body-md text-on-surface"
                      >
                        <Icon name={specialtyIcon(item)} className="shrink-0 text-secondary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {hospital.departments?.length > 0 && (
              <section>
                <h2 className="mb-space-md text-headline-md font-bold text-primary">Departments</h2>
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                  <ul className="grid gap-space-md sm:grid-cols-2">
                    {hospital.departments.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-space-sm text-body-md text-on-surface"
                      >
                        <Icon name="check_circle" className="shrink-0 text-secondary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {treatmentLinks.length > 0 && (
              <section>
                <h2 className="mb-space-md text-headline-md font-bold text-primary">
                  Treatments Offered Here
                </h2>
                <div className="space-y-space-sm">
                  {treatmentLinks.map((link) => (
                    <Link
                      key={link.treatments.slug}
                      to={`/treatments/${link.treatments.slug}`}
                      className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div>
                        <p className="text-label-md font-semibold text-on-surface">
                          {link.treatments.name}
                        </p>
                        <p className="text-body-sm text-on-surface-variant">
                          {link.treatments.specialty}
                        </p>
                      </div>
                      <p className="text-label-md font-semibold text-secondary">
                        ${link.price_min_usd?.toLocaleString()} – ${link.price_max_usd?.toLocaleString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-[112px]">
              <h2 className="mb-space-md text-headline-sm font-bold text-primary">
                Request a Free Quote
              </h2>
              <ConsultationForm sourcePage={`hospital-${slug}`} />
            </div>
          </div>
        </div>

        {hospital.department_heads?.length > 0 && (
          <section className="mt-space-2xl">
            <div className="mb-space-md flex flex-wrap items-end justify-between gap-space-sm">
              <h2 className="text-headline-md font-bold text-primary">
                Department Heads &amp; Specialists
              </h2>
              <Link
                to="/our-specialists"
                className="flex shrink-0 items-center gap-space-2xs text-label-md font-semibold text-secondary hover:underline"
              >
                See all specialists
                <Icon name="arrow_forward" className="!text-[18px]" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-3">
              {hospital.department_heads.map((dept) => {
                const count = dept.heads?.length || 0;
                return (
                  <div
                    key={dept.department}
                    className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
                  >
                    <div className="mb-space-md flex items-start justify-between gap-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <Icon name="stethoscope" className="!text-[18px] shrink-0 text-secondary" />
                        <h3 className="text-label-md font-semibold text-on-surface">
                          {dept.department}
                        </h3>
                      </div>
                      {count > 0 && (
                        <span className="shrink-0 rounded-full bg-surface-container-high px-space-xs py-space-3xs text-label-sm text-on-surface-variant">
                          {count === 1 ? 'Head of Department' : `${count} Specialists`}
                        </span>
                      )}
                    </div>

                    {dept.note && (
                      <p className="mb-space-md flex items-start gap-space-xs rounded-lg bg-surface-container-low p-space-sm text-body-sm text-on-surface-variant italic">
                        <Icon name="info" className="mt-0.5 !text-[16px] shrink-0" />
                        {dept.note}
                      </p>
                    )}

                    {count > 0 && (
                      <ul className="space-y-space-md">
                        {dept.heads.map((head) => (
                          <li key={head.name}>
                            <Link
                              to={head.doctorSlug ? `/doctors/${head.doctorSlug}` : '#'}
                              className={`flex items-center gap-space-sm rounded-lg ${
                                head.doctorSlug ? '-m-space-2xs p-space-2xs hover:bg-surface-container' : ''
                              }`}
                            >
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-fixed text-primary">
                                {head.image_url ? (
                                  <img
                                    src={head.image_url}
                                    alt={head.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Icon name="person" className="!text-[22px]" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-body-md font-semibold text-on-surface">
                                  {head.name}
                                </p>
                                {head.title && (
                                  <p className="text-body-sm text-on-surface-variant">{head.title}</p>
                                )}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
