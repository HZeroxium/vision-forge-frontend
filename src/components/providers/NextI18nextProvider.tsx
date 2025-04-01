// src/providers/NextI18nextProvider.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18nClient'

export function NextI18nextProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Apply language preferences after mounting
    const detectedLng = localStorage.getItem('i18nextLng')
    if (detectedLng) {
      // Convert any Vietnamese locale variants to just 'vi'
      const normalizedLng = detectedLng.startsWith('vi') ? 'vi' : detectedLng
      i18n.changeLanguage(normalizedLng)
    }
  }, [])

  // Server-side rendering needs special handling
  if (typeof window === 'undefined') {
    return <>{children}</>
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
