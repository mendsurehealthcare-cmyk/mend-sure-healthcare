import { Link } from 'react-router-dom';
import CardMedia from './CardMedia';
import Icon from './Icon';

// Feature blocks under the description. Each only renders when the hospital
// row actually carries that data.
function Feature({ icon, title, text }) {
  return (
    <div className="flex items-start gap-space-sm">
      <Icon name={icon} className="mt-0.5 shrink-0 text-secondary" />
      <div>
        <h4 className="text-label-md font-semibold text-on-surface">{title}</h4>
        <p className="text-body-sm text-on-surface-variant">{text}</p>
      </div>
    </div>
  );
}

/*
  The full-width hospital card used on the Hospitals listing page — image on
  the left, detail on the right. (HospitalCard is the compact vertical variant
  used in grids elsewhere.)
*/
export default function HospitalWideCard({ hospital }) {
  const features = [
    hospital.accreditations?.length > 0 && {
      icon: 'verified_user',
      title: 'Accreditation',
      text: hospital.accreditations.join(', '),
    },
    hospital.bed_count && {
      icon: 'hotel',
      title: 'Capacity',
      text: `${hospital.bed_count} beds, including private recovery suites`,
    },
    hospital.departments?.length > 0 && {
      icon: 'medical_services',
      title: 'Departments',
      text: hospital.departments.slice(0, 4).join(', '),
    },
    {
      icon: 'translate',
      title: 'International Patients',
      text: 'Dedicated coordinator, interpreter, and visa support',
    },
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-xl bg-surface-container-lowest shadow-md transition-all hover:shadow-xl lg:grid-cols-12">
      <div className="relative min-h-[300px] lg:col-span-5 lg:min-h-full">
        <CardMedia
          image={hospital.image_url}
          alt={hospital.name}
          label={hospital.name}
          icon="local_hospital"
          className="h-full rounded-none"
        >
          {hospital.accreditations?.length > 0 && (
            <div className="absolute top-space-md left-space-md flex items-center gap-space-2xs rounded-full bg-primary/80 px-space-md py-space-2xs text-label-sm font-semibold text-on-primary backdrop-blur-md">
              <Icon name="star" filled className="!text-[14px]" />
              <span>Accredited Partner</span>
            </div>
          )}
        </CardMedia>
      </div>

      <div className="flex flex-col justify-between p-space-lg lg:col-span-7 lg:p-space-xl">
        <div>
          <div className="mb-space-xs flex items-start justify-between gap-space-md">
            <span className="text-label-sm font-semibold tracking-wider text-secondary uppercase">
              {hospital.city}
            </span>
            {hospital.accreditations?.length > 0 && (
              <span className="rounded-full bg-tertiary-fixed px-space-sm py-space-3xs text-label-sm font-medium text-on-tertiary-fixed">
                {hospital.accreditations[0]}
              </span>
            )}
          </div>

          <h3 className="mb-space-sm text-headline-md text-on-surface">{hospital.name}</h3>
          <p className="mb-space-lg text-body-md leading-relaxed text-on-surface-variant">
            {hospital.description}
          </p>

          <div className="mb-space-lg grid grid-cols-1 gap-space-md sm:grid-cols-2">
            {features.map((feature) => (
              <Feature key={feature.title} {...feature} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-space-md border-t border-surface-container pt-space-lg">
          <div className="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
            <Icon name="verified_user" className="!text-[18px] text-secondary" />
            <span>Vetted by the Mend Sure clinical team</span>
          </div>
          <Link
            to={`/hospitals/${hospital.slug}`}
            className="rounded-lg bg-primary px-space-lg py-space-sm text-label-md text-on-primary transition-colors hover:bg-primary-container"
          >
            View Facility
          </Link>
        </div>
      </div>
    </div>
  );
}
