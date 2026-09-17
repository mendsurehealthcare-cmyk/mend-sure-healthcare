import { useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth as useClerkAuth, useSignIn, useSignUp } from '@clerk/clerk-react';
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

// Clerk answers with this when the address has never been seen — the log-in
// tab uses it to point the patient at "Create Account" instead of guessing
// which one they meant.
function isUnknownEmail(error) {
  return error?.errors?.some((item) => item.code === 'form_identifier_not_found');
}

// Clerk answers with this from signUp.create when the address already has an
// account — the create-account tab uses it to point back at "Log In".
function isEmailTaken(error) {
  return error?.errors?.some((item) => item.code === 'form_identifier_exists');
}

// Clerk answers with this when the six digits were already redeemed by an
// earlier attempt — which almost always means the *first* submission already
// succeeded and this is a second, redundant one arriving late (a browser's
// one-time-code autofill can both fill the field and submit the form, right
// as a patient also presses the button themselves; a slow network can make a
// patient press it twice before it visibly disables). The code itself isn't
// wrong, so this shouldn't read as a failure to the patient — see
// handleCodeSubmit, which checks whether the account actually did finish
// verifying and signs them in if so, rather than showing this raw message.
function isAlreadyVerified(error) {
  const first = error?.errors?.[0];
  if (!first) return false;
  return (
    first.code === 'verification_already_verified' ||
    /already been verified/i.test(first.longMessage || first.message || '')
  );
}

// New-account sign-up goes through Clerk's bot check (the `clerk-captcha`
// element below), which silently never resolves if its challenge fails to
// load — an ad blocker or a strict corporate network stripping third-party
// scripts is enough. Without this, that leaves the button reading "Sending
// code..." forever with no way out but a page refresh the patient has no
// reason to think to try. Racing every Clerk call against a timeout turns
// that into an error they can actually act on.
const CLERK_CALL_TIMEOUT_MS = 20000;

function withTimeout(promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "This is taking longer than expected. Please refresh the page and try again — if it keeps happening, request a free quote instead and we'll set up your account for you."
            )
          ),
        CLERK_CALL_TIMEOUT_MS
      )
    ),
  ]);
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

// Six-digit code entry, shared by both tabs — everything above this step
// (email only vs. full details) differs, but confirming the emailed code
// works identically either way.
function CodeStep({ email, code, setCode, busy, error, notice, onSubmit, onResend, onStartOver, submitLabel }) {
  return (
    <form onSubmit={onSubmit} className="space-y-space-md">
      <p className="text-body-sm text-on-surface-variant">
        We've sent six digits to {email}. The code is good for ten minutes.
      </p>

      <div>
        <label className={labelClasses} htmlFor="code">
          Six-Digit Code
        </label>
        <input
          id="code"
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

      <SubmitButton busy={busy} label={submitLabel} busyLabel="Checking..." />

      <div className="flex flex-wrap items-center justify-between gap-space-sm text-body-sm">
        <button
          type="button"
          onClick={onResend}
          disabled={busy}
          className="font-semibold text-secondary hover:underline disabled:opacity-60"
        >
          Send a new code
        </button>
        <button type="button" onClick={onStartOver} className="font-semibold text-secondary hover:underline">
          Start over
        </button>
      </div>
    </form>
  );
}

