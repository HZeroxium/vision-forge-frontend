// src/app/auth/change-password/page.tsx
'use client'
import React from 'react'
import AuthLayout from '@layouts/AuthLayout'
import ChangePasswordForm from '@components/auth/ChangePasswordForm'

export default function ChangePasswordPage() {
  return (
    <AuthLayout>
      <ChangePasswordForm />
    </AuthLayout>
  )
}
