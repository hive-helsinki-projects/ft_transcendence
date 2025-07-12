import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fi from './locales/fi.json'
import ja from './locales/ja.json'

// Get saved language from localStorage or fallback to 'en'
const savedLanguage = localStorage.getItem('language') || 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
    fi: { translation: fi },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'span'],
  },
})

// Save language to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n
