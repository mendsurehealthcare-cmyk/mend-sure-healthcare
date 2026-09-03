import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { forgotPassword } from '../lib/auth';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';

const fieldClasses =
  'w-full rounded-lg bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none';

const labelClasses = 'mb-space-3xs block text-label-sm font-semibold text-on-surface-variant';

const assurances = [
  {
    icon: 'lock',
    title: 'Private by design',
    text: 'Your reports are stored in a private bucket and fetched through short-lived links only you can request.',
  },
  {
    icon: 'folder_shared',
    title: 'Everything in one place',
    text: 'Keep your scans, discharge summaries, and past quote requests together between consultations.',
  },
  {
    icon: 'medical_information',
    title: 'Faster second opinions',
    text: 'Specialists review your uploaded records before your consultation, so nothing is repeated.',
  },
];

export default function Login() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login'); // login | signup | forgot
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Where to land after a successful login — back where they were headed.
  const destination = location.state?.from || '/reports';

  if (user) return <Navigate to={destination} replace />;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function switchMode(next) {
    setMode(next);
    setError('');
    setNotice('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('submitting');
    setError('');
    setNotice('');

    try {
      if (mode === 'forgot') {
        const result = await forgotPassword(form.email);
        setNotice(result.message);
      } else if (mode === 'signup') {
        const result = await signup(form.email, form.password);

        // Supabase returns a message instead of tokens when email
        // confirmation is switched on for the project.
        if (result.access_token) {
          navigate(destination, { replace: true });
        } else {
          setNotice(result.message || 'Account created. Please confirm your email, then log in.');
          setMode('login');
        }
      } else {
        await login(form.email, form.password);
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setStatus('idle');
    }
  }

  const copy = {
    login: {
      title: 'Log in to your account',
      sub: 'Access your uploaded reports and past quote requests.',
      button: 'Log In',
    },
    signup: {
      title: 'Create your patient account',
      sub: 'Upload your medical reports securely and track your enquiries.',
      button: 'Create Account',
    },
    forgot: {
      title: 'Reset your password',
      sub: "Enter your email and we'll send you a reset link.",
      button: 'Send Reset Link',
    },
  }[mode];

  return (
    <div className="flex w-full flex-col">
      <PageHero
        gradient
        eyebrow="Patient Portal"
        eyebrowIcon="account_circle"
        title="Your Mend Sure Account"
        subtitle="One secure place for your medical reports, treatment quotes, and consultation history."
      />

      <section className="mx-auto w-full max-w-7xl px-space-md py-space-3xl sm:px-space-xl">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="mb-space-lg text-headline-md font-bold text-primary">
              Why create an account?
            </h2>
            <div className="space-y-space-md">
              {assurances.map((item) => (
                <div key={item.title} className="flex items-start gap-space-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                    <Icon name={item.icon} className="!text-[20px]" />
                  </div>
                  <div>
                    <h3 className="text-label-md font-semibold text-on-surface">{item.title}</h3>
                    <p className="text-body-sm text-on-surface-variant">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-space-xl rounded-xl bg-surface-container-low p-space-lg">
              <p className="text-body-sm text-on-surface-variant">
                You don't need an account to{' '}
                <Link to="/contact" className="font-semibold text-secondary hover:underline">
                  request a free quote
                </Link>
                . An account just keeps everything together afterwards.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:p-space-xl">
              {/* Login / signup switch */}
              {mode !== 'forgot' && (
                <div className="mb-space-lg grid grid-cols-2 gap-space-xs rounded-lg bg-surface-container-low p-space-3xs">
                  {[
                    { key: 'login', label: 'Log In' },
                    { key: 'signup', label: 'Create Account' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => switchMode(tab.key)}
                      className={`rounded-lg px-space-md py-space-sm text-label-md transition-all ${
                        mode === tab.key
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              <h2 className="mb-space-3xs text-headline-md font-bold text-primary">{copy.title}</h2>
              <p className="mb-space-lg text-body-sm text-on-surface-variant">{copy.sub}</p>

              <form onSubmit={handleSubmit} className="space-y-space-md">
                <div>
                  <label className={labelClasses} htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="patient@example.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={fieldClasses}
                  />
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <label className={labelClasses} htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
                      required
                      minLength={mode === 'signup' ? 8 : undefined}
                      value={form.password}
                      onChange={handleChange}
                      className={fieldClasses}
                    />
                    {mode === 'signup' && (
                      <p className="mt-space-3xs text-body-sm text-on-surface-variant">
                        Must be at least 8 characters.
                      </p>
                    )}
                  </div>
                )}

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
                  disabled={status === 'submitting'}
                  className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-secondary py-space-md text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Please wait...' : copy.button}
                  {status !== 'submitting' && <Icon name="arrow_forward" className="!text-[18px]" />}
                </button>
              </form>

              <div className="mt-space-lg flex flex-wrap items-center justify-between gap-space-sm text-body-sm">
                {mode === 'forgot' ? (
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-semibold text-secondary hover:underline"
                  >
                    Back to log in
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="font-semibold text-secondary hover:underline"
                  >
                    Forgot your password?
                  </button>
                )}

                <span className="flex items-center gap-space-3xs text-on-surface-variant">
                  <Icon name="lock" className="!text-[14px]" />
                  Encrypted connection
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
