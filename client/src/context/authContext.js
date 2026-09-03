import { createContext } from 'react';

// Kept in its own file (no components) so React Fast Refresh stays granular
// for AuthProvider. Consume it through the useAuth() hook, not directly.
export const AuthContext = createContext(null);
