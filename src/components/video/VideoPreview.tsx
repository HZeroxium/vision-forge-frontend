// src/components/video/VideoPreview.tsx
import React from 'react'
import { Box } from '@mui/material'

interface VideoPreviewProps {
  videoUrl?: string
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl }) => {
  if (!videoUrl) return null

  return (
    <Box sx={{ mt: 2 }}>
      <video width="100%" height="auto" controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  )
}

export default VideoPreview
