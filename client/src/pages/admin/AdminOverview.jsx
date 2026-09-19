import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../../lib/auth';
import { doctorImage, hospitalImage } from '../../lib/directoryImages';
import Icon from '../../components/Icon';
import StatBadge from '../../components/StatBadge';
import StateMessage from '../../components/StateMessage';
import MiniLineChart from '../../components/admin/MiniLineChart';
import MiniBarChart from '../../components/admin/MiniBarChart';

const STAT_CARDS = [
  { key: 'hospitals', label: 'Total Hospitals', icon: 'local_hospital' },
  { key: 'doctors', label: 'Total Doctors', icon: 'stethoscope' },
  { key: 'patients', label: 'Registered Patients', icon: 'group' },
  { key: 'newPatients', label: 'New Patients (30 Days)', icon: 'person_add' },
  { key: 'reports', label: 'Patient Reports', icon: 'description' },
];

const QUICK_ACTIONS = [
  { to: '/admin/doctors/new', label: 'Add New Doctor', icon: 'add_circle' },
  { to: '/admin/hospitals/new', label: 'Add New Hospital', icon: 'add_circle' },
  { to: '/admin/doctors', label: 'Manage Doctors', icon: 'stethoscope' },
  { to: '/admin/hospitals', label: 'Manage Hospitals', icon: 'local_hospital' },
];

function timeAgo(dateStr) {
  const minutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
}

function Panel({ title, action, children }) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="mb-space-md flex items-center justify-between gap-space-sm">
        <h2 className="text-label-md font-bold text-on-surface">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Avatar({ image, name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-fixed text-primary">
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <Icon name="person" className="!text-[20px]" />
      )}
    </div>
  );
}

export default function AdminOverview() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    authFetch('/admin/overview')
      .then(setOverview)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1 className="mb-space-2xs text-headline-md font-bold text-primary">Dashboard Overview</h1>
      <p className="mb-space-lg text-body-md text-on-surface-variant">
        A live snapshot of the hospital and doctor directory, patient accounts, and reports —
        every number below reads straight from the database.
      </p>

      {error && (
        <p className="mb-space-md flex items-start gap-space-xs rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">
          <Icon name="error" className="!text-[18px] shrink-0" />
          {error}
        </p>
      )}

      {!overview && !error && <StateMessage>Loading...</StateMessage>}

      {overview && (
        <div className="space-y-space-lg">
          <div className="grid grid-cols-2 gap-space-md sm:grid-cols-3 lg:grid-cols-5">
            {STAT_CARDS.map(({ key, label, icon }) => (
              <StatBadge key={key} icon={icon} value={overview.counts[key] ?? 0} label={label} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
            <Panel title="New Patient Registrations (Last 30 Days)">
              <MiniLineChart data={overview.registrationsByDay} />
            </Panel>
            <Panel title="Consultation Requests (Last 7 Days)">
              <MiniBarChart data={overview.inquiriesByDay} />
            </Panel>
          </div>

          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 xl:grid-cols-4">
            <Panel title="Recent Activity">
              {overview.activity.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">Nothing yet.</p>
              ) : (
                <ul className="space-y-space-md">
                  {overview.activity.map((item, i) => (
                    <li key={i} className="flex items-start gap-space-sm">
                      <div className="mt-space-3xs flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
                        <Icon name={item.icon} className="!text-[14px]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-body-sm text-on-surface">{item.label}</p>
                        <p className="text-label-sm text-on-surface-variant">{timeAgo(item.at)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Recently Added Doctors" action={<Link to="/admin/doctors" className="text-label-sm font-semibold text-secondary hover:underline">View all</Link>}>
              {overview.recentDoctors.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">No doctors yet.</p>
              ) : (
                <ul className="space-y-space-sm">
                  {overview.recentDoctors.map((doctor) => (
                    <li key={doctor.id}>
                      <Link
                        to={`/admin/doctors/${doctor.id}`}
                        className="-m-space-2xs flex items-center gap-space-sm rounded-lg p-space-2xs hover:bg-surface-container"
                      >
                        <Avatar image={doctorImage(doctor)} name={doctor.name} />
                        <div className="min-w-0">
                          <p className="truncate text-body-sm font-semibold text-on-surface">{doctor.name}</p>
                          <p className="truncate text-label-sm text-on-surface-variant">
                            {doctor.specialty || '—'}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Recently Added Hospitals" action={<Link to="/admin/hospitals" className="text-label-sm font-semibold text-secondary hover:underline">View all</Link>}>
              {overview.recentHospitals.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">No hospitals yet.</p>
              ) : (
                <ul className="space-y-space-sm">
                  {overview.recentHospitals.map((hospital) => (
                    <li key={hospital.id}>
                      <Link
                        to={`/admin/hospitals/${hospital.id}`}
                        className="-m-space-2xs flex items-center gap-space-sm rounded-lg p-space-2xs hover:bg-surface-container"
                      >
                        <Avatar image={hospitalImage(hospital)} name={hospital.name} />
                        <div className="min-w-0">
                          <p className="truncate text-body-sm font-semibold text-on-surface">{hospital.name}</p>
                          <p className="truncate text-label-sm text-on-surface-variant">
                            {hospital.city || '—'}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Quick Actions">
              <div className="flex flex-col gap-space-xs">
                {QUICK_ACTIONS.map(({ to, label, icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-space-xs rounded-lg border border-outline-variant/30 px-space-sm py-space-xs text-body-sm font-medium text-on-surface transition-colors hover:border-secondary hover:text-secondary"
                  >
                    <Icon name={icon} className="!text-[18px] text-secondary" />
                    {label}
                  </Link>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
