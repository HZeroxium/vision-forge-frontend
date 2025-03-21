// src/app/auth/register/page.tsx
'use client'
import React from 'react'
import AuthLayout from '@layouts/AuthLayout'
import RegisterForm from '@components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}
