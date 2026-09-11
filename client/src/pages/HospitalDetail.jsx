import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { hospitalImage } from '../lib/directoryImages';
import { specialtyIcon } from '../lib/specialtyIcons';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
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
      <PageHero
        eyebrow={hospital.city}
        eyebrowIcon="location_on"
        title={hospital.name}
        subtitle={hospital.description}
        backgroundImage={hospitalImage(hospital)}
        backgroundAlt={hospital.name}
        aside={
          <div className="flex flex-col gap-space-md rounded-xl bg-primary-container/60 p-space-lg backdrop-blur-md">
            {hospital.accreditations?.length > 0 && (
              <div>
                <div className="mb-space-xs text-label-sm tracking-wider text-primary-fixed-dim uppercase">
                  Accreditations
                </div>
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
              </div>
            )}

            {yearsOpen !== null && (
              <div className="flex items-center justify-between gap-space-lg border-t border-primary-fixed-dim/20 pt-space-md text-body-sm">
                <span className="text-primary-fixed-dim">Serving Patients Since</span>
                <span className="font-bold text-secondary-container">
                  {hospital.established_year} ({yearsOpen}+ years)
                </span>
              </div>
            )}

            {hospital.bed_count && (
              <div className="flex items-center justify-between gap-space-lg border-t border-primary-fixed-dim/20 pt-space-md text-body-sm">
                <span className="text-primary-fixed-dim">Capacity</span>
                <span className="font-bold text-secondary-container">{hospital.bed_count} beds</span>
              </div>
            )}

            {hospital.departments?.length > 0 && (
              <div className="flex items-center justify-between gap-space-lg border-t border-primary-fixed-dim/20 pt-space-md text-body-sm">
                <span className="text-primary-fixed-dim">Departments</span>
                <span className="font-bold text-secondary-container">
                  {hospital.departments.length}
                </span>
              </div>
            )}
          </div>
        }
      />

      <div className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-3">
          <div className="space-y-space-2xl lg:col-span-2">
            {(hospital.address || yearsOpen !== null || hospital.timings) && (
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

                  {yearsOpen !== null && (
                    <div className="flex items-start gap-space-sm">
                      <Icon name="calendar_month" className="mt-0.5 shrink-0 text-secondary" />
                      <div>
                        <p className="text-label-sm font-semibold text-on-surface">Established</p>
                        <p className="text-body-sm text-on-surface-variant">
                          {hospital.established_year} — {yearsOpen}+ years serving patients
                        </p>
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

                  {hospital.bed_count && (
                    <div className="flex items-start gap-space-sm">
                      <Icon name="bed" className="mt-0.5 shrink-0 text-secondary" />
                      <div>
                        <p className="text-label-sm font-semibold text-on-surface">Capacity</p>
                        <p className="text-body-sm text-on-surface-variant">{hospital.bed_count} beds</p>
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
      </div>
    </div>
  );
}
