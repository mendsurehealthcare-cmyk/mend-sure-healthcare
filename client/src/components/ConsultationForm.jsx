import { useState } from 'react';
import { submitInquiry } from '../lib/api';
import { COUNTRY_INDEX } from '../lib/locations';
import Autocomplete from './Autocomplete';
import Icon from './Icon';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  treatmentInterested: '',
  message: '',
};

const fieldClasses =
  'w-full rounded-lg bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none';

const labelClasses = 'mb-space-3xs block text-label-sm font-semibold text-on-surface-variant';

export default function ConsultationForm({ sourcePage }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [formLoadedAt] = useState(() => Date.now());

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      await submitInquiry({ ...form, sourcePage, formLoadedAt });
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl bg-tertiary-fixed p-space-lg text-center">
        <Icon name="check_circle" filled className="!text-[32px] text-on-tertiary-fixed-variant" />
        <p className="mt-space-xs text-label-md font-semibold text-on-tertiary-fixed">
          Thank you! We've received your request.
        </p>
        <p className="mt-space-3xs text-body-sm text-on-tertiary-fixed-variant">
          Our care team will reach out within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      {/* Honeypot field: hidden from real visitors, bots tend to fill every input */}
      <input
        type="text"
        name="website"
        value={form.website || ''}
        onChange={handleChange}
        className="hidden"
        tabIndex="-1"
        autoComplete="off"
      />

      <div className="grid gap-space-md sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            required
            value={form.fullName}
            onChange={handleChange}
            className={fieldClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="patient@example.com"
            required
            value={form.email}
            onChange={handleChange}
            className={fieldClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Phone Number / WhatsApp</label>
          <input
            type="tel"
            name="phone"
            placeholder="+1 (555) 000-0000"
            required
            value={form.phone}
            onChange={handleChange}
            className={fieldClasses}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="consultation-country">
            Country
          </label>
          <Autocomplete
            id="consultation-country"
            index={COUNTRY_INDEX}
            value={form.country}
            onChange={(country) => setForm((prev) => ({ ...prev, country }))}
            name="country"
            placeholder="Country you're calling from"
            inputClassName={fieldClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Treatment You're Interested In</label>
        <input
          type="text"
          name="treatmentInterested"
          placeholder="Optional"
          value={form.treatmentInterested}
          onChange={handleChange}
          className={fieldClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Brief Clinical Summary / Symptoms</label>
        <textarea
          name="message"
          placeholder="Tell us a bit about your condition (optional)"
          rows={3}
          value={form.message}
          onChange={handleChange}
          className={fieldClasses}
        />
      </div>

      {status === 'error' && <p className="text-body-sm text-error">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-secondary py-space-md text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{status === 'submitting' ? 'Sending...' : 'Get My Free Quote'}</span>
        {status !== 'submitting' && <Icon name="arrow_forward" className="!text-[18px]" />}
      </button>

      <p className="flex items-center justify-center gap-space-3xs text-center text-body-sm text-outline">
        <Icon name="lock" className="!text-[14px]" />
        100% confidential — your medical data is never shared.
      </p>
    </form>
  );
}
