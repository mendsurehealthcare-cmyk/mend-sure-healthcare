import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/useApi';
import { specialtyIcon } from '../lib/specialtyIcons';
import { doctorImage } from '../lib/directoryImages';
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
        subtitle={[doctor.designation, doctor.department].filter(Boolean).join(' · ') || undefined}
        backgroundImage={doctorImage(doctor)}
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
                {doctor.bio && (
                  <p className="mb-space-lg text-body-lg leading-relaxed text-on-surface-variant">
                    {doctor.bio}
                  </p>
                )}

                {/* The at-a-glance summary. Every value here comes straight
                    from the directory — nothing about training, outcomes, or
                    case volume is inferred. */}
                <dl className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
                  {[
                    { icon: 'badge', label: 'Position', value: doctor.designation },
                    { icon: 'medical_services', label: 'Department', value: doctor.department },
                    { icon: specialtyIcon(doctor.specialty), label: 'Speciality', value: doctor.specialty },
                    {
                      icon: 'local_hospital',
                      label: 'Practises at',
                      value: doctor.hospitals?.name || doctor.hospital_name,
                    },
                    doctor.experience_years && {
                      icon: 'schedule',
                      label: 'Experience',
                      value: `${doctor.experience_years}+ years`,
                    },
                  ]
                    .filter((item) => item && item.value)
                    .map((item) => (
                      <div key={item.label} className="flex items-start gap-space-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                          <Icon name={item.icon} className="!text-[18px]" />
                        </div>
                        <div className="min-w-0">
                          <dt className="text-label-sm font-semibold tracking-wide text-on-surface-variant uppercase">
                            {item.label}
                          </dt>
                          <dd className="text-body-md text-on-surface">{item.value}</dd>
                        </div>
                      </div>
                    ))}
                </dl>
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
