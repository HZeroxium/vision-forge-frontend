// src/layouts/DashboardLayout.tsx
import React from 'react'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

export default DashboardLayout
