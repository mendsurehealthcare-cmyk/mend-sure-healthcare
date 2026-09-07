import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

// Exported so the language switcher and the <html lang> sync below stay in
// step with the resources registered here — adding a language means adding it
// in one place.
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
];

i18n
  .use(LanguageDetector) // reads a saved choice, then the browser's own setting
  .use(initReactI18next) // wires t() and useTranslation into React
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      es: { translation: es },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    // Without this, a browser reporting "en-GB" or "hi-IN" finds no exact
    // match and silently falls back to English. Stripping the region maps
    // those onto the base language we actually ship.
    load: 'languageOnly',
    supportedLngs: LANGUAGES.map((language) => language.code),
    interpolation: { escapeValue: false }, // React escapes already
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Keep the document's language attribute honest. Screen readers pick their
// pronunciation rules from it, and it's what `lang`-scoped CSS keys off — so a
// page reading as Hindi while <html> still claims English is announced wrong.
function syncDocumentLanguage(language) {
  document.documentElement.lang = language;
}

syncDocumentLanguage(i18n.resolvedLanguage || 'en');
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
