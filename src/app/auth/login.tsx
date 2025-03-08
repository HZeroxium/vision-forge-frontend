// src/app/auth/login.tsx
import React from 'react'
import AuthLayout from '@layouts/AuthLayout'
import LoginForm from '@components/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        <LoginForm />
      </div>
    </AuthLayout>
  )
}
