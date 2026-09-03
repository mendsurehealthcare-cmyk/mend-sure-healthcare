import { Link } from 'react-router-dom';
import CardMedia from './CardMedia';
import Icon from './Icon';

export default function HospitalCard({ hospital }) {
  return (
    <Link
      to={`/hospitals/${hospital.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <CardMedia
        image={hospital.image_url}
        alt={hospital.name}
        label={hospital.name}
        icon="local_hospital"
        className="h-56 rounded-none"
      >
        {hospital.accreditations?.length > 0 && (
          <div className="absolute top-space-md right-space-md flex items-center gap-space-3xs rounded-full bg-secondary px-space-sm py-space-3xs text-label-sm font-bold text-on-secondary">
            <Icon name="verified" className="!text-[14px]" />
            {hospital.accreditations[0]}
          </div>
        )}
      </CardMedia>

      <div className="flex flex-1 flex-col justify-between p-space-lg">
        <div>
          <div className="mb-space-2xs flex items-center gap-space-xs text-label-sm font-semibold text-secondary">
            <Icon name="location_on" className="!text-[16px]" />
            <span>{hospital.city}</span>
          </div>
          <h3 className="mb-space-sm text-headline-md font-bold text-primary">{hospital.name}</h3>
          <p className="mb-space-lg line-clamp-3 text-body-sm text-on-surface-variant">
            {hospital.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-space-md">
          {hospital.accreditations?.length > 0 && (
            <span className="text-body-sm font-medium text-on-surface">
              {hospital.accreditations.join(' · ')}
            </span>
          )}
          <span className="ml-auto rounded-lg bg-primary px-space-md py-space-xs text-label-sm font-semibold text-on-primary transition-colors group-hover:bg-primary-container">
            View Facility
          </span>
        </div>
      </div>
    </Link>
  );
}
