import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { useAuth } from '../context/useAuth';
import { clerkConfigured, CLERK_MISSING_MESSAGE } from '../lib/clerk';
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

/*
  Turns a Clerk error into something a patient can act on.

  Clerk's own `longMessage` is usually fine and is used as the fallback, but a
  few of these are worth rewording: the codes it returns for a wrong or stale
  verification code describe the token, not what the person should do next.
*/
function readableError(error) {
  const first = error?.errors?.[0];

  if (!first) {
    return error?.message || 'Something went wrong. Please try again.';
  }

  switch (first.code) {
    case 'form_code_incorrect':
    case 'verification_failed':
      return "That code doesn't match. Please check the six digits and try again.";
    case 'verification_expired':
      return 'That code has expired. Send a new one and try again.';
    case 'form_identifier_invalid':
      return 'Please enter a valid email address.';
    case 'too_many_requests':
    case 'client_state_invalid':
      return 'Too many attempts just now. Please wait a minute and try again.';
    default:
      return first.longMessage || first.message || 'Something went wrong. Please try again.';
  }
}

// Clerk answers with this when the address has never been seen, which is how
// an unknown email is told apart from a real failure — it is the signal to
// create the account rather than sign in to one.
function isUnknownEmail(error) {
  return error?.errors?.some((item) => item.code === 'form_identifier_not_found');
}

