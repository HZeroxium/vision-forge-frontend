// src/app/page.tsx
import React from 'react'
import DashboardLayout from '@layouts/DashboardLayout'

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Welcome to Vision Forge Project</h1>
        <p className="mt-2">
          This is the landing page. <strong>Explore features...</strong>
        </p>
      </div>
    </DashboardLayout>
  )
}
