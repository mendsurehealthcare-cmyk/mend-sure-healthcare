import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import StateMessage from './StateMessage';

/*
  Gates everything under /admin.

  This only controls what the dashboard shows in the browser — it stops a
  logged-out visitor or an ordinary patient from ever seeing the admin UI, but
  it proves nothing to the server. The real check is requireAuth +
  requireAdmin on every /api/admin/* route: even if someone bypassed this
  component entirely, every read and write still gets rejected server-side.
*/
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <StateMessage>Checking your session...</StateMessage>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
