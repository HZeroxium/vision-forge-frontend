// src/app/auth/reset-password/page.tsx
'use client'
import React from 'react'
import AuthLayout from '@layouts/AuthLayout'
import ResetPasswordForm from '@components/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  )
}
