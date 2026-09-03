import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Icon from './Icon';

const links = [
  { to: '/treatments', label: 'Treatments' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/testimonials', label: 'Patient Stories' },
  { to: '/about', label: 'About' },
];

// Nav links render as pills: the active route gets a solid navy pill, the rest
// stay quiet until hovered.
function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-lg px-space-sm py-space-xs text-body-md whitespace-nowrap transition-colors ${
          isActive
            ? 'bg-primary font-semibold text-on-primary'
            : 'text-on-surface-variant hover:text-on-surface'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

// Avatar button + dropdown shown once a patient is logged in.
function AccountMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close on outside click and whenever the route changes.
  useEffect(() => {
    if (!open) return undefined;

    function handleClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const initial = (user.full_name || user.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-label-md font-semibold text-on-primary transition-colors hover:bg-primary-container"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-space-xs w-64 overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl"
        >
          <div className="bg-surface-container-low px-space-md py-space-sm">
            <p className="truncate text-label-md font-semibold text-on-surface">
              {user.full_name || 'Your account'}
            </p>
            <p className="truncate text-body-sm text-on-surface-variant">{user.email}</p>
          </div>

          <NavLink
            to="/reports"
            role="menuitem"
            className="flex items-center gap-space-sm px-space-md py-space-sm text-body-md text-on-surface transition-colors hover:bg-surface-container"
          >
            <Icon name="folder_shared" className="!text-[20px] text-secondary" />
            My Medical Reports
          </NavLink>

          <NavLink
            to="/account"
            role="menuitem"
            className="flex items-center gap-space-sm px-space-md py-space-sm text-body-md text-on-surface transition-colors hover:bg-surface-container"
          >
            <Icon name="account_circle" className="!text-[20px] text-secondary" />
            My Account
          </NavLink>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-space-sm border-t border-outline-variant/20 px-space-md py-space-sm text-left text-body-md text-on-surface transition-colors hover:bg-error-container hover:text-on-error-container"
          >
            <Icon name="logout" className="!text-[20px]" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleSearch(event) {
    event.preventDefault();
    if (!search.trim()) return;
    navigate(`/treatments?specialty=${encodeURIComponent(search.trim())}`);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-surface/90 backdrop-blur-xl">
      {/* Emergency hotline strip */}
      <div className="flex items-center justify-between bg-primary px-space-md py-space-2xs text-label-sm text-on-primary sm:px-space-2xl">
        <div className="flex items-center gap-space-sm">
          <Icon name="emergency" className="!text-[16px]" />
          <span>Emergency Hotline: 24/7 Support</span>
        </div>
        <span className="hidden opacity-80 sm:inline">Verified Clinical Network</span>
      </div>

      <div className="mx-auto flex h-space-3xl max-w-7xl items-center justify-between px-space-md sm:px-space-xl">
        <NavLink to="/" className="flex shrink-0 items-center gap-space-sm">
          <img src="/logo-icon.svg" alt="Mend Sure" className="h-8 w-8" />
          <span className="text-headline-sm font-bold tracking-tight whitespace-nowrap text-primary">
            Mend Sure
          </span>
        </NavLink>

        <nav className="hidden items-center gap-space-2xs xl:flex">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-space-sm">
          <form onSubmit={handleSearch} className="relative hidden 2xl:block">
            <Icon
              name="search"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 !text-[20px] text-outline"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a specialty..."
              className="w-56 rounded-lg bg-surface-container-low py-space-xs pr-space-md pl-10 text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none"
            />
          </form>

          <NavLink
            to="/contact"
            className="hidden shrink-0 rounded-lg bg-secondary px-space-md py-space-xs text-label-md whitespace-nowrap text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed xl:inline-flex"
          >
            Book Consultation
          </NavLink>

          {user ? (
            <AccountMenu user={user} onLogout={handleLogout} />
          ) : (
            <NavLink
              to="/login"
              className="hidden shrink-0 items-center gap-space-3xs rounded-lg px-space-sm py-space-xs text-label-md whitespace-nowrap text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface xl:inline-flex"
            >
              <Icon name="login" className="!text-[18px]" />
              Log In
            </NavLink>
          )}

          <button
            type="button"
            className="text-primary xl:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-space-xs border-t border-outline-variant/20 bg-surface px-space-md py-space-md xl:hidden">
          {links.map((link) => (
            <NavItem key={link.to} {...link} onClick={() => setMenuOpen(false)} />
          ))}

          <div className="mt-space-xs flex flex-col gap-space-xs border-t border-outline-variant/20 pt-space-md">
            {user ? (
              <>
                <NavItem to="/reports" label="My Medical Reports" onClick={() => setMenuOpen(false)} />
                <NavItem to="/account" label="My Account" onClick={() => setMenuOpen(false)} />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg px-space-sm py-space-xs text-left text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  Log Out
                </button>
              </>
            ) : (
              <NavItem to="/login" label="Log In / Create Account" onClick={() => setMenuOpen(false)} />
            )}

            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-secondary px-space-lg py-space-sm text-center text-label-md text-on-secondary"
            >
              Book Consultation
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
