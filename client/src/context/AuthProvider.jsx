import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { AuthContext } from './authContext';
import { authFetch, registerTokenSource } from '../lib/auth';
import { clerkConfigured } from '../lib/clerk';

/*
  Holds the logged-in patient for the whole app.

  Two halves make up a patient. Clerk owns the identity — the email address,
  the verified state, the session — and the database owns the profile: the
  name, phone and country the care team reads next to an enquiry. This merges
  them into the single `user` object the rest of the app already expects, so
  Navbar, ProtectedRoute, Account and Reports did not have to change when the
  identity provider did.

  The email always comes from Clerk rather than from a copy in our database.
  A stored copy goes stale the moment someone changes their address, and the
  browser already has the live one.
*/
function ClerkAuthProvider({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken, signOut } = useClerkAuth();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // authFetch and submitInquiry are called from plain functions as well as
  // components, so the token getter is handed to lib/auth.js once here.
  useEffect(() => {
    registerTokenSource(isSignedIn ? getToken : null);
    return () => registerTokenSource(null);
  }, [isSignedIn, getToken]);

  const loadProfile = useCallback(async () => {
    if (!isSignedIn) {
      setProfile(null);
      return null;
    }

    setProfileLoading(true);
    try {
      // The API creates the row on first sight, so a brand-new account gets a
      // profile back rather than a 404.
      const loaded = await authFetch('/auth/me');
      setProfile(loaded);
      return loaded;
    } catch {
      // The account is real and signed in — the profile fetch failing means
      // our API is unreachable or misconfigured, not that they are logged out.
      // An empty profile lets them stay signed in and see the account page's
      // own error rather than being bounced to the login screen.
      setProfile({});
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded) loadProfile();
  }, [isLoaded, loadProfile]);

  const email = clerkUser?.primaryEmailAddress?.emailAddress || '';

  const value = useMemo(() => {
    const user = isSignedIn && profile ? { email, ...profile } : null;

    return {
      user,
      // Signed in but still fetching the profile still counts as loading, so
      // ProtectedRoute waits rather than flashing the login page at someone
      // who is already logged in.
      loading: !isLoaded || (isSignedIn && !profile && profileLoading),
      logout: () => signOut(),
      // Account saves its form and hands back the updated profile.
      setUser: setProfile,
      refreshUser: loadProfile,
    };
  }, [isLoaded, isSignedIn, profile, profileLoading, email, signOut, loadProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/*
  Stands in when there is no Clerk publishable key. Clerk's hooks throw
  outside a ClerkProvider, so this cannot simply be the same component with a
  guard inside it — it has to be a separate one, chosen by a value that never
  changes for the lifetime of the app so the hooks it calls stay stable.

  Everyone is logged out. Public pages work; the account pages send people to
  the login screen, which explains itself.
*/
function UnconfiguredAuthProvider({ children }) {
  const value = useMemo(
    () => ({
      user: null,
      loading: false,
      logout: () => {},
      setUser: () => {},
      refreshUser: async () => null,
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }) {
  const Provider = clerkConfigured ? ClerkAuthProvider : UnconfiguredAuthProvider;
  return <Provider>{children}</Provider>;
}
