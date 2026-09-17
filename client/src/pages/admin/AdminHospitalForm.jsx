import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authFetch } from '../../lib/auth';
import { slugify, linesToArray, arrayToLines } from '../../lib/slug';
import Icon from '../../components/Icon';
import StateMessage from '../../components/StateMessage';

const EMPTY_FORM = {
  name: '',
  slug: '',
  city: '',
  address: '',
  description: '',
  established_year: '',
  bed_count: '',
  timings: '',
  accreditations: '',
  departments: '',
  gallery_urls: '',
  image_url: '',
  is_placeholder: false,
};

const fieldClasses =
  'w-full rounded-lg bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none';
const labelClasses = 'mb-space-3xs block text-label-sm font-semibold text-on-surface-variant';

function Field({ label, htmlFor, hint, children }) {
  return (
    <div>
      <label className={labelClasses} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-space-3xs text-body-sm text-on-surface-variant">{hint}</p>}
    </div>
  );
}

export default function AdminHospitalForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugTouched, setSlugTouched] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;

    authFetch(`/admin/hospitals/${id}`)
      .then((hospital) => {
        setForm({
          name: hospital.name || '',
          slug: hospital.slug || '',
          city: hospital.city || '',
          address: hospital.address || '',
          description: hospital.description || '',
          established_year: hospital.established_year ?? '',
          bed_count: hospital.bed_count ?? '',
          timings: hospital.timings || '',
          accreditations: arrayToLines(hospital.accreditations),
          departments: arrayToLines(hospital.departments),
          gallery_urls: arrayToLines(hospital.gallery_urls),
          image_url: hospital.image_url || '',
          is_placeholder: Boolean(hospital.is_placeholder),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleNameChange(event) {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  }

  function handleSlugChange(event) {
    setSlugTouched(true);
    handleChange(event);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      accreditations: linesToArray(form.accreditations),
      departments: linesToArray(form.departments),
      gallery_urls: linesToArray(form.gallery_urls),
    };

    try {
      if (isEditing) {
        await authFetch(`/admin/hospitals/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await authFetch('/admin/hospitals', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      navigate('/admin/hospitals');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete ${form.name || 'this hospital'}? Doctors linked to it will stay, just without a hospital assigned. This can't be undone.`
      )
    )
      return;

    setSaving(true);
    try {
      await authFetch(`/admin/hospitals/${id}`, { method: 'DELETE' });
      navigate('/admin/hospitals');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) return <StateMessage>Loading...</StateMessage>;

  return (
    <div>
      <h1 className="mb-space-lg text-headline-md font-bold text-primary">
        {isEditing ? `Edit ${form.name || 'hospital'}` : 'Add hospital'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
      >
        {error && (
          <p className="flex items-start gap-space-xs rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">
            <Icon name="error" className="!text-[18px] shrink-0" />
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
          <Field label="Hospital name" htmlFor="name">
            <input
              id="name"
              name="name"
              className={fieldClasses}
              value={form.name}
              onChange={handleNameChange}
              placeholder="Fortis Escorts Heart Institute"
              required
            />
          </Field>

          <Field label="URL slug" htmlFor="slug" hint="Used in the hospital's page link. Letters, numbers, and hyphens only.">
            <input
              id="slug"
              name="slug"
              className={fieldClasses}
              value={form.slug}
              onChange={handleSlugChange}
              placeholder="fortis-escorts-heart-institute"
              required
            />
          </Field>

          <Field label="City" htmlFor="city">
            <input id="city" name="city" className={fieldClasses} value={form.city} onChange={handleChange} />
          </Field>

          <Field label="Address" htmlFor="address">
            <input
              id="address"
              name="address"
              className={fieldClasses}
              value={form.address}
              onChange={handleChange}
            />
          </Field>

          <Field label="Established year" htmlFor="established_year">
            <input
              id="established_year"
              name="established_year"
              type="number"
              min="1800"
              max="2100"
              className={fieldClasses}
              value={form.established_year}
              onChange={handleChange}
            />
          </Field>

          <Field label="Number of beds" htmlFor="bed_count">
            <input
              id="bed_count"
              name="bed_count"
              type="number"
              min="0"
              className={fieldClasses}
              value={form.bed_count}
              onChange={handleChange}
            />
          </Field>

          <Field label="Opening hours" htmlFor="timings" hint="e.g. 24/7 Emergency & Inpatient Care · OPD by appointment">
            <input
              id="timings"
              name="timings"
              className={fieldClasses}
              value={form.timings}
              onChange={handleChange}
            />
          </Field>

          <Field label="Photo URL" htmlFor="image_url" hint="Paste a link to a photo. Leave blank to use the default photo.">
            <input
              id="image_url"
              name="image_url"
              className={fieldClasses}
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </Field>
        </div>

        <Field label="Description" htmlFor="description">
          <textarea
            id="description"
            name="description"
            rows={5}
            className={fieldClasses}
            value={form.description}
            onChange={handleChange}
          />
        </Field>

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
          <Field label="Accreditations" htmlFor="accreditations" hint="One per line (e.g. NABH, JCI).">
            <textarea
              id="accreditations"
              name="accreditations"
              rows={4}
              className={fieldClasses}
              value={form.accreditations}
              onChange={handleChange}
            />
          </Field>

          <Field label="Departments" htmlFor="departments" hint="One department per line.">
            <textarea
              id="departments"
              name="departments"
              rows={4}
              className={fieldClasses}
              value={form.departments}
              onChange={handleChange}
            />
          </Field>

          <Field label="Gallery photo URLs" htmlFor="gallery_urls" hint="One photo link per line." >
            <textarea
              id="gallery_urls"
              name="gallery_urls"
              rows={4}
              className={fieldClasses}
              value={form.gallery_urls}
              onChange={handleChange}
            />
          </Field>
        </div>

        <label className="flex items-center gap-space-xs text-body-md text-on-surface">
          <input
            type="checkbox"
            name="is_placeholder"
            checked={form.is_placeholder}
            onChange={handleChange}
            className="h-5 w-5 rounded accent-secondary"
          />
          Mark as incomplete / placeholder listing
        </label>

        <div className="flex flex-wrap items-center gap-space-md border-t border-outline-variant/20 pt-space-lg">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Add hospital'}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="ml-auto flex items-center gap-space-3xs rounded-lg px-space-md py-space-sm text-label-md text-error transition-colors hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="delete" className="!text-[18px]" />
              Delete hospital
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
