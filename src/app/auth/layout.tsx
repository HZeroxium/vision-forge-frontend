// app/auth/layout.tsx

import AuthLayout from '@layouts/AuthLayout'

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
}
