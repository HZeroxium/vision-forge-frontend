// src/providers/i18nClient.ts
'use client'

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

// Make sure to load translations
import enAuth from '../../../public/locales/en/auth.json'
import viAuth from '../../../public/locales/vi/auth.json'

// Don't initialize i18next on the server side
const isServer = typeof window === 'undefined'

// Create instance
const i18n = i18next

if (!isServer) {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      supportedLngs: ['en', 'vi'],
      // Handle Vietnamese locale variants
      load: 'languageOnly', // This converts 'vi-VN' to 'vi'
      ns: ['auth'],
      defaultNS: 'auth',
      interpolation: {
        escapeValue: false,
      },
      debug: process.env.NODE_ENV === 'development',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      react: {
        useSuspense: false,
      },
      // Provide initial resources to avoid loading delays
      resources: {
        en: {
          auth: enAuth,
        },
        vi: {
          auth: viAuth,
        },
      },
    })
}

export default i18n
