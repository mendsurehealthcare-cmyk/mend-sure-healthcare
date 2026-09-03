import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import * as auth from '../lib/auth';

/*
  Holds the logged-in patient's profile for the whole app. On mount it checks
  for a stored session and asks the API who it belongs to — a stale or revoked
  token simply resolves to "logged out" rather than an error screen.
*/
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!auth.getSession()) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const profile = await auth.authFetch('/auth/me');
      setUser(profile);
      return profile;
    } catch {
      auth.clearSession();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = useMemo(
    () => ({
      user,
      loading,

      async login(email, password) {
        await auth.login(email, password);
        return loadUser();
      },

      // Returns the raw result so the form can tell "logged straight in" from
      // "check your email to confirm first".
      async signup(email, password) {
        const result = await auth.signup(email, password);
        if (result.access_token) await loadUser();
        return result;
      },

      logout() {
        auth.logout();
        setUser(null);
      },

      setUser,
      refreshUser: loadUser,
    }),
    [user, loading, loadUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
