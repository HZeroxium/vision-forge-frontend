// src/components/flow/VideoPreviewStep.tsx
'use client'
import React, { useState } from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material'
import LoadingIndicator from '../common/LoadingIndicator'

interface VideoPreviewStepProps {
  videoUrl: string
  onReset: () => void
}

const VideoPreviewStep: React.FC<VideoPreviewStepProps> = ({
  videoUrl,
  onReset,
}) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      alignItems="center"
      width="100%"
    >
      <Typography variant="h6">Video Generated</Typography>

      <Box
        position="relative"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {isVideoLoading && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: 'translate(-50%, -50%)', zIndex: 1 }}
          >
            <LoadingIndicator isLoading={true} message="Loading video..." />
          </Box>
        )}

        <video
          controls
          width={isMobile ? '100%' : '600'}
          src={videoUrl}
          onLoadedData={() => setIsVideoLoading(false)}
          style={{
            opacity: isVideoLoading ? 0.3 : 1,
            maxWidth: '100%',
            margin: '0 auto', // Đảm bảo video luôn căn giữa
          }}
        />
      </Box>

      <Button variant="outlined" onClick={onReset}>
        Generate Another Video
      </Button>
    </Box>
  )
}

export default VideoPreviewStep
