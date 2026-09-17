import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../../lib/auth';
import Icon from '../../components/Icon';
import StateMessage from '../../components/StateMessage';

const CARDS = [
  { key: 'doctors', label: 'Doctors', icon: 'stethoscope', to: '/admin/doctors' },
  { key: 'hospitals', label: 'Hospitals', icon: 'local_hospital', to: '/admin/hospitals' },
];

export default function AdminOverview() {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    authFetch('/admin/overview')
      .then(setCounts)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1 className="mb-space-2xs text-headline-md font-bold text-primary">Overview</h1>
      <p className="mb-space-lg text-body-md text-on-surface-variant">
        Add, edit, or remove doctors and hospitals. Changes appear on the live site right away.
      </p>

      {error && (
        <p className="mb-space-md flex items-start gap-space-xs rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">
          <Icon name="error" className="!text-[18px] shrink-0" />
          {error}
        </p>
      )}

      {!counts && !error && <StateMessage>Loading...</StateMessage>}

      {counts && (
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
          {CARDS.map(({ key, label, icon, to }) => (
            <Link
              key={key}
              to={to}
              className="flex items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-colors hover:bg-surface-container-low"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
                <Icon name={icon} className="!text-[28px]" />
              </div>
              <div>
                <p className="text-headline-lg font-bold text-on-surface">{counts[key] ?? 0}</p>
                <p className="text-body-md text-on-surface-variant">{label}</p>
              </div>
              <Icon name="chevron_right" className="ml-auto !text-[20px] text-on-surface-variant" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
