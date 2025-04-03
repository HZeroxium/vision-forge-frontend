'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  useTheme,
  useMediaQuery,
  Chip,
  alpha,
  Stack,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowBack,
  PlayCircle,
  VolumeUp,
  VolumeMute,
  Fullscreen,
  FullscreenExit,
  ClosedCaption,
  ClosedCaptionDisabled,
  Download,
  Share,
  Bookmark,
  BookmarkBorder,
  ContentCopy,
  Check,
  MovieCreation,
  Info,
  Schedule,
  HighQuality,
  Settings,
} from '@mui/icons-material'
import { fetchVideo } from '@services/videoService'
import type { Video } from '@services/videoService'
import { slideInFromRight, fadeIn } from '@/utils/animations'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)
const MotionTypography = motion(Typography)
const MotionButton = motion(Button)
const MotionIconButton = motion(IconButton)

export default function VideoDetailPage() {
  const { id } = useParams() // Get video ID from the URL
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  // Video player states
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCaptions, setShowCaptions] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    // Fetch video details using the provided id
    fetchVideo(Array.isArray(id) ? id[0] : id)
      .then((data) => {
        setVideo(data)
        setError(null)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch video detail')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // Handle video player events
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime)
      setProgress((videoElement.currentTime / videoElement.duration) * 100)
    }

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration)
      setVideoLoaded(true)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleVideoError = () => {
      setVideoError('Error loading video. Please try again.')
    }

    videoElement.addEventListener('timeupdate', handleTimeUpdate)
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoElement.addEventListener('ended', handleEnded)
    videoElement.addEventListener('error', handleVideoError)

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate)
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoElement.removeEventListener('ended', handleEnded)
      videoElement.removeEventListener('error', handleVideoError)
    }
  }, [video])

  // Toggle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    const playerContainer = playerContainerRef.current
    if (playerContainer) {
      playerContainer.addEventListener('mousemove', handleMouseMove)
      playerContainer.addEventListener('mouseenter', handleMouseMove)
      playerContainer.addEventListener('mouseleave', () => {
        if (isPlaying) {
          setShowControls(false)
        }
      })
    }

    return () => {
      clearTimeout(timeout)
      if (playerContainer) {
        playerContainer.removeEventListener('mousemove', handleMouseMove)
        playerContainer.removeEventListener('mouseenter', handleMouseMove)
        playerContainer.removeEventListener('mouseleave', () => {})
      }
    }
  }, [isPlaying])

  // Navigate back to the gallery page
  const handleBack = () => {
    router.push('/media/videos')
  }

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    setIsMuted(!isMuted)
    videoRef.current.muted = !isMuted
  }

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const toggleCaptions = () => {
    setShowCaptions(!showCaptions)
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Here you'd typically save this to a database or localStorage
  }

  const handleCopyVideoId = () => {
    if (video?.id) {
      navigator.clipboard.writeText(video.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (video?.url) {
      const link = document.createElement('a')
      link.href = video.url
      link.download = `vision-forge-video-${video.id}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = () => {
    if (navigator.share && video) {
      navigator
        .share({
          title: `Video: ${video.id}`,
          text: `Check out this AI-generated video`,
          url: window.location.href,
        })
        .catch((err) => console.error('Error sharing:', err))
    } else {
      // Fallback for browsers that don't support navigator.share
      handleCopyVideoId()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <MotionBox
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="50vh"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <CircularProgress color="secondary" />
        <MotionTypography
          variant="body1"
          sx={{ mt: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading video...
        </MotionTypography>
      </MotionBox>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={2}
            sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <MotionButton
              variant="contained"
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Video Library
            </MotionButton>
          </Paper>
        </MotionBox>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <MotionBox
          variants={fadeIn}
          sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
        >
          <MotionButton
            variant="contained"
            color="secondary"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              mr: 2,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Video Library
          </MotionButton>

          <MotionTypography
            variant="h5"
            component="h1"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
            }}
            variants={slideInFromRight}
          >
            Video Detail
          </MotionTypography>
        </MotionBox>

        {video && (
          <Grid container spacing={3}>
            {/* Main Player Section */}
            <Grid size={{ xs: 12 }}>
              <MotionPaper
                variants={fadeIn}
                elevation={2}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  mb: { xs: 2, md: 0 },
                  backgroundColor: '#000',
                }}
              >
                {/* Video Player Container */}
                <Box
                  ref={playerContainerRef}
                  sx={{
                    position: 'relative',
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    cursor: showControls ? 'default' : 'none',
                  }}
                  onClick={togglePlay}
                >
                  {/* Video Element */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#000',
                    }}
                  >
                    <video
                      ref={videoRef}
                      src={video.url}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                      poster={video.thumbnailUrl}
                      preload="metadata"
                    />

                    {/* Loading Overlay */}
                    {!videoLoaded && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          zIndex: 2,
                        }}
                      >
                        <CircularProgress color="secondary" />
                      </Box>
                    )}

                    {/* Video Error Message */}
                    {videoError && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          zIndex: 2,
                          p: 3,
                        }}
                      >
                        <Typography variant="h6" color="error" gutterBottom>
                          {videoError}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            setVideoError(null)
                            if (videoRef.current) {
                              videoRef.current.load()
                            }
                          }}
                        >
                          Retry
                        </Button>
                      </Box>
                    )}

                    {/* Big Play Button (when paused) */}
                    {!isPlaying && videoLoaded && (
                      <MotionBox
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 2,
                          cursor: 'pointer',
                        }}
                        onClick={togglePlay}
                      >
                        <PlayCircle
                          sx={{
                            fontSize: 80,
                            color: 'rgba(255,255,255,0.9)',
                            filter: 'drop-shadow(0px 2px 5px rgba(0,0,0,0.3))',
                          }}
                        />
                      </MotionBox>
                    )}

                    {/* Video Controls Overlay */}
                    <AnimatePresence>
                      {showControls && videoLoaded && (
                        <MotionBox
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background:
                              'linear-gradient(transparent, rgba(0,0,0,0.8))',
                            color: 'white',
                            padding: 2,
                            zIndex: 1,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Progress Bar */}
                          <Box sx={{ width: '100%', mb: 1 }}>
                            <Box
                              sx={{
                                height: 4,
                                width: '100%',
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                borderRadius: 1,
                                position: 'relative',
                                cursor: 'pointer',
                              }}
                              onClick={(e) => {
                                if (!videoRef.current) return
                                const rect =
                                  e.currentTarget.getBoundingClientRect()
                                const pos = (e.clientX - rect.left) / rect.width
                                videoRef.current.currentTime = pos * duration
                              }}
                            >
                              <Box
                                sx={{
                                  height: '100%',
                                  width: `${progress}%`,
                                  backgroundColor: theme.palette.secondary.main,
                                  borderRadius: 1,
                                  position: 'relative',
                                }}
                              >
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    right: -6,
                                    top: -4,
                                    width: 12,
                                    height: 12,
                                    backgroundColor:
                                      theme.palette.secondary.main,
                                    borderRadius: '50%',
                                    boxShadow: '0 0 0 2px rgba(0,0,0,0.3)',
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>

                          {/* Controls Row */}
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={1}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <IconButton
                                onClick={togglePlay}
                                sx={{ color: 'white' }}
                                size="small"
                              >
                                {isPlaying ? (
                                  <motion.div whileTap={{ scale: 0.9 }}>
                                    <Box
                                      component="span"
                                      sx={{ display: 'flex' }}
                                    >
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                      >
                                        <rect
                                          x="6"
                                          y="4"
                                          width="4"
                                          height="16"
                                          fill="white"
                                        />
                                        <rect
                                          x="14"
                                          y="4"
                                          width="4"
                                          height="16"
                                          fill="white"
                                        />
                                      </svg>
                                    </Box>
                                  </motion.div>
                                ) : (
                                  <motion.div whileTap={{ scale: 0.9 }}>
                                    <PlayCircle />
                                  </motion.div>
                                )}
                              </IconButton>

                              <IconButton
                                onClick={toggleMute}
                                sx={{ color: 'white' }}
                                size="small"
                              >
                                {isMuted ? <VolumeMute /> : <VolumeUp />}
                              </IconButton>

                              <Typography variant="caption" sx={{ ml: 1 }}>
                                {formatTime(currentTime)} /{' '}
                                {formatTime(duration)}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <IconButton
                                onClick={toggleCaptions}
                                sx={{ color: 'white' }}
                                size="small"
                              >
                                {showCaptions ? (
                                  <ClosedCaption />
                                ) : (
                                  <ClosedCaptionDisabled />
                                )}
                              </IconButton>

                              <IconButton
                                onClick={toggleFullscreen}
                                sx={{ color: 'white' }}
                                size="small"
                              >
                                {isFullscreen ? (
                                  <FullscreenExit />
                                ) : (
                                  <Fullscreen />
                                )}
                              </IconButton>
                            </Box>
                          </Stack>
                        </MotionBox>
                      )}
                    </AnimatePresence>
                  </Box>
                </Box>
              </MotionPaper>
            </Grid>

            {/* Metadata Section */}
            <Grid size={{ xs: 12 }}>
              <MotionPaper
                variants={fadeIn}
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Video Details
                  </Typography>

                  <MotionIconButton
                    color={isBookmarked ? 'secondary' : 'default'}
                    onClick={toggleBookmark}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                  </MotionIconButton>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Info fontSize="small" /> Information
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Video ID:</strong> {video.id}
                    <IconButton
                      size="small"
                      onClick={handleCopyVideoId}
                      sx={{ ml: 1, p: 0.5 }}
                    >
                      {copied ? (
                        <Check fontSize="small" color="success" />
                      ) : (
                        <ContentCopy fontSize="small" />
                      )}
                    </IconButton>
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Status:</strong>{' '}
                    <Chip
                      label={video.status}
                      size="small"
                      color={
                        video.status === 'completed' ? 'success' : 'warning'
                      }
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <MovieCreation fontSize="small" /> Properties
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}
                  >
                    <Chip
                      icon={<HighQuality sx={{ fontSize: '1rem' }} />}
                      label="HD Quality"
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<Settings sx={{ fontSize: '1rem' }} />}
                      label="AI Generated"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Schedule fontSize="small" /> Timeline
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Created:</strong> {formatDate(video.createdAt)}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Updated:</strong> {formatDate(video.updatedAt)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <MotionButton
                    variant="contained"
                    color="secondary"
                    startIcon={<Download />}
                    fullWidth
                    onClick={handleDownload}
                    sx={{ borderRadius: 2 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Download
                  </MotionButton>

                  <MotionIconButton
                    color="secondary"
                    onClick={handleShare}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    sx={{ bgcolor: 'action.hover' }}
                  >
                    <Share />
                  </MotionIconButton>
                </Box>
              </MotionPaper>
            </Grid>
          </Grid>
        )}
      </MotionBox>
    </Container>
  )
}
