// src/app/auth/register.tsx
import React from 'react'
import AuthLayout from '@layouts/AuthLayout'
import RegisterForm from '@components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        <RegisterForm />
      </div>
    </AuthLayout>
  )
}
