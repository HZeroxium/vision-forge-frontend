// src/components/flow/VideoPreviewStep.tsx
'use client'
import React, { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
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

  return (
    <Box display="flex" flexDirection="column" gap={2} alignItems="center">
      <Typography variant="h6">Video Generated</Typography>

      <Box position="relative" width="100%" textAlign="center">
        {isVideoLoading && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: 'translate(-50%, -50%)' }}
          >
            <LoadingIndicator isLoading={true} message="Loading video..." />
          </Box>
        )}

        <video
          controls
          width="600"
          src={videoUrl}
          onLoadedData={() => setIsVideoLoading(false)}
          style={{ opacity: isVideoLoading ? 0.3 : 1 }}
        />
      </Box>

      <Button variant="outlined" onClick={onReset}>
        Generate Another Video
      </Button>
    </Box>
  )
}

export default VideoPreviewStep
