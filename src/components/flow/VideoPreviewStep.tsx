// src/components/flow/VideoPreviewStep.tsx
'use client'
import React, { useState, useEffect } from 'react'
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
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

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
  const [videoError, setVideoError] = useState<string | null>(null)
  const [videoLoadAttempts, setVideoLoadAttempts] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Determine if we're showing the progress or the final video
  const showProgress =
    isGenerating || (jobProgress && jobProgress.state !== 'completed')
  const showVideo = videoUrl && !showProgress

  // Reset video error when video URL changes
  useEffect(() => {
    if (videoUrl) {
      setVideoError(null)
      setIsVideoLoading(true)
      setVideoLoadAttempts(0)
    }
  }, [videoUrl])

  // Retry loading video if we have a URL but encountered an error
  useEffect(() => {
    if (videoError && videoUrl && videoLoadAttempts < 3) {
      const timer = setTimeout(() => {
        console.log(`Retrying video load (attempt ${videoLoadAttempts + 1})`)
        setIsVideoLoading(true)
        setVideoError(null)
        setVideoLoadAttempts((prev) => prev + 1)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [videoError, videoUrl, videoLoadAttempts])

  const handleVideoError = () => {
    console.error('Video loading failed')
    setVideoError('Failed to load the video. Please try again.')
    setIsVideoLoading(false)
  }

  // Animation variants for the loading bubbles
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1, 1, 1, 0],
      opacity: [0, 1, 1, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
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

      {/* Progress Display Section - Simplified with animation */}
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
          <Stack spacing={2} alignItems="center">
            {/* Loading Animation */}
            <MotionBox
              variants={containerVariants}
              initial="initial"
              animate="animate"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                my: 2,
                height: 60,
                alignItems: 'center',
              }}
            >
              {[...Array(5)].map((_, i) => (
                <MotionBox
                  key={i}
                  variants={bubbleVariants}
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.secondary.main,
                  }}
                />
              ))}
            </MotionBox>

            {/* Indeterminate progress bar */}
            <LinearProgress
              variant={
                jobProgress?.state === 'active'
                  ? 'determinate'
                  : 'indeterminate'
              }
              value={jobProgress?.progress || 0}
              sx={{
                height: 8,
                width: '100%',
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  transition: 'transform 0.5s ease',
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                fontWeight="medium"
              >
                {jobProgress?.state === 'waiting'
                  ? 'Waiting in queue...'
                  : jobProgress?.state === 'failed'
                    ? 'Generation failed'
                    : 'Creating your video...'}
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

      {/* Error Message */}
      {videoError && (
        <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
          {videoError}
        </Typography>
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
            onLoadedData={() => {
              console.log('Video loaded successfully')
              setIsVideoLoading(false)
            }}
            onError={handleVideoError}
            style={{
              opacity: isVideoLoading ? 0.3 : 1,
              maxWidth: '100%',
              margin: '0 auto',
            }}
          />
        </Box>
      )}

      {/* Completed state but no video yet */}
      {jobProgress?.state === 'completed' && !videoUrl && !showProgress && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <MotionBox
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: `3px solid ${theme.palette.secondary.main}`,
              borderTop: `3px solid ${theme.palette.primary.main}`,
              margin: '0 auto',
            }}
          />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Video generated! Retrieving video file...
          </Typography>
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
