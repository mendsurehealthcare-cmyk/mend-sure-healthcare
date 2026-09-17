import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../../lib/auth';
import Icon from '../../components/Icon';
import CardMedia from '../../components/CardMedia';
import StateMessage from '../../components/StateMessage';

export default function AdminDoctorsList() {
  const [doctors, setDoctors] = useState(null);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    try {
      setError('');
      setDoctors(await authFetch('/admin/doctors'));
    } catch (err) {
      setError(err.message);
      setDoctors([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(doctor) {
    if (!window.confirm(`Delete ${doctor.name}? This can't be undone.`)) return;

    setDeletingId(doctor.id);
    try {
      await authFetch(`/admin/doctors/${doctor.id}`, { method: 'DELETE' });
      setDoctors((prev) => prev.filter((d) => d.id !== doctor.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-space-lg flex flex-wrap items-center justify-between gap-space-sm">
        <h1 className="text-headline-md font-bold text-primary">Doctors</h1>
        <Link
          to="/admin/doctors/new"
          className="inline-flex items-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
        >
          <Icon name="add" className="!text-[18px]" />
          Add doctor
        </Link>
      </div>

      {error && (
        <p className="mb-space-md flex items-start gap-space-xs rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">
          <Icon name="error" className="!text-[18px] shrink-0" />
          {error}
        </p>
      )}

      {doctors === null && <StateMessage>Loading...</StateMessage>}

      {doctors?.length === 0 && (
        <div className="rounded-xl bg-surface-container-lowest p-space-2xl text-center shadow-sm">
          <div className="mx-auto mb-space-md flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
            <Icon name="stethoscope" className="!text-[32px]" />
          </div>
          <h3 className="text-headline-sm font-bold text-primary">No doctors yet</h3>
          <p className="mx-auto mt-space-xs mb-space-lg max-w-sm text-body-md text-on-surface-variant">
            Add your first doctor to have them show up on the public site.
          </p>
          <Link
            to="/admin/doctors/new"
            className="inline-flex items-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
          >
            Add doctor
            <Icon name="arrow_forward" className="!text-[18px]" />
          </Link>
        </div>
      )}

      {doctors?.length > 0 && (
        <div className="space-y-space-sm">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex flex-wrap items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
            >
              <CardMedia
                image={doctor.image_url}
                alt={doctor.name}
                icon="stethoscope"
                className="h-14 w-14 shrink-0 rounded-full"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <p className="truncate text-label-md font-semibold text-on-surface">
                    {doctor.name}
                  </p>
                  {doctor.is_priority && (
                    <span className="rounded-full bg-tertiary-fixed px-space-xs py-space-3xs text-label-sm text-on-tertiary-fixed">
                      Featured
                    </span>
                  )}
                  {doctor.is_placeholder && (
                    <span className="rounded-full bg-surface-container-high px-space-xs py-space-3xs text-label-sm text-on-surface-variant">
                      Placeholder
                    </span>
                  )}
                </div>
                <p className="truncate text-body-sm text-on-surface-variant">
                  {[doctor.designation, doctor.specialty].filter(Boolean).join(' · ')}
                </p>
                {doctor.hospital_name && (
                  <p className="truncate text-body-sm text-on-surface-variant">
                    {doctor.hospital_name}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-space-xs">
                <Link
                  to={`/admin/doctors/${doctor.id}`}
                  className="flex items-center gap-space-3xs rounded-lg bg-surface-container-high px-space-md py-space-xs text-label-md text-on-surface transition-colors hover:bg-surface-variant"
                >
                  <Icon name="edit" className="!text-[16px]" />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(doctor)}
                  disabled={deletingId === doctor.id}
                  className="flex items-center gap-space-3xs rounded-lg px-space-md py-space-xs text-label-md text-error transition-colors hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon name="delete" className="!text-[16px]" />
                  {deletingId === doctor.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