/*
  Log in only. An email that has never signed up is told to use Create
  Account instead, rather than this tab silently creating one — that
  ambiguity was the whole reason log-in and sign-up used to be one form.
*/
function LoginForm({ destination, initialEmail, onNeedsAccount }) {
  const navigate = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [step, setStep] = useState('email'); // email | code
  const [email, setEmail] = useState(initialEmail || '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const submittingRef = useRef(false);

  async function handleEmailSubmit(event) {
    event.preventDefault();
    if (!isLoaded || submittingRef.current) return;
    submittingRef.current = true;
    setBusy(true);
    setError('');
    setNotice('');

    try {
      const attempt = await withTimeout(signIn.create({ identifier: email }));
      const factor = attempt.supportedFirstFactors?.find((item) => item.strategy === 'email_code');
      if (!factor) throw new Error('This account cannot be signed in to by email code.');

      await withTimeout(
        signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: factor.emailAddressId })
      );
      setStep('code');
      setNotice(`We've emailed a six-digit code to ${email}.`);
    } catch (err) {
      if (isUnknownEmail(err)) {
        setError('');
        onNeedsAccount(email);
      } else {
        setError(readableError(err));
      }
    } finally {
      setBusy(false);
      submittingRef.current = false;
    }
  }

  async function handleCodeSubmit(event) {
    event.preventDefault();
    if (!isLoaded || submittingRef.current) return;
    submittingRef.current = true;
    setBusy(true);
    setError('');

    try {
      const result = await withTimeout(signIn.attemptFirstFactor({ strategy: 'email_code', code }));

      if (result.status !== 'complete') {
        setError('We need a little more to finish signing you in. Please contact us for help.');
        return;
      }

      await setActive({ session: result.createdSessionId });
      navigate(destination, { replace: true });
    } catch (err) {
      if (isAlreadyVerified(err) && signIn?.status === 'complete' && signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
        navigate(destination, { replace: true });
        return;
      }
      setError(readableError(err));
    } finally {
      setBusy(false);
      submittingRef.current = false;
    }
  }

  async function handleResend() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const factor = signIn.supportedFirstFactors?.find((item) => item.strategy === 'email_code');
      await signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: factor?.emailAddressId });
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

  if (step === 'code') {
    return (
      <CodeStep
        email={email}
        code={code}
        setCode={setCode}
        busy={busy || !isLoaded}
        error={error}
        notice={notice}
        onSubmit={handleCodeSubmit}
        onResend={handleResend}
        onStartOver={startOver}
        submitLabel="Log In"
      />
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="space-y-space-md">
      <div>
        <label className={labelClasses} htmlFor="login-email">
          Email Address
        </label>
        <input
          id="login-email"
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
      <div id="clerk-captcha" />
      <SubmitButton busy={busy || !isLoaded} label="Send Code" busyLabel="Sending code..." />
    </form>
  );
}

/*
  Create account: name, phone, country and email are all collected here,
  before the code is even sent — not left for the patient to fill in later on
  the Account page, which most people never go back and do.
*/
function SignUpForm({ destination, initialEmail, onHasAccount }) {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { getToken } = useClerkAuth();

  const [step, setStep] = useState('details'); // details | code
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState(initialEmail || '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const submittingRef = useRef(false);

  async function handleDetailsSubmit(event) {
    event.preventDefault();
    if (!isLoaded || submittingRef.current) return;
    submittingRef.current = true;
    setBusy(true);
    setError('');
    setNotice('');

    try {
      await withTimeout(signUp.create({ emailAddress: email }));
      await withTimeout(signUp.prepareEmailAddressVerification({ strategy: 'email_code' }));
      setStep('code');
      setNotice(`We've emailed a six-digit code to ${email}.`);
    } catch (err) {
      if (isEmailTaken(err)) {
        setError('');
        onHasAccount(email);
      } else {
        setError(readableError(err));
      }
    } finally {
      setBusy(false);
      submittingRef.current = false;
    }
  }

  // Best-effort: saves straight to the profile with a token pulled directly
  // from this just-activated session, rather than going through the app-wide
  // authFetch helper, whose token source is registered by AuthProvider a
  // render or two after setActive resolves — calling it immediately here
  // would race that registration. If this write fails for some reason, the
  // account itself is still created and signed in; the patient can fill
  // these back in from the Account page.
  async function saveDetails() {
    try {
      const token = await getToken();
      if (!token) return;
      await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName, phone, country, email }),
      });
    } catch {
      // Non-fatal — see comment above.
    }
  }

  async function handleCodeSubmit(event) {
    event.preventDefault();
    if (!isLoaded || submittingRef.current) return;
    submittingRef.current = true;
    setBusy(true);
    setError('');

    try {
      const result = await withTimeout(signUp.attemptEmailAddressVerification({ code }));

      if (result.status !== 'complete') {
        setError('We need a little more to finish creating your account. Please contact us for help.');
        return;
      }

      await setActive({ session: result.createdSessionId });
      await saveDetails();
      navigate(destination, { replace: true });
    } catch (err) {
      if (isAlreadyVerified(err) && signUp?.status === 'complete' && signUp.createdSessionId) {
        await setActive({ session: signUp.createdSessionId });
        await saveDetails();
        navigate(destination, { replace: true });
        return;
      }
      setError(readableError(err));
    } finally {
      setBusy(false);
      submittingRef.current = false;
    }
  }

  async function handleResend() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setNotice(`We've sent another code to ${email}.`);
    } catch (err) {
      setError(readableError(err));
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    setStep('details');
    setCode('');
    setError('');
    setNotice('');
  }

  if (step === 'code') {
    return (
      <CodeStep
        email={email}
        code={code}
        setCode={setCode}
        busy={busy || !isLoaded}
        error={error}
        notice={notice}
        onSubmit={handleCodeSubmit}
        onResend={handleResend}
        onStartOver={startOver}
        submitLabel="Create Account"
      />
    );
  }

  return (
    <form onSubmit={handleDetailsSubmit} className="space-y-space-md">
      <div>
        <label className={labelClasses} htmlFor="signup-name">
          Full Name
        </label>
        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className={fieldClasses}
        />
      </div>

      <div>
        <label className={labelClasses} htmlFor="signup-email">
          Email Address
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="patient@example.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClasses}
        />
      </div>

      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="signup-phone">
            Phone / WhatsApp
          </label>
          <input
            id="signup-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={fieldClasses}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="signup-country">
            Country
          </label>
          <input
            id="signup-country"
            type="text"
            autoComplete="country-name"
            placeholder="Country you're calling from"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className={fieldClasses}
          />
        </div>
      </div>

      {error && <FormError>{error}</FormError>}
      <div id="clerk-captcha" />
      <SubmitButton busy={busy || !isLoaded} label="Send Code" busyLabel="Sending code..." />
    </form>
  );
}

