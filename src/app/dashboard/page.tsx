// src/app/dashboard/page.tsx
import React from 'react'
import DashboardLayout from '@layouts/DashboardLayout'
import VideoCard from '@components/dashboard/VideoCard'
import StatsChart from '@components/dashboard/StatsChart'

export default function DashboardPage() {
  // Placeholder data
  const videos = [
    { thumbnail: '/images/video1.jpg', title: 'Video 1', status: 'Published' },
    { thumbnail: '/images/video2.jpg', title: 'Video 2', status: 'Processing' },
  ]
  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr']
  const chartData = [100, 150, 200, 250]

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video, idx) => (
          <VideoCard
            key={idx}
            thumbnail={video.thumbnail}
            title={video.title}
            status={video.status}
          />
        ))}
      </div>
      <div className="mt-8">
        <StatsChart labels={chartLabels} data={chartData} />
      </div>
    </DashboardLayout>
  )
}
