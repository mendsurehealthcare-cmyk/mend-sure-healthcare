import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

// Exported so the language switcher and the <html lang> sync below stay in
// step with the resources registered here — adding a language means adding it
// in one place.
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: 'O‘zbekcha' },
];

i18n
  .use(LanguageDetector) // reads a saved choice, then the browser's own setting
  .use(initReactI18next) // wires t() and useTranslation into React
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      ar: { translation: ar },
      pt: { translation: pt },
      ru: { translation: ru },
      uz: { translation: uz },
    },
    fallbackLng: 'en',
    // Without this, a browser reporting "en-GB" or "pt-BR" finds no exact
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

// Keep the document's language and direction attributes honest. Screen
// readers pick their pronunciation rules from `lang`, and `dir` flips the
// layout for right-to-left scripts like Arabic.
function syncDocumentLanguage(language) {
  const code = i18n.resolvedLanguage || language;
  document.documentElement.lang = code;
  document.documentElement.dir =
    LANGUAGES.find((item) => item.code === code)?.dir || 'ltr';
}

syncDocumentLanguage(i18n.resolvedLanguage || 'en');
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
