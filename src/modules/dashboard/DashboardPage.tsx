// src/modules/dashboard/DashboardPage.tsx
import React from 'react'
import DashboardLayout from '@layouts/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { fetchDashboardData } from './dashboardAPI'
import VideoCard from '@components/dashboard/VideoCard'
import StatsChart from '@components/dashboard/StatsChart'
import { Video } from './dashboardSlice'

export default function DashboardModulePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  })

  if (isLoading) return <div>Loading dashboard...</div>
  if (error) return <div>Error loading dashboard.</div>

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.videos.map((video: Video, idx: number) => (
          <VideoCard
            key={idx}
            thumbnail={video.thumbnail}
            title={video.title}
            status={video.status}
          />
        ))}
      </div>
      <div className="mt-8">
        <StatsChart labels={data.chartLabels} data={data.chartData} />
      </div>
    </DashboardLayout>
  )
}
