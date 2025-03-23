// src/layouts/AuthLayout.tsx
'use client'
import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@mui/material'

/**
 * AuthLayout: Splits screen into 2 columns (left image, right form).
 * On small screens, form stacks on top and image is partially blurred behind.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left column: image */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto">
        <Image
          src="/images/logo.webp" // Your image path
          alt="Auth Background"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay (semi-transparent) */}
        {/* <div className="absolute inset-0 bg-black/30 md:bg-black/50" /> */}
      </div>

      {/* Right column: form content */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-8 px-4 bg-base-100">
        <Card
          className="shadow-xl w-full max-w-md"
          sx={{ borderRadius: 4, margin: 2 }}
        >
          <CardContent className="p-6 sm:p-8">{children}</CardContent>
        </Card>
      </div>
    </div>
  )
}
