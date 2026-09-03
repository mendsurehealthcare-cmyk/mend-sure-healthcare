import { Link } from 'react-router-dom';
import { specialtyIcon } from '../lib/specialtyIcons';
import CardMedia from './CardMedia';
import Icon from './Icon';

export default function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.slug}`}
      className="group flex h-full flex-col justify-between rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:shadow-xl"
    >
      <div>
        <div className="mb-space-md">
          <CardMedia
            image={doctor.image_url}
            alt={doctor.name}
            label={doctor.specialty}
            icon={specialtyIcon(doctor.specialty)}
          >
            {doctor.experience_years && (
              <div className="absolute top-space-sm left-space-sm rounded-full bg-primary/80 px-space-sm py-space-3xs text-label-sm text-on-primary backdrop-blur-md">
                {doctor.experience_years}+ years
              </div>
            )}
          </CardMedia>
        </div>

        <div className="mb-space-xs flex items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <Icon name={specialtyIcon(doctor.specialty)} className="!text-[24px]" />
          </div>
          <div>
            <h3 className="text-headline-sm text-on-surface">{doctor.name}</h3>
            <p className="text-body-sm text-on-surface-variant">{doctor.specialty}</p>
          </div>
        </div>

        {doctor.hospitals?.name && (
          <div className="mb-space-md flex items-center gap-space-xs rounded-lg bg-surface-container-low p-space-md text-body-sm">
            <Icon name="local_hospital" className="!text-[16px] text-secondary" />
            <span className="text-on-surface">{doctor.hospitals.name}</span>
          </div>
        )}
      </div>

      <span className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-secondary px-space-md py-space-sm text-label-md text-on-secondary shadow-sm transition-colors group-hover:bg-secondary-fixed-dim group-hover:text-on-secondary-fixed">
        View Profile
        <Icon name="arrow_forward" className="!text-[18px]" />
      </span>
    </Link>
  );
}
