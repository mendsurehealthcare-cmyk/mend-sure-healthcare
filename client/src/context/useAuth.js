import { useContext } from 'react';
import { AuthContext } from './authContext';

// The logged-in patient plus the login/signup/logout actions.
// Usage: const { user, loading, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }

  return context;
}
