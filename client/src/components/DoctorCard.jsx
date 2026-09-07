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

            {doctor.is_priority && (
              <div className="absolute top-space-sm right-space-sm flex items-center gap-space-3xs rounded-full bg-secondary px-space-sm py-space-3xs text-label-sm font-semibold text-on-secondary shadow-sm">
                <Icon name="star" filled className="!text-[14px]" />
                Featured
              </div>
            )}
          </CardMedia>
        </div>

        <div className="mb-space-xs flex items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <Icon name={specialtyIcon(doctor.specialty)} className="!text-[24px]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-headline-sm text-on-surface">{doctor.name}</h3>
            {/* Job title first: it's what tells a patient this is a department
                head rather than a junior member of the team. */}
            {doctor.designation && (
              <p className="text-body-sm font-medium text-secondary">{doctor.designation}</p>
            )}
            <p className="text-body-sm text-on-surface-variant">
              {doctor.department || doctor.specialty}
            </p>
          </div>
        </div>

        {/* hospital_name is the fallback: doctors at facilities we don't have a
            page for still show where they practise. */}
        {(doctor.hospitals?.name || doctor.hospital_name) && (
          <div className="mb-space-md flex items-start gap-space-xs rounded-lg bg-surface-container-low p-space-md text-body-sm">
            <Icon name="local_hospital" className="mt-0.5 !text-[16px] shrink-0 text-secondary" />
            <span className="text-on-surface">
              {doctor.hospitals?.name || doctor.hospital_name}
            </span>
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
