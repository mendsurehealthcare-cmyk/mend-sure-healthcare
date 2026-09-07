import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { adoptSession, updatePassword } from '../lib/auth';
import Icon from '../components/Icon';

/*
  Landing page for every link Supabase emails: address confirmation, password
  reset, and magic links.

  Supabase verifies the token on its own domain and then redirects here with
  the result in the URL *hash* — `#access_token=...&refresh_token=...&type=...`
  on success, `#error=...&error_description=...` on failure. The hash is read
  rather than the query string because that is where Supabase puts it, and
  because a fragment is never sent to the server or written to access logs,
  which matters when it carries a session token.

  The hash is cleared as soon as it has been read so the token doesn't sit in
  the address bar, get bookmarked, or leak through a shared screenshot.
*/

const fieldClasses =
  'w-full rounded-lg bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none';

function readHash() {
  const raw = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
  const params = new URLSearchParams(raw);

  return {
    accessToken: params.get('access_token'),
    refreshToken: params.get('refresh_token'),
    expiresAt: params.get('expires_at'),
    type: params.get('type'),
    error: params.get('error_description') || params.get('error'),
    errorCode: params.get('error_code'),
  };
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  // Parsed once, during the first render rather than in an effect: the outcome
  // is already decided by the time this page loads, so deriving it up front
  // avoids a flash of "Verifying..." before an expired link resolves to an
  // error.
  const [tokens] = useState(readHash);

  const [state, setState] = useState(() => {
    if (tokens.error || !tokens.accessToken) return 'failed';
    if (tokens.type === 'recovery') return 'recovery';
    return 'working'; // still needs the profile fetch
  });

  const [message, setMessage] = useState(() => {
    if (tokens.errorCode === 'otp_expired') {
      return 'That link has expired. Links are valid for a limited time — please request a new one.';
    }
    if (tokens.error) return tokens.error;
    if (!tokens.accessToken) {
      return "This link didn't carry any sign-in details. It may have already been used, or been altered by your email client.";
    }
    return '';
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Take the token out of the address bar immediately, so it can't be
    // bookmarked, shared in a screenshot, or replayed from history.
    window.history.replaceState(null, '', window.location.pathname);

    // A recovery link deliberately does not sign anyone in on its own: it only
    // proves the holder can read that inbox, so it grants exactly one action —
    // setting a new password.
    if (state !== 'working') return;

    // Load the profile before showing success, so the account page it hands
    // over to already knows who is signed in.
    adoptSession(tokens);
    refreshUser().finally(() => setState('confirmed'));
    // Runs once on mount; `state` and `tokens` are the values decided above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send a confirmed patient into their account once they've seen the message.
  useEffect(() => {
    if (state !== 'confirmed') return undefined;
    const timer = setTimeout(() => navigate('/account', { replace: true }), 2500);
    return () => clearTimeout(timer);
  }, [state, navigate]);

  async function handleSetPassword(event) {
    event.preventDefault();
    setFormError('');

    if (password.length < 8) {
      setFormError('Please choose a password of at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Those passwords don't match.");
      return;
    }

    setSaving(true);
    try {
      await updatePassword({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        password,
      });
      await refreshUser();
      setMessage('Your password has been updated and you are now signed in.');
      setState('confirmed');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col px-space-md py-space-3xl sm:px-space-xl">
      <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:p-space-xl">
        {state === 'working' && (
          <div className="text-center">
            <Icon name="progress_activity" className="!text-[32px] text-secondary" />
            <p className="mt-space-md text-body-md text-on-surface-variant">Verifying your link...</p>
          </div>
        )}

        {state === 'confirmed' && (
          <div className="text-center">
            <div className="mx-auto mb-space-md flex h-14 w-14 items-center justify-center rounded-full bg-tertiary-fixed">
              <Icon
                name="check_circle"
                filled
                className="!text-[32px] text-on-tertiary-fixed-variant"
              />
            </div>
            <h1 className="mb-space-xs text-headline-md font-bold text-primary">
              {message || 'Email confirmed'}
            </h1>
            <p className="mb-space-lg text-body-md text-on-surface-variant">
              {message
                ? 'Taking you to your account...'
                : "Your address is verified and you're signed in. Taking you to your account..."}
            </p>
            <Link
              to="/account"
              className="inline-flex items-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
            >
              Go to my account
              <Icon name="arrow_forward" className="!text-[18px]" />
            </Link>
          </div>
        )}

        {state === 'recovery' && (
          <>
            <h1 className="mb-space-xs text-headline-md font-bold text-primary">
              Choose a new password
            </h1>
            <p className="mb-space-lg text-body-md text-on-surface-variant">
              You're setting a new password for the account this reset email was sent to.
            </p>

            <form onSubmit={handleSetPassword} className="space-y-space-md">
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-space-3xs block text-label-sm font-semibold text-on-surface-variant"
                >
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClasses}
                />
                <p className="mt-space-3xs text-body-sm text-on-surface-variant">
                  Must be at least 8 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-space-3xs block text-label-sm font-semibold text-on-surface-variant"
                >
                  Confirm new password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={fieldClasses}
                />
              </div>

              {formError && <p className="text-body-sm text-error">{formError}</p>}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-secondary py-space-md text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Set new password'}
              </button>
            </form>
          </>
        )}

        {state === 'failed' && (
          <div className="text-center">
            <div className="mx-auto mb-space-md flex h-14 w-14 items-center justify-center rounded-full bg-error-container">
              <Icon name="error" className="!text-[32px] text-on-error-container" />
            </div>
            <h1 className="mb-space-xs text-headline-md font-bold text-primary">
              We couldn't verify that link
            </h1>
            <p className="mb-space-lg text-body-md text-on-surface-variant">{message}</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-space-xs rounded-lg bg-secondary px-space-lg py-space-sm text-label-md text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
