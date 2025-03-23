// src/app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@styles/globals.css'
import React from 'react'
import Providers from '@components/providers/Providers'
import { NextI18nextProvider } from '@/components/providers/NextI18nextProvider'
import TopNav from '@/components/navigation/TopNav'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Vision Forge',
  description: 'AI Platform for Media Creation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200`}
      >
        <NextI18nextProvider>
          <Providers>
            <TopNav />
            {children}
          </Providers>
        </NextI18nextProvider>
      </body>
    </html>
  )
}
