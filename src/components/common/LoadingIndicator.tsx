import React, { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material'

interface LoadingIndicatorProps {
  isLoading: boolean
  message?: string
  size?: number
  showAfterDelay?: number // ms
  fallback?: React.ReactNode
  fullScreen?: boolean
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading,
  message,
  size = 40,
  showAfterDelay = 300, // Only show after 300ms to prevent flashing
  fallback = null,
  fullScreen = false,
}) => {
  const [showLoading, setShowLoading] = useState(false)
  const [loadingFailed, setLoadingFailed] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    let failTimeout: NodeJS.Timeout | null = null

    if (isLoading) {
      // Chỉ hiển thị spinner sau một delay
      timeoutId = setTimeout(() => {
        setShowLoading(true)
      }, showAfterDelay)

      // Nếu loading quá lâu, hiển thị fallback
      failTimeout = setTimeout(() => {
        setLoadingFailed(true)
      }, 10000) // 10 giây
    } else {
      setShowLoading(false)
      setLoadingFailed(false)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (failTimeout) clearTimeout(failTimeout)
    }
  }, [isLoading, showAfterDelay])

  if (!isLoading || !showLoading) {
    return null
  }

  if (loadingFailed && fallback) {
    return <>{fallback}</>
  }

  const loadingContent = (
    <>
      <CircularProgress
        size={size}
        sx={{
          '&.MuiCircularProgress-root': {
            animation: 'animation-61bdi0 1.4s ease-in-out infinite',
          },
        }}
      />
      {message && (
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          {message}
        </Typography>
      )}
    </>
  )

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {loadingContent}
        </Box>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      {loadingContent}
    </Box>
  )
}

export default LoadingIndicator
