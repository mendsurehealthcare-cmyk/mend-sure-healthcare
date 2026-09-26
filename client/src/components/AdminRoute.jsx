import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Icon from './Icon';
import StateMessage from './StateMessage';

/*
  Gates everything under /admin.

  This only controls what the dashboard shows in the browser — it stops a
  logged-out visitor or an ordinary patient from ever seeing the admin UI, but
  it proves nothing to the server. The real check is requireAuth +
  requireAdmin on every /api/admin/* route: even if someone bypassed this
  component entirely, every read and write still gets rejected server-side.

  A logged-in account without the admin role is told so, rather than being
  bounced to the homepage: that silent redirect looked exactly like "the
  dashboard is broken", when the real fix is logging in with the admin
  account (or granting this one the role in profiles.role).
*/
export default function AdminRoute({ children }) {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return <StateMessage>Checking your session...</StateMessage>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-space-md py-space-3xl text-center">
        <Icon name="admin_panel_settings" className="!text-[48px] text-outline" />
        <h1 className="mt-space-md text-headline-md text-on-surface">
          This account doesn't have admin access
        </h1>
        <p className="mt-space-sm text-body-md text-on-surface-variant">
          You're logged in as{' '}
          <span className="font-semibold text-on-surface">{user.email || user.full_name}</span>, which
          is a patient account. Log out and log in with the Mendsure admin account to open the
          dashboard.
        </p>
        <div className="mt-space-lg flex flex-wrap justify-center gap-space-sm">
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate('/login', { replace: true, state: { from: location.pathname } });
            }}
            className="rounded-lg bg-primary px-space-lg py-space-sm text-label-md text-on-primary transition-colors hover:bg-primary-container"
          >
            Log out and switch account
          </button>
          <Link
            to="/"
            className="rounded-lg bg-surface-container px-space-lg py-space-sm text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
          >
            Go to the homepage
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
