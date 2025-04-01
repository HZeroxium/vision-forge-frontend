// src/components/flow/VideoPreviewStep.tsx
'use client'
import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Paper,
  Stack,
  CircularProgress,
} from '@mui/material'
import LoadingIndicator from '../common/LoadingIndicator'
import { JobProgress } from '@utils/sse'

interface VideoPreviewStepProps {
  videoUrl: string | null
  onReset: () => void
  jobProgress?: JobProgress | null
  isGenerating: boolean
}

const VideoPreviewStep: React.FC<VideoPreviewStepProps> = ({
  videoUrl,
  onReset,
  jobProgress,
  isGenerating,
}) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Format the progress percentage
  const progressPercent = jobProgress ? Math.round(jobProgress.progress) : 0

  // Determine if we're showing the progress or the final video
  const showProgress =
    isGenerating || (jobProgress && jobProgress.state !== 'completed')
  const showVideo = videoUrl && !showProgress

  // Progress status message based on job state
  const getStatusMessage = () => {
    if (!jobProgress) return 'Preparing to generate video...'

    switch (jobProgress.state) {
      case 'waiting':
        return 'Waiting in queue...'
      case 'active':
        if (progressPercent <= 10)
          return 'Validating script and preparing resources...'
        if (progressPercent <= 40) return 'Generating audio narration...'
        if (progressPercent <= 70) return 'Creating images from prompts...'
        return 'Assembling final video with motion effects...'
      case 'completed':
        return 'Video generation complete!'
      case 'failed':
        return `Failed: ${jobProgress.error || 'Unknown error'}`
      default:
        return 'Processing...'
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      alignItems="center"
      width="100%"
    >
      <Typography variant="h6">
        {showVideo ? 'Video Generated' : 'Generating Video'}
      </Typography>

      {/* Progress Display Section */}
      {showProgress && (
        <Paper
          elevation={1}
          sx={{
            p: 3,
            width: '100%',
            borderRadius: 2,
            bgcolor: 'background.paper',
            mb: 2,
          }}
        >
          <Stack spacing={2}>
            <Typography variant="body1" align="center">
              {getStatusMessage()}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{ height: 8, borderRadius: 4 }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {jobProgress?.state === 'active' && (
                <CircularProgress size={16} thickness={6} />
              )}
              <Typography variant="body2" color="text.secondary">
                {progressPercent}% complete
              </Typography>
            </Box>

            {jobProgress?.state === 'failed' && (
              <Button variant="outlined" color="error" onClick={onReset}>
                Try Again
              </Button>
            )}
          </Stack>
        </Paper>
      )}

      {/* Video Display Section */}
      {showVideo && (
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
            src={videoUrl || undefined}
            onLoadedData={() => setIsVideoLoading(false)}
            style={{
              opacity: isVideoLoading ? 0.3 : 1,
              maxWidth: '100%',
              margin: '0 auto',
            }}
          />
        </Box>
      )}

      {/* Only show reset button if video is complete or generation failed */}
      {(showVideo || jobProgress?.state === 'failed') && (
        <Button variant="outlined" onClick={onReset} sx={{ mt: 2 }}>
          {jobProgress?.state === 'failed'
            ? 'Try Again'
            : 'Generate Another Video'}
        </Button>
      )}
    </Box>
  )
}

export default VideoPreviewStep
