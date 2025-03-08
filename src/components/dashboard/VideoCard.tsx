// src/components/dashboard/VideoCard.tsx
import Image from 'next/image'
import React from 'react'

interface VideoCardProps {
  thumbnail: string
  title: string
  status: string
}

const VideoCard: React.FC<VideoCardProps> = ({ thumbnail, title, status }) => {
  return (
    <div className="border rounded shadow p-4">
      <Image
        src={thumbnail}
        alt={title}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="mt-2 text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{status}</p>
    </div>
  )
}

export default VideoCard
