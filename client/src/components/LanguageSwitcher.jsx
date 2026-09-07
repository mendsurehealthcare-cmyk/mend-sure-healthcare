import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';
import Icon from './Icon';

/*
  Language picker for the navbar.

  A native <select> on purpose: it costs no extra markup, is keyboard and
  screen-reader accessible for free, and on phones opens the OS picker rather
  than a cramped custom dropdown.

  i18next-browser-languagedetector persists the choice to localStorage, so it
  survives reloads without any state of our own.
*/
export default function LanguageSwitcher({ className = '' }) {
  const { i18n, t } = useTranslation();

  // resolvedLanguage, not language: a browser set to "en-GB" reports that as
  // `language`, which matches no <option> and leaves the select looking blank.
  const current = i18n.resolvedLanguage || 'en';

  return (
    <div className={`relative ${className}`}>
      <Icon
        name="language"
        className="pointer-events-none absolute top-1/2 left-2 z-10 -translate-y-1/2 !text-[18px] text-on-surface-variant"
      />
      <select
        value={current}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        aria-label={t('nav.language')}
        className="cursor-pointer appearance-none rounded-lg bg-surface-container py-space-xs pr-space-lg pl-8 text-label-md text-on-surface transition-colors hover:bg-surface-container-high focus:ring-2 focus:ring-secondary focus:outline-none"
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
      <Icon
        name="expand_more"
        className="pointer-events-none absolute top-1/2 right-1 z-10 -translate-y-1/2 !text-[16px] text-on-surface-variant"
      />
    </div>
  );
}
