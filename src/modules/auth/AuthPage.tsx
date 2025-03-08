// src/modules/auth/AuthPage.tsx
import React from 'react'
import AuthLayout from '@layouts/AuthLayout'
import LoginForm from '@components/auth/LoginForm'
import RegisterForm from '@components/auth/RegisterForm'

export default function AuthPage() {
  // <TODO>: Toggle between LoginForm and RegisterForm based on user action
  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        <LoginForm />
        {/* <RegisterForm /> */}
      </div>
    </AuthLayout>
  )
}
