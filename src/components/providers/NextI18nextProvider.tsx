// src/providers/NextI18nextProvider.tsx
'use client'

import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18nClient' // a client config

export function NextI18nextProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
