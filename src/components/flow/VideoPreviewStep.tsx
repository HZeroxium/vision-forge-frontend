// src/components/flow/VideoPreviewStep.tsx
'use client'
import React from 'react'
import { Box, Typography, Button } from '@mui/material'

interface VideoPreviewStepProps {
  videoUrl: string
  onReset: () => void
}

const VideoPreviewStep: React.FC<VideoPreviewStepProps> = ({
  videoUrl,
  onReset,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={2} alignItems="center">
      <Typography variant="h6">Video Generated</Typography>
      <video controls width="600" src={videoUrl} />
      <Button variant="outlined" onClick={onReset}>
        Generate Another Video
      </Button>
    </Box>
  )
}

export default VideoPreviewStep