function AuthTabs({ destination }) {
  const [mode, setMode] = useState('login'); // login | signup
  const [prefillEmail, setPrefillEmail] = useState('');

  function switchTo(nextMode, email) {
    setMode(nextMode);
    if (email) setPrefillEmail(email);
  }

  return (
    <>
      <div className="mb-space-lg grid grid-cols-2 gap-space-2xs rounded-lg bg-surface-container-low p-space-3xs">
        <button
          type="button"
          onClick={() => setMode('login')}
          aria-pressed={mode === 'login'}
          className={`rounded-md py-space-sm text-label-md transition-colors ${
            mode === 'login'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          aria-pressed={mode === 'signup'}
          className={`rounded-md py-space-sm text-label-md transition-colors ${
            mode === 'signup'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Create Account
        </button>
      </div>

      {mode === 'login' ? (
        <>
          <h2 className="mb-space-3xs text-headline-md font-bold text-primary">Log in</h2>
          <p className="mb-space-lg text-body-sm text-on-surface-variant">
            Enter your email and we'll send you a six-digit code. No password to remember.
          </p>
          <LoginForm
            destination={destination}
            initialEmail={prefillEmail}
            onNeedsAccount={(email) => switchTo('signup', email)}
          />
          <p className="mt-space-lg text-center text-body-sm text-on-surface-variant">
            No account for that email.{' '}
            <button
              type="button"
              onClick={() => switchTo('signup')}
              className="font-semibold text-secondary hover:underline"
            >
              Create one instead
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="mb-space-3xs text-headline-md font-bold text-primary">Create your account</h2>
          <p className="mb-space-lg text-body-sm text-on-surface-variant">
            Tell us a little about yourself, then confirm your email with a six-digit code.
          </p>
          <SignUpForm
            destination={destination}
            initialEmail={prefillEmail}
            onHasAccount={(email) => switchTo('login', email)}
          />
          <p className="mt-space-lg text-center text-body-sm text-on-surface-variant">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => switchTo('login')}
              className="font-semibold text-secondary hover:underline"
            >
              Log in instead
            </button>
          </p>
        </>
      )}
    </>
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
              {clerkConfigured ? <AuthTabs destination={destination} /> : <Unavailable />}

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
