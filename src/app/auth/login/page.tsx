// src/app/auth/login/page.tsx
'use client'
import React from 'react'
import AuthLayout from '@layouts/AuthLayout'
import LoginForm from '@components/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
