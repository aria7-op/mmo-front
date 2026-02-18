import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import enTranslations from '../../public/locales/en.json';
import drTranslations from '../../public/locales/dr.json';
import psTranslations from '../../public/locales/ps.json';

// Use direct imports for all environments to ensure keys exist in production
const useDirectImport = true;

let chain = i18n;
// If you prefer loading from public/locales in the future, toggle useDirectImport=false
if (!useDirectImport) {
  chain = chain.use(Backend); // Load translations from public folder when not directly importing
}

chain
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    backend: !useDirectImport ? {
      loadPath: '/locales/{{lng}}.json',
    } : undefined,
    resources: useDirectImport ? {
      en: { translation: enTranslations },
      dr: { translation: drTranslations },
      ps: { translation: psTranslations },
    } : undefined,
    fallbackLng: 'en', // Default language
    supportedLngs: ['en', 'dr', 'ps'], // Supported languages
    debug: false,
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    detection: {
      // Order of language detection methods (querystring overrides everything)
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      // Cache user language on
      caches: ['localStorage'],
      // Keys used to store language preference
      lookupLocalStorage: 'i18nextLng',
      // Querystring key to override language (e.g., ?lang=ps)
      lookupQuerystring: 'lang'
    }
  }).then(() => {
    // Helper to set html attributes according to language
    const applyLangDir = (lng) => {
      try {
        document.documentElement.lang = lng;
        document.documentElement.dir = (lng === 'dr' || lng === 'ps') ? 'rtl' : 'ltr';
      } catch (e) {
        // ignore DOM access issues
      }
    };

    // Map common locale codes to supported ones (e.g., fa -> dr)
    const lang = i18n.language || 'en';
    const aliasMap = {
      fa: 'dr',
      'fa-AF': 'dr',
      prs: 'dr',
      'ps-AF': 'ps'
    };
    const mapped = aliasMap[lang];
    if (mapped && mapped !== lang) {
      i18n.changeLanguage(mapped);
      try {
        localStorage.setItem('i18nextLng', mapped);
      } catch (e) {
        // ignore storage errors
      }
      applyLangDir(mapped);
    } else {
      // Ensure correct dir/lang even when no alias mapping happens
      applyLangDir(lang);
    }

    // Keep html attributes in sync when language changes in runtime
    i18n.on('languageChanged', (lng) => applyLangDir(lng));
  });

export default i18n;


