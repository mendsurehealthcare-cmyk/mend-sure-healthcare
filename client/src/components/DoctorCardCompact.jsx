import { Link } from 'react-router-dom';
import { specialtyIcon } from '../lib/specialtyIcons';
import { doctorImage } from '../lib/directoryImages';
import CardMedia from './CardMedia';

/*
  A smaller footprint than DoctorCard — photo, name, specialty, nothing else.
  Built for the home page's "Our Doctors" showcase, where six cards need to
  read at a glance rather than each carrying its own hospital chip and
  full-width "View Profile" button the way the listing page's cards do.
*/
export default function DoctorCardCompact({ doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Square, like the full card: these are headshots, and a taller box
          would crop a portrait down to a band across the face. */}
      <CardMedia
        image={doctorImage(doctor)}
        alt={doctor.name}
        label={doctor.specialty}
        icon={specialtyIcon(doctor.specialty)}
        className="aspect-square rounded-none transition-transform duration-500 group-hover:scale-105"
      />

      <div className="flex flex-col gap-space-3xs p-space-sm text-center">
        {/* A single-line truncate cuts a longer name off mid-word at this
            card's width ("Dr. Surender Kumar D…") — two lines with a clamp
            gives it room to wrap instead. */}
        <h3 className="line-clamp-2 text-label-md font-semibold text-on-surface">{doctor.name}</h3>
        <p className="truncate text-body-sm text-on-surface-variant">{doctor.specialty}</p>
      </div>
    </Link>
  );
}
