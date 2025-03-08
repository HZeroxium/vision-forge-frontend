// src/components/video/VideoPreview.tsx
import React from 'react'

interface VideoPreviewProps {
  videoUrl: string
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl }) => {
  return (
    <div className="w-full h-64 bg-black">
      <video src={videoUrl} controls className="w-full h-full" />
    </div>
  )
}

export default VideoPreview
