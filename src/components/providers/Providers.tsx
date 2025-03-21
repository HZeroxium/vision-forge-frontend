// src/components/providers/Providers.tsx
'use client'

import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import store from '@store/store'
import queryClient from '@/queryClient'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@styles/theme'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}
