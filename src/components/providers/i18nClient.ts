// src/providers/i18nClient.ts
'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(HttpApi) // Load translations from public/locales
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    ns: ['auth'], // Declare namespace
    defaultNS: 'auth',
    interpolation: {
      escapeValue: false, // React already escapes output
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Load translation files
    },
  })

export default i18n
