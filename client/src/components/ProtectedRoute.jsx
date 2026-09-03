import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import StateMessage from './StateMessage';

// Gates the account/report pages. Sends anyone logged out to /login, and
// remembers where they were headed so login can send them straight back.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <StateMessage>Checking your session...</StateMessage>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
