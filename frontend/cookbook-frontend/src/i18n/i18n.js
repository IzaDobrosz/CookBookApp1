import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import pl from './pl.json';
import sv from './sv.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pl: { translation: pl },
      sv: { translation: sv }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
