// app/flow/layout.tsx

import DashboardLayout from '@/layouts/DashboardLayout'

export default function FlowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
