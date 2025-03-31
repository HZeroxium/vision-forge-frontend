// src/components/video/VideoPreview.tsx
import React from 'react'
import { Box, useTheme, useMediaQuery } from '@mui/material'

interface VideoPreviewProps {
  videoUrl?: string
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (!videoUrl) return null

  return (
    <Box
      sx={{
        mt: 2,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <video
        width={isMobile ? '100%' : '600'}
        height="auto"
        controls
        style={{
          maxWidth: '100%',
          margin: '0 auto',
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  )
}

export default VideoPreview
