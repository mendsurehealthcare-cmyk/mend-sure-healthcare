import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          {t('form.successTitle')}
        </p>
        <p className="mt-space-3xs text-body-sm text-on-tertiary-fixed-variant">
          {t('form.successBody')}
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
          <label className={labelClasses}>{t('form.fullName')}</label>
          <input
            type="text"
            name="fullName"
            placeholder={t('form.fullNamePlaceholder')}
            required
            value={form.fullName}
            onChange={handleChange}
            className={fieldClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>{t('form.email')}</label>
          <input
            type="email"
            name="email"
            placeholder={t('form.emailPlaceholder')}
            required
            value={form.email}
            onChange={handleChange}
            className={fieldClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>{t('form.phone')}</label>
          <input
            type="tel"
            name="phone"
            placeholder={t('form.phonePlaceholder')}
            required
            value={form.phone}
            onChange={handleChange}
            className={fieldClasses}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="consultation-country">
            {t('form.country')}
          </label>
          <Autocomplete
            id="consultation-country"
            index={COUNTRY_INDEX}
            value={form.country}
            onChange={(country) => setForm((prev) => ({ ...prev, country }))}
            name="country"
            placeholder={t('form.countryPlaceholder')}
            inputClassName={fieldClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>{t('form.treatment')}</label>
        <input
          type="text"
          name="treatmentInterested"
          placeholder={t('form.treatmentPlaceholder')}
          value={form.treatmentInterested}
          onChange={handleChange}
          className={fieldClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>{t('form.message')}</label>
        <textarea
          name="message"
          placeholder={t('form.messagePlaceholder')}
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
        <span>{status === 'submitting' ? t('form.submitting') : t('form.submit')}</span>
        {status !== 'submitting' && <Icon name="arrow_forward" className="!text-[18px]" />}
      </button>

      <p className="flex items-center justify-center gap-space-3xs text-center text-body-sm text-outline">
        <Icon name="lock" className="!text-[14px]" />
        {t('form.confidential')}
      </p>
    </form>
  );
}
