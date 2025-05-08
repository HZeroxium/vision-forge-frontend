// src/components/providers/Providers.tsx
'use client'

import React, { useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import store from '@store/store'
import queryClient from '@/queryClient'
import MUIThemeProvider from '@/styles/theme'
import { initializeSettings } from '@/store/settingsSlice'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize settings from localStorage/system preferences after hydration
    store.dispatch(initializeSettings())
  }, [])

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <MUIThemeProvider>{children}</MUIThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}
