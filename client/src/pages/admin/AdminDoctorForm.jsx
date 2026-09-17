import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authFetch } from '../../lib/auth';
import { slugify, linesToArray, arrayToLines } from '../../lib/slug';
import Icon from '../../components/Icon';
import StateMessage from '../../components/StateMessage';

const EMPTY_FORM = {
  name: '',
  slug: '',
  specialty: '',
  designation: '',
  department: '',
  hospital_id: '',
  hospital_name: '',
  experience_years: '',
  consultation_fee: '',
  bio: '',
  image_url: '',
  education: '',
  awards: '',
  career_history: '',
  publications: '',
  is_priority: false,
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

export default function AdminDoctorForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugTouched, setSlugTouched] = useState(isEditing);

  useEffect(() => {
    authFetch('/admin/hospitals')
      .then(setHospitals)
      .catch(() => setHospitals([]));
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    authFetch(`/admin/doctors/${id}`)
      .then((doctor) => {
        setForm({
          name: doctor.name || '',
          slug: doctor.slug || '',
          specialty: doctor.specialty || '',
          designation: doctor.designation || '',
          department: doctor.department || '',
          hospital_id: doctor.hospital_id || '',
          hospital_name: doctor.hospital_name || '',
          experience_years: doctor.experience_years ?? '',
          consultation_fee: doctor.consultation_fee ?? '',
          bio: doctor.bio || '',
          image_url: doctor.image_url || '',
          education: arrayToLines(doctor.education),
          awards: arrayToLines(doctor.awards),
          career_history: arrayToLines(doctor.career_history),
          publications: arrayToLines(doctor.publications),
          is_priority: Boolean(doctor.is_priority),
          is_placeholder: Boolean(doctor.is_placeholder),
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

  function handleHospitalChange(event) {
    const hospitalId = event.target.value;
    const hospital = hospitals.find((h) => h.id === hospitalId);
    setForm((prev) => ({
      ...prev,
      hospital_id: hospitalId,
      // Only fills the free-text name in for a brand-new doctor, or when it
      // was empty — an existing custom hospital_name (for a hospital outside
      // the directory) is never silently overwritten.
      hospital_name: hospital && !prev.hospital_name ? hospital.name : prev.hospital_name,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      education: linesToArray(form.education),
      awards: linesToArray(form.awards),
      career_history: linesToArray(form.career_history),
      publications: linesToArray(form.publications),
    };

    try {
      if (isEditing) {
        await authFetch(`/admin/doctors/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await authFetch('/admin/doctors', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      navigate('/admin/doctors');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete ${form.name || 'this doctor'}? This can't be undone.`)) return;

    setSaving(true);
    try {
      await authFetch(`/admin/doctors/${id}`, { method: 'DELETE' });
      navigate('/admin/doctors');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) return <StateMessage>Loading...</StateMessage>;

  return (
    <div>
      <h1 className="mb-space-lg text-headline-md font-bold text-primary">
        {isEditing ? `Edit ${form.name || 'doctor'}` : 'Add doctor'}
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
          <Field label="Full name" htmlFor="name">
            <input
              id="name"
              name="name"
              className={fieldClasses}
              value={form.name}
              onChange={handleNameChange}
              placeholder="Dr. Jane Doe"
              required
            />
          </Field>

          <Field label="URL slug" htmlFor="slug" hint="Used in the doctor's page link. Letters, numbers, and hyphens only.">
            <input
              id="slug"
              name="slug"
              className={fieldClasses}
              value={form.slug}
              onChange={handleSlugChange}
              placeholder="dr-jane-doe"
              required
            />
          </Field>

          <Field label="Specialty" htmlFor="specialty" hint="The care category patients browse by (e.g. Cardiac Care).">
            <input
              id="specialty"
              name="specialty"
              className={fieldClasses}
              value={form.specialty}
              onChange={handleChange}
            />
          </Field>

          <Field label="Designation" htmlFor="designation" hint="Their job title (e.g. Principal Director).">
            <input
              id="designation"
              name="designation"
              className={fieldClasses}
              value={form.designation}
              onChange={handleChange}
            />
          </Field>

          <Field label="Department" htmlFor="department" hint="Their clinical department (e.g. Interventional Cardiology).">
            <input
              id="department"
              name="department"
              className={fieldClasses}
              value={form.department}
              onChange={handleChange}
            />
          </Field>

          <Field label="Hospital" htmlFor="hospital_id" hint="Only needed if the hospital is already listed in the dashboard.">
            <select
              id="hospital_id"
              name="hospital_id"
              className={fieldClasses}
              value={form.hospital_id}
              onChange={handleHospitalChange}
            >
              <option value="">Not listed / none</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                  {hospital.city ? ` (${hospital.city})` : ''}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Hospital name shown on the site" htmlFor="hospital_name" hint="Shows even if the hospital above isn't set — useful for hospitals not yet in the dashboard.">
            <input
              id="hospital_name"
              name="hospital_name"
              className={fieldClasses}
              value={form.hospital_name}
              onChange={handleChange}
            />
          </Field>

          <Field label="Years of experience" htmlFor="experience_years">
            <input
              id="experience_years"
              name="experience_years"
              type="number"
              min="0"
              className={fieldClasses}
              value={form.experience_years}
              onChange={handleChange}
            />
          </Field>

          <Field label="Consultation fee (INR)" htmlFor="consultation_fee" hint="Leave blank to hide the fee on the profile.">
            <input
              id="consultation_fee"
              name="consultation_fee"
              type="number"
              min="0"
              className={fieldClasses}
              value={form.consultation_fee}
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

        <Field label="Biography" htmlFor="bio">
          <textarea
            id="bio"
            name="bio"
            rows={5}
            className={fieldClasses}
            value={form.bio}
            onChange={handleChange}
          />
        </Field>

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
          <Field label="Education" htmlFor="education" hint="One qualification per line (e.g. MBBS).">
            <textarea
              id="education"
              name="education"
              rows={4}
              className={fieldClasses}
              value={form.education}
              onChange={handleChange}
            />
          </Field>

          <Field label="Awards" htmlFor="awards" hint="One award per line.">
            <textarea
              id="awards"
              name="awards"
              rows={4}
              className={fieldClasses}
              value={form.awards}
              onChange={handleChange}
            />
          </Field>

          <Field label="Career history" htmlFor="career_history" hint="One previous role per line.">
            <textarea
              id="career_history"
              name="career_history"
              rows={4}
              className={fieldClasses}
              value={form.career_history}
              onChange={handleChange}
            />
          </Field>

          <Field label="Publications" htmlFor="publications" hint="One publication per line.">
            <textarea
              id="publications"
              name="publications"
              rows={4}
              className={fieldClasses}
              value={form.publications}
              onChange={handleChange}
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-space-lg">
          <label className="flex items-center gap-space-xs text-body-md text-on-surface">
            <input
              type="checkbox"
              name="is_priority"
              checked={form.is_priority}
              onChange={handleChange}
              className="h-5 w-5 rounded accent-secondary"
            />
            Feature this doctor (shows at the top of the list)
          </label>

          <label className="flex items-center gap-space-xs text-body-md text-on-surface">
            <input
              type="checkbox"
              name="is_placeholder"
              checked={form.is_placeholder}
              onChange={handleChange}
              className="h-5 w-5 rounded accent-secondary"
            />
            Mark as incomplete / placeholder profile
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-space-md border-t border-outline-variant/20 pt-space-lg">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Add doctor'}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="ml-auto flex items-center gap-space-3xs rounded-lg px-space-md py-space-sm text-label-md text-error transition-colors hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="delete" className="!text-[18px]" />
              Delete doctor
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
