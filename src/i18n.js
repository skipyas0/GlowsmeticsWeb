import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import csTranslation from './locales/cs/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  cs: {
    translation: csTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'cs', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
