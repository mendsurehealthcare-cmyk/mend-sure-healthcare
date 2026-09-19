import { Link } from 'react-router-dom';
import { specialtyIcon } from '../lib/specialtyIcons';
import CardMedia from './CardMedia';
import Icon from './Icon';

/*
  Same visual design as DoctorCard — square headshot, title line, hospital
  badge, full-width CTA — for the hospitals' named department heads. Every
  one is linked to a real /doctors/:slug page: an existing profile when the
  person is already in the main directory, otherwise a bare placeholder
  profile created for them (see scripts/link-department-heads-to-doctors.mjs)
  so there's always somewhere for the card to send a patient.
*/
export default function SpecialistCard({ specialist }) {
  return (
    <Link
      to={`/doctors/${specialist.doctorSlug}`}
      className="group flex h-full flex-col justify-between rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:shadow-xl"
    >
      <div>
        <div className="mb-space-md">
          <CardMedia
            image={specialist.image_url}
            alt={specialist.name}
            label={specialist.department}
            icon={specialtyIcon(specialist.department)}
            className="aspect-square"
          />
        </div>

        <div className="mb-space-xs flex items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <Icon name={specialtyIcon(specialist.department)} className="!text-[24px]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-headline-sm text-on-surface">{specialist.name}</h3>
            {/* Title first, same reasoning as DoctorCard: it's what tells a
                patient this is a department head, not a junior team member. */}
            {specialist.title && (
              <p className="text-body-sm font-medium text-secondary">{specialist.title}</p>
            )}
            <p className="text-body-sm text-on-surface-variant">{specialist.department}</p>
          </div>
        </div>

        <div className="mb-space-md flex items-start gap-space-xs rounded-lg bg-surface-container-low p-space-md text-body-sm">
          <Icon name="local_hospital" className="mt-0.5 !text-[16px] shrink-0 text-secondary" />
          <span className="text-on-surface">{specialist.hospitalName}</span>
        </div>
      </div>

      <span className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-secondary px-space-md py-space-sm text-label-md text-on-secondary shadow-sm transition-colors group-hover:bg-secondary-fixed-dim group-hover:text-on-secondary-fixed">
        View Profile
        <Icon name="arrow_forward" className="!text-[18px]" />
      </span>
    </Link>
  );
}
