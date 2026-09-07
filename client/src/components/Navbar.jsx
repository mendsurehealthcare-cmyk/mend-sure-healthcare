import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/useAuth';
import Icon from './Icon';
import LanguageSwitcher from './LanguageSwitcher';

// labelKey rather than a literal: the label is resolved at render time so it
// re-renders in the new language the moment the switcher changes it.
const links = [
  { to: '/treatments', labelKey: 'nav.treatments' },
  { to: '/hospitals', labelKey: 'nav.hospitals' },
  { to: '/doctors', labelKey: 'nav.doctors' },
  { to: '/how-it-works', labelKey: 'nav.howItWorks' },
  { to: '/testimonials', labelKey: 'nav.patientStories' },
  { to: '/about', labelKey: 'nav.about' },
];

// Nav links render as pills: the active route gets a solid navy pill, the rest
// stay quiet until hovered.
function NavItem({ to, labelKey, label, onClick }) {
  const { t } = useTranslation();

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
      {labelKey ? t(labelKey) : label}
    </NavLink>
  );
}

// Avatar button + dropdown shown once a patient is logged in.
function AccountMenu({ user, onLogout }) {
  const { t } = useTranslation();
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
        aria-label={t('nav.accountMenu')}
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
              {user.full_name || t('nav.yourAccount')}
            </p>
            <p className="truncate text-body-sm text-on-surface-variant">{user.email}</p>
          </div>

          <NavLink
            to="/reports"
            role="menuitem"
            className="flex items-center gap-space-sm px-space-md py-space-sm text-body-md text-on-surface transition-colors hover:bg-surface-container"
          >
            <Icon name="folder_shared" className="!text-[20px] text-secondary" />
            {t('nav.myReports')}
          </NavLink>

          <NavLink
            to="/account"
            role="menuitem"
            className="flex items-center gap-space-sm px-space-md py-space-sm text-body-md text-on-surface transition-colors hover:bg-surface-container"
          >
            <Icon name="account_circle" className="!text-[20px] text-secondary" />
            {t('nav.myAccount')}
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
            {t('nav.logOut')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
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
          <span>{t('nav.hotline')}</span>
        </div>
        <span className="hidden opacity-80 sm:inline">{t('nav.verifiedNetwork')}</span>
      </div>

      <div className="mx-auto flex h-space-3xl max-w-7xl items-center justify-between px-space-md sm:px-space-xl">
        {/* The roundel is decorative here — the wordmark beside it already
            names the link, so alt="" avoids a screen reader saying it twice.
            The stacked master lockup is too tall for a 64px bar, so the
            wordmark is set in type rather than used as an image. */}
        <NavLink to="/" className="flex shrink-0 items-center gap-space-sm">
          <img src="/logo-mark.png" alt="" className="h-10 w-10 shrink-0" />
          <span className="flex flex-col justify-center leading-none">
            <span className="text-headline-sm font-extrabold tracking-tight whitespace-nowrap text-primary">
              MENDSURE
            </span>
            <span className="mt-space-3xs text-[9px] font-semibold tracking-[0.16em] whitespace-nowrap text-secondary">
              HEALTHCARE SERVICES
            </span>
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
              placeholder={t('nav.searchPlaceholder')}
              className="w-56 rounded-lg bg-surface-container-low py-space-xs pr-space-md pl-10 text-body-md text-on-surface transition-all focus:ring-2 focus:ring-secondary focus:outline-none"
            />
          </form>

          <NavLink
            to="/contact"
            className="hidden shrink-0 rounded-lg bg-secondary px-space-md py-space-xs text-label-md whitespace-nowrap text-on-secondary shadow-sm transition-colors hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed xl:inline-flex"
          >
            {t('nav.bookConsultation')}
          </NavLink>

          {user ? (
            <AccountMenu user={user} onLogout={handleLogout} />
          ) : (
            <NavLink
              to="/login"
              className="hidden shrink-0 items-center gap-space-3xs rounded-lg px-space-sm py-space-xs text-label-md whitespace-nowrap text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface xl:inline-flex"
            >
              <Icon name="login" className="!text-[18px]" />
              {t('nav.logIn')}
            </NavLink>
          )}

          {/* Hidden below xl alongside the rest of the desktop controls — the
              mobile menu carries its own copy so the bar stays uncluttered. */}
          <LanguageSwitcher className="hidden xl:block" />

          <button
            type="button"
            className="text-primary xl:hidden"
            aria-label={t('nav.toggleMenu')}
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
                <NavItem to="/reports" labelKey="nav.myReports" onClick={() => setMenuOpen(false)} />
                <NavItem to="/account" labelKey="nav.myAccount" onClick={() => setMenuOpen(false)} />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg px-space-sm py-space-xs text-left text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  {t('nav.logOut')}
                </button>
              </>
            ) : (
              <NavItem to="/login" labelKey="nav.logInCreate" onClick={() => setMenuOpen(false)} />
            )}

            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-secondary px-space-lg py-space-sm text-center text-label-md text-on-secondary"
            >
              {t('nav.bookConsultation')}
            </NavLink>

            <LanguageSwitcher className="mt-space-xs" />
          </div>
        </nav>
      )}
    </header>
  );
}
