// app/media/layout.tsx

import DashboardLayout from '@/layouts/DashboardLayout'

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
