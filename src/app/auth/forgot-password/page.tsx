// src/app/auth/forgot-password/page.tsx
'use client'
import React from 'react'
import AuthLayout from '@layouts/AuthLayout'
import ForgotPasswordForm from '@components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
