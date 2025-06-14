import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from './locales/en.json';
import ja from './locales/ja.json';
import fi from './locales/fi.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ja: { translation: ja },
            fi: { translation: fi }
        },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        react: {
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'span']
        }
    },
)

export default i18n;
