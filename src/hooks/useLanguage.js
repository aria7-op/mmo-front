import { useTranslation } from 'react-i18next';

/**
 * Custom hook for language utilities
 * Provides language detection and content formatting
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();

  const getUILanguage = () => {
    const lang = i18n.language;
    if (lang?.startsWith('dr')) return 'dr';
    if (lang?.startsWith('ps')) return 'ps';
    return 'en';
  };

  return {
    uiLang: getUILanguage(),
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage,
  };
};
