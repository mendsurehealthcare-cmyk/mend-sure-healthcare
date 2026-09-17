import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Icon from '../../components/Icon';

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: 'dashboard', end: true },
  { to: '/admin/doctors', label: 'Doctors', icon: 'stethoscope' },
  { to: '/admin/hospitals', label: 'Hospitals', icon: 'local_hospital' },
];

// The dashboard shell: a left sidebar on tablet/desktop that collapses to a
// horizontal scrolling tab strip on a phone, so the client can manage the
// site from either. Sits inside the normal site Layout (Navbar/Footer stay
// visible), which is also the easiest way back to the public pages.
export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-space-lg px-space-md py-space-lg sm:px-space-xl md:flex-row md:items-start">
      <aside className="shrink-0 md:sticky md:top-[104px] md:w-56">
        <div className="mb-space-sm hidden md:block">
          <p className="text-label-sm font-semibold tracking-wide text-on-surface-variant uppercase">
            Admin Dashboard
          </p>
          {user?.full_name && (
            <p className="truncate text-body-sm text-on-surface-variant">{user.full_name}</p>
          )}
        </div>

        <nav
          className="no-scrollbar flex gap-space-2xs overflow-x-auto rounded-xl bg-surface-container-lowest p-space-2xs shadow-sm md:flex-col md:gap-space-3xs md:overflow-visible md:p-space-xs"
          aria-label="Admin sections"
        >
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-space-xs rounded-lg px-space-sm py-space-xs text-label-md whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              <Icon name={icon} className="!text-[20px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/"
          className="mt-space-sm hidden items-center gap-space-xs px-space-sm text-body-sm text-on-surface-variant transition-colors hover:text-on-surface md:flex"
        >
          <Icon name="arrow_back" className="!text-[18px]" />
          Back to site
        </NavLink>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
