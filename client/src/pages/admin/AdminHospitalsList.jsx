import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../../lib/auth';
import Icon from '../../components/Icon';
import CardMedia from '../../components/CardMedia';
import StateMessage from '../../components/StateMessage';

export default function AdminHospitalsList() {
  const [hospitals, setHospitals] = useState(null);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    try {
      setError('');
      setHospitals(await authFetch('/admin/hospitals'));
    } catch (err) {
      setError(err.message);
      setHospitals([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(hospital) {
    if (
      !window.confirm(
        `Delete ${hospital.name}? Doctors linked to it will stay, just without a hospital assigned. This can't be undone.`
      )
    )
      return;

    setDeletingId(hospital.id);
    try {
      await authFetch(`/admin/hospitals/${hospital.id}`, { method: 'DELETE' });
      setHospitals((prev) => prev.filter((h) => h.id !== hospital.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-space-lg flex flex-wrap items-center justify-between gap-space-sm">
        <h1 className="text-headline-md font-bold text-primary">Hospitals</h1>
        <Link
          to="/admin/hospitals/new"
          className="inline-flex items-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
        >
          <Icon name="add" className="!text-[18px]" />
          Add hospital
        </Link>
      </div>

      {error && (
        <p className="mb-space-md flex items-start gap-space-xs rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">
          <Icon name="error" className="!text-[18px] shrink-0" />
          {error}
        </p>
      )}

      {hospitals === null && <StateMessage>Loading...</StateMessage>}

      {hospitals?.length === 0 && (
        <div className="rounded-xl bg-surface-container-lowest p-space-2xl text-center shadow-sm">
          <div className="mx-auto mb-space-md flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
            <Icon name="local_hospital" className="!text-[32px]" />
          </div>
          <h3 className="text-headline-sm font-bold text-primary">No hospitals yet</h3>
          <p className="mx-auto mt-space-xs mb-space-lg max-w-sm text-body-md text-on-surface-variant">
            Add your first hospital to have it show up on the public site.
          </p>
          <Link
            to="/admin/hospitals/new"
            className="inline-flex items-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
          >
            Add hospital
            <Icon name="arrow_forward" className="!text-[18px]" />
          </Link>
        </div>
      )}

      {hospitals?.length > 0 && (
        <div className="space-y-space-sm">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="flex flex-wrap items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
            >
              <CardMedia
                image={hospital.image_url}
                alt={hospital.name}
                icon="local_hospital"
                className="h-14 w-20 shrink-0"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <p className="truncate text-label-md font-semibold text-on-surface">
                    {hospital.name}
                  </p>
                  {hospital.is_placeholder && (
                    <span className="rounded-full bg-surface-container-high px-space-xs py-space-3xs text-label-sm text-on-surface-variant">
                      Placeholder
                    </span>
                  )}
                </div>
                {hospital.city && (
                  <p className="truncate text-body-sm text-on-surface-variant">{hospital.city}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-space-xs">
                <Link
                  to={`/admin/hospitals/${hospital.id}`}
                  className="flex items-center gap-space-3xs rounded-lg bg-surface-container-high px-space-md py-space-xs text-label-md text-on-surface transition-colors hover:bg-surface-variant"
                >
                  <Icon name="edit" className="!text-[16px]" />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(hospital)}
                  disabled={deletingId === hospital.id}
                  className="flex items-center gap-space-3xs rounded-lg px-space-md py-space-xs text-label-md text-error transition-colors hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon name="delete" className="!text-[16px]" />
                  {deletingId === hospital.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
