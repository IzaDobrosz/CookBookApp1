import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import pl from './pl.json';
import se from './se.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pl: { translation: pl },
      se: { translation: se }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
