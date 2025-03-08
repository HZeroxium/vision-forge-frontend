// src/layouts/AuthLayout.tsx
import React from 'react'

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {children}
    </div>
  )
}

export default AuthLayout
