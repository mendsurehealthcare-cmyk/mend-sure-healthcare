import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { authFetch } from '../lib/auth';
import { formatDate } from '../lib/format';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';

const fieldClasses =
  'w-full rounded-lg bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none';

const labelClasses = 'mb-space-3xs block text-label-sm font-semibold text-on-surface-variant';

const STATUS_TONES = {
  new: 'bg-secondary-container text-on-secondary-container',
  contacted: 'bg-primary-fixed text-on-primary-fixed',
  converted: 'bg-tertiary-fixed text-on-tertiary-fixed',
};

export default function Account() {
  const { user, setUser, logout } = useAuth();

  const [form, setForm] = useState({ fullName: '', phone: '', country: '' });
  const [status, setStatus] = useState('idle'); // idle | saving
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [inquiries, setInquiries] = useState(null);
  const [inquiryError, setInquiryError] = useState('');

  // Seed the form from the profile once it's loaded.
  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.full_name || '',
      phone: user.phone || '',
      country: user.country || '',
    });
  }, [user]);

  const loadInquiries = useCallback(async () => {
    try {
      setInquiryError('');
      setInquiries(await authFetch('/inquiries/mine'));
    } catch (err) {
      setInquiryError(err.message);
      setInquiries([]);
    }
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setStatus('saving');
    setError('');
    setNotice('');

    try {
      const updated = await authFetch('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(form),
      });
      setUser(updated);
      setNotice('Your details have been saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setStatus('idle');
    }
  }

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow="Patient Portal"
        eyebrowIcon="account_circle"
        title={user?.full_name || 'My Account'}
        subtitle={user?.email}
        aside={
          <div className="flex flex-col gap-space-sm">
            <Link
              to="/reports"
              className="flex items-center justify-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
            >
              <Icon name="folder_shared" className="!text-[18px]" />
              My Medical Reports
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center justify-center gap-space-xs rounded-lg bg-primary-container px-space-lg py-space-sm text-label-md text-on-primary-container transition-colors hover:bg-surface hover:text-on-surface"
            >
              <Icon name="logout" className="!text-[18px]" />
              Log Out
            </button>
          </div>
        }
      />

      <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-12">
          {/* Profile */}
          <div className="lg:col-span-5">
            <h2 className="mb-space-md text-headline-md font-bold text-primary">Your Details</h2>

            <form
              onSubmit={handleSave}
              className="space-y-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
            >
              <div>
                <label className={labelClasses} htmlFor="email-display">
                  Email Address
                </label>
                <input
                  id="email-display"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className={`${fieldClasses} cursor-not-allowed opacity-70`}
                />
                <p className="mt-space-3xs text-body-sm text-on-surface-variant">
                  Your login email can't be changed here.
                </p>
              </div>

              <div>
                <label className={labelClasses} htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="phone">
                  Phone / WhatsApp
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="country">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  placeholder="Country you're calling from"
                  value={form.country}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>

              {error && (
                <p className="flex items-start gap-space-xs rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">
                  <Icon name="error" className="!text-[18px] shrink-0" />
                  {error}
                </p>
              )}

              {notice && (
                <p className="flex items-start gap-space-xs rounded-lg bg-tertiary-fixed p-space-sm text-body-sm text-on-tertiary-fixed">
                  <Icon name="check_circle" className="!text-[18px] shrink-0" />
                  {notice}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'saving'}
                className="w-full rounded-lg bg-secondary py-space-md text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Enquiries */}
          <div className="lg:col-span-7">
            <h2 className="mb-space-md text-headline-md font-bold text-primary">
              Your Quote Requests
            </h2>

            {inquiryError && (
              <p className="mb-space-md flex items-start gap-space-xs rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">
                <Icon name="error" className="!text-[18px] shrink-0" />
                {inquiryError}
              </p>
            )}

            {inquiries === null && (
              <div className="rounded-xl bg-surface-container-lowest p-space-2xl text-center text-body-md text-on-surface-variant shadow-sm">
                Loading your enquiries...
              </div>
            )}

            {inquiries?.length === 0 && (
              <div className="rounded-xl bg-surface-container-lowest p-space-2xl text-center shadow-sm">
                <div className="mx-auto mb-space-md flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
                  <Icon name="request_quote" className="!text-[32px]" />
                </div>
                <h3 className="text-headline-sm font-bold text-primary">No quote requests yet</h3>
                <p className="mx-auto mt-space-xs mb-space-lg max-w-sm text-body-md text-on-surface-variant">
                  Requests you submit while logged in will show up here so you can track their
                  progress.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
                >
                  Request a Free Quote
                  <Icon name="arrow_forward" className="!text-[18px]" />
                </Link>
              </div>
            )}

            {inquiries?.length > 0 && (
              <div className="space-y-space-sm">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-space-sm">
                      <div className="min-w-0">
                        <p className="text-label-md font-semibold text-on-surface">
                          {inquiry.treatment_interested || 'General enquiry'}
                        </p>
                        <p className="text-body-sm text-on-surface-variant">
                          Submitted {formatDate(inquiry.created_at)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-space-sm py-space-3xs text-label-sm font-medium capitalize ${
                          STATUS_TONES[inquiry.status] || 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </div>

                    {inquiry.message && (
                      <p className="mt-space-md border-t border-outline-variant/20 pt-space-md text-body-md text-on-surface-variant">
                        {inquiry.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
