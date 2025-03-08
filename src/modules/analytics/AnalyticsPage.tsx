// src/modules/analytics/AnalyticsPage.tsx
import React from 'react'
import DashboardLayout from '@layouts/DashboardLayout'
import StatsChart from '@components/dashboard/StatsChart'
import { useQuery } from '@tanstack/react-query'
import { fetchAnalyticsData } from './analyticsAPI'

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
  })

  if (isLoading) return <div>Loading analytics...</div>
  if (error) return <div>Error loading analytics.</div>

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
        <StatsChart labels={data.labels} data={data.values} />
      </div>
    </DashboardLayout>
  )
}
