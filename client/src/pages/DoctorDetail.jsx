import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { specialtyIcon } from '../lib/specialtyIcons';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import StateMessage from '../components/StateMessage';
import ConsultationForm from '../components/ConsultationForm';

export default function DoctorDetail() {
  const { slug } = useParams();
  const { data: doctor, loading, error } = useApi(`/doctors/${slug}`);

  if (loading) return <StateMessage>Loading doctor details...</StateMessage>;
  if (error || !doctor) return <StateMessage>We couldn't find that doctor.</StateMessage>;

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow={doctor.specialty}
        eyebrowIcon={specialtyIcon(doctor.specialty)}
        title={doctor.name}
        subtitle={doctor.hospitals ? `${doctor.hospitals.name} · ${doctor.hospitals.city}` : undefined}
        backgroundImage={doctor.image_url}
        backgroundAlt={doctor.name}
        aside={
          doctor.experience_years ? (
            <div className="rounded-xl bg-surface-container/10 p-space-lg text-center backdrop-blur-md">
              <div className="text-headline-xl text-secondary-fixed">
                {doctor.experience_years}+
              </div>
              <div className="text-body-sm text-inverse-on-surface opacity-80">
                Years of Experience
              </div>
            </div>
          ) : null
        }
      />

      <div className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-3">
          <div className="space-y-space-2xl lg:col-span-2">
            <section>
              <h2 className="mb-space-md text-headline-md font-bold text-primary">
                About {doctor.name}
              </h2>
              <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                <p className="text-body-lg leading-relaxed text-on-surface-variant">{doctor.bio}</p>
              </div>
            </section>

            {doctor.hospitals && (
              <section>
                <h2 className="mb-space-md text-headline-md font-bold text-primary">
                  Practices At
                </h2>
                <Link
                  to={`/hospitals/${doctor.hospitals.slug}`}
                  className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-space-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                      <Icon name="local_hospital" className="!text-[20px]" />
                    </div>
                    <div>
                      <p className="text-label-md font-semibold text-on-surface">
                        {doctor.hospitals.name}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">{doctor.hospitals.city}</p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="text-secondary" />
                </Link>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-[112px]">
              <h2 className="mb-space-md text-headline-sm font-bold text-primary">
                Request a Consultation
              </h2>
              <ConsultationForm sourcePage={`doctor-${slug}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
