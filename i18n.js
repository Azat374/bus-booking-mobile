import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import ru from './locales/ru.json';
import kz from './locales/kz.json';

const resources = {
  kz: { translation: kz },
  ru: { translation: ru },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0].languageCode, // Автоопределение (например, 'ru' из 'ru-RU')
    fallbackLng: 'kz', // По умолчанию — казахский
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
