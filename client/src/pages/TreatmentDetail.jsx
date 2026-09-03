import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { specialtyIcon } from '../lib/specialtyIcons';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import StateMessage from '../components/StateMessage';
import CostComparisonTable from '../components/CostComparisonTable';
import ConsultationForm from '../components/ConsultationForm';

export default function TreatmentDetail() {
  const { slug } = useParams();
  const { data: treatment, loading, error } = useApi(`/treatments/${slug}`);

  if (loading) return <StateMessage>Loading treatment details...</StateMessage>;
  if (error || !treatment) return <StateMessage>We couldn't find that treatment.</StateMessage>;

  const hospitalLinks = treatment.hospital_treatments || [];

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow={treatment.specialty}
        eyebrowIcon={specialtyIcon(treatment.specialty)}
        title={treatment.name}
        subtitle={treatment.description}
        backgroundImage={treatment.image_url}
        backgroundAlt={treatment.name}
      />

      <div className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-3">
          <div className="space-y-space-2xl lg:col-span-2">
            <section>
              <h2 className="mb-space-md text-headline-md font-bold text-primary">Cost Comparison</h2>
              <CostComparisonTable treatment={treatment} />
            </section>

            {treatment.package_inclusions?.length > 0 && (
              <section>
                <h2 className="mb-space-md text-headline-md font-bold text-primary">
                  What's Included
                </h2>
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                  <ul className="grid gap-space-md sm:grid-cols-2">
                    {treatment.package_inclusions.map((item) => (
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

            {hospitalLinks.length > 0 && (
              <section>
                <h2 className="mb-space-md text-headline-md font-bold text-primary">
                  Hospitals Offering This Treatment
                </h2>
                <div className="space-y-space-sm">
                  {hospitalLinks.map((link) => (
                    <Link
                      key={link.hospitals.slug}
                      to={`/hospitals/${link.hospitals.slug}`}
                      className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center gap-space-md">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                          <Icon name="local_hospital" className="!text-[20px]" />
                        </div>
                        <div>
                          <p className="text-label-md font-semibold text-on-surface">
                            {link.hospitals.name}
                          </p>
                          <p className="text-body-sm text-on-surface-variant">
                            {link.hospitals.city}
                          </p>
                        </div>
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
              <ConsultationForm sourcePage={`treatment-${slug}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
