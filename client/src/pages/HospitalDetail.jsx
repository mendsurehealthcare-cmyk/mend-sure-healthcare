import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import StateMessage from '../components/StateMessage';
import ConsultationForm from '../components/ConsultationForm';

export default function HospitalDetail() {
  const { slug } = useParams();
  const { data: hospital, loading, error } = useApi(`/hospitals/${slug}`);

  if (loading) return <StateMessage>Loading hospital details...</StateMessage>;
  if (error || !hospital) return <StateMessage>We couldn't find that hospital.</StateMessage>;

  const treatmentLinks = hospital.hospital_treatments || [];

  return (
    <div className="flex w-full flex-col">
      <PageHero
        eyebrow={hospital.city}
        eyebrowIcon="location_on"
        title={hospital.name}
        subtitle={hospital.description}
        backgroundImage={hospital.image_url}
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