/*
  The whole of signing in: one email field, then the six digits Clerk emails
  back. There is no password anywhere, so there is nothing to forget, nothing
  to reset, and no separate "create account" path — an address we have never
  seen simply gets an account instead of a session, which is why the button
  says "Continue" rather than either.
*/
function EmailCodeForm({ destination }) {
  const navigate = useNavigate();
  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();

  const [step, setStep] = useState('email'); // email | code
  const [flow, setFlow] = useState('signIn'); // signIn | signUp
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const ready = signInLoaded && signUpLoaded;

  async function startSignUp() {
    await signUp.create({ emailAddress: email });
    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    setFlow('signUp');
  }

  async function sendCode() {
    try {
      const attempt = await signIn.create({ identifier: email });

      // Which of the account's addresses to mail. Passwordless instances
      // return one email_code factor per verified address.
      const factor = attempt.supportedFirstFactors?.find(
        (item) => item.strategy === 'email_code'
      );

      if (!factor) {
        throw new Error('This account cannot be signed in to by email code.');
      }

      await signIn.prepareFirstFactor({
        strategy: 'email_code',
        emailAddressId: factor.emailAddressId,
      });
      setFlow('signIn');
    } catch (err) {
      if (!isUnknownEmail(err)) throw err;
      await startSignUp();
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    if (!ready) return;

    setBusy(true);
    setError('');
    setNotice('');

    try {
      await sendCode();
      setStep('code');
      setNotice(`We've emailed a six-digit code to ${email}.`);
    } catch (err) {
      setError(readableError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleCodeSubmit(event) {
    event.preventDefault();
    if (!ready) return;

    setBusy(true);
    setError('');
    setNotice('');

    try {
      const result =
        flow === 'signIn'
          ? await signIn.attemptFirstFactor({ strategy: 'email_code', code })
          : await signUp.attemptEmailAddressVerification({ code });

      if (result.status !== 'complete') {
        // Clerk needs something more before it will hand over a session —
        // another factor, or a field the instance requires at signup. Nothing
        // in this flow asks for either, so it means the Clerk instance is
        // configured differently from what this page implements.
        setError('We need a little more to finish signing you in. Please contact us for help.');
        return;
      }

      await setActive({ session: result.createdSessionId });
      navigate(destination, { replace: true });
    } catch (err) {
      setError(readableError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setBusy(true);
    setError('');
    setNotice('');

    try {
      if (flow === 'signUp') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      } else {
        const factor = signIn.supportedFirstFactors?.find(
          (item) => item.strategy === 'email_code'
        );
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId: factor?.emailAddressId,
        });
      }
      setNotice(`We've sent another code to ${email}.`);
    } catch (err) {
      setError(readableError(err));
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    setStep('email');
    setCode('');
    setError('');
    setNotice('');
  }

  return (
    <>
      <h2 className="mb-space-3xs text-headline-md font-bold text-primary">
        {step === 'email' ? 'Log in or create your account' : 'Enter your code'}
      </h2>
      <p className="mb-space-lg text-body-sm text-on-surface-variant">
        {step === 'email'
          ? "Enter your email and we'll send you a six-digit code. No password to remember."
          : `We've sent six digits to ${email}. The code is good for ten minutes.`}
      </p>

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-space-md">
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClasses}
            />
          </div>

          {error && <FormError>{error}</FormError>}

          {/* Clerk mounts its bot check here when the instance has one turned
              on. Without the element, signing up is rejected outright. */}
          <div id="clerk-captcha" />

          <SubmitButton busy={busy || !ready} label="Continue" busyLabel="Sending code..." />
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-space-md">
          <div>
            <label className={labelClasses} htmlFor="code">
              Six-Digit Code
            </label>
            <input
              id="code"
              // `type="text"` with a numeric inputMode: a number input lets a
              // phone keyboard through but also brings spinners, scroll-wheel
              // changes, and silent stripping of a leading zero.
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              required
              autoFocus
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
              className={`${fieldClasses} text-center text-headline-sm tracking-[0.4em]`}
            />
          </div>

          {error && <FormError>{error}</FormError>}
          {notice && <FormNotice>{notice}</FormNotice>}

          <SubmitButton
            busy={busy || !ready}
            label={flow === 'signUp' ? 'Create Account' : 'Log In'}
            busyLabel="Checking..."
          />

          <div className="flex flex-wrap items-center justify-between gap-space-sm text-body-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={busy}
              className="font-semibold text-secondary hover:underline disabled:opacity-60"
            >
              Send a new code
            </button>
            <button
              type="button"
              onClick={startOver}
              className="font-semibold text-secondary hover:underline"
            >
              Use a different email
            </button>
          </div>
        </form>
      )}

      {step === 'email' && notice && <div className="mt-space-md"><FormNotice>{notice}</FormNotice></div>}
    </>
  );
}

function FormError({ children }) {
  return (
    <p className="flex items-start gap-space-xs rounded-lg bg-error-container p-space-sm text-body-sm text-on-error-container">
      <Icon name="error" className="!text-[18px] shrink-0" />
      {children}
    </p>
  );
}

function FormNotice({ children }) {
  return (
    <p className="flex items-start gap-space-xs rounded-lg bg-tertiary-fixed p-space-sm text-body-sm text-on-tertiary-fixed">
      <Icon name="check_circle" className="!text-[18px] shrink-0" />
      {children}
    </p>
  );
}

function SubmitButton({ busy, label, busyLabel }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-secondary py-space-md text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? busyLabel : label}
      {!busy && <Icon name="arrow_forward" className="!text-[18px]" />}
    </button>
  );
}

// Shown instead of the form when the build has no Clerk publishable key, so
// the page says what is wrong rather than offering a form that cannot work.
function Unavailable() {
  return (
    <>
      <h2 className="mb-space-3xs text-headline-md font-bold text-primary">
        Accounts are unavailable
      </h2>
      <p className="mb-space-lg text-body-sm text-on-surface-variant">{CLERK_MISSING_MESSAGE}</p>
      <Link
        to="/contact"
        className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-secondary py-space-md text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
      >
        Request a free quote instead
        <Icon name="arrow_forward" className="!text-[18px]" />
      </Link>
    </>
  );
}

export default function Login() {
  const { user } = useAuth();
  const location = useLocation();

  // Where to land after a successful login — back where they were headed.
  const destination = location.state?.from || '/reports';

  if (user) return <Navigate to={destination} replace />;

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
              {clerkConfigured ? <EmailCodeForm destination={destination} /> : <Unavailable />}

              <div className="mt-space-lg flex items-center justify-end gap-space-3xs text-body-sm text-on-surface-variant">
                <Icon name="lock" className="!text-[14px]" />
                Encrypted connection
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
