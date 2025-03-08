// src/app/settings/page.tsx
'use client'
import React from 'react'
import DashboardLayout from '@layouts/DashboardLayout'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        {/* <TODO>: TTS Configuration and user preferences form */}
        <p>Settings interface goes here.</p>
      </div>
    </DashboardLayout>
  )
}
