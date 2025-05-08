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
  LinearProgress,
  Slider,
  alpha,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowBack,
  ContentCopy,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Favorite,
  FavoriteBorder,
  Download,
  Share,
  VolumeMute,
  RestartAlt,
  ForwardRounded,
  ReplayRounded,
  Check,
  Audiotrack,
  Schedule,
  Info,
  Delete,
} from '@mui/icons-material'
import { fetchAudio, deleteAudio } from '@services/audiosService'
import type { Audio } from '@services/audiosService'
import { slideInFromRight, fadeIn } from '@/utils/animations'
import { useAuth } from '@/hooks/useAuth'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)
const MotionTypography = motion(Typography)
const MotionButton = motion(Button)
const MotionIconButton = motion(IconButton)

export default function AudioDetailPage() {
  const { id } = useParams() // Get audio id from the URL
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useAuth()

  const [audio, setAudio] = useState<Audio | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  // Audio player states
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [barData, setBarData] = useState<number[]>([])

  // Check if current user owns this audio
  const isOwner = user && audio && user.id === audio.userId

  // Animation frequency bar data
  const generateBarData = () => {
    if (!isPlaying) {
      return Array(30).fill(5)
    }
    return Array(30)
      .fill(0)
      .map(() => Math.random() * 40 + 5)
  }

  // Update visualization bars
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setBarData(generateBarData())
      }, 100)
    } else {
      setBarData(Array(30).fill(5))
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    // Fetch audio details using the provided id
    fetchAudio(Array.isArray(id) ? id[0] : id)
      .then((data) => {
        setAudio(data)
        setError(null)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch audio detail')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // Handle audio player events
  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) return

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration)
    }

    const handleAudioEnd = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      audioElement.currentTime = 0
    }

    audioElement.addEventListener('timeupdate', handleTimeUpdate)
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioElement.addEventListener('ended', handleAudioEnd)

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate)
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audioElement.removeEventListener('ended', handleAudioEnd)
    }
  }, [audio])

  // Navigate back to the audios list page
  const handleBack = () => {
    router.push('/media/audios')
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Here you'd typically save this to a database or localStorage
  }

  const handleCopyScript = () => {
    if (audio?.script) {
      navigator.clipboard.writeText(audio.script)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (!audioRef.current) return
    const value = newValue as number
    audioRef.current.currentTime = value
    setCurrentTime(value)
  }

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    if (!audioRef.current) return
    const value = newValue as number
    setVolume(value)
    audioRef.current.volume = value
    if (value === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const handleForward = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.min(
      audioRef.current.duration,
      currentTime + 10
    )
  }

  const handleRewind = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, currentTime - 10)
  }

  const handleRestart = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    setCurrentTime(0)
    if (!isPlaying) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleDownload = () => {
    if (audio?.url) {
      const link = document.createElement('a')
      link.href = audio.url
      link.download = `vision-forge-audio-${audio.id}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = () => {
    if (navigator.share && audio) {
      navigator
        .share({
          title: `AI Audio: ${audio.provider}`,
          text: `Check out this AI-generated audio: ${audio.script || 'No script available'}`,
          url: window.location.href,
        })
        .catch((err) => console.error('Error sharing:', err))
    } else {
      // Fallback for browsers that don't support navigator.share
      handleCopyScript()
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
        <CircularProgress color="primary" />
        <MotionTypography
          variant="body1"
          sx={{ mt: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading audio...
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
              Back to Audio Library
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
            color="primary"
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
            Back to Audio Library
          </MotionButton>

          <MotionTypography
            variant="h5"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
            }}
            variants={slideInFromRight}
          >
            Audio Detail
          </MotionTypography>
        </MotionBox>

        {audio && (
          <Grid container spacing={3}>
            {/* Main Player Section */}
            <Grid size={{ xs: 12, md: 8 }}>
              <MotionPaper
                variants={fadeIn}
                elevation={2}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  mb: { xs: 2, md: 0 },
                  p: 0,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.6)} 100%)`,
                }}
              >
                {/* Hidden HTML audio element */}
                <audio ref={audioRef} src={audio.url} preload="metadata" />

                {/* Visualization Section */}
                <Box
                  sx={{
                    p: 3,
                    pt: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200,
                    position: 'relative',
                  }}
                >
                  {/* Provider badge */}
                  <Chip
                    label={audio.provider}
                    color="primary"
                    variant="filled"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.common.white, 0.2),
                      backdropFilter: 'blur(4px)',
                      '& .MuiChip-label': {
                        fontWeight: 'bold',
                        color: 'white',
                      },
                    }}
                  />

                  {/* Favorite button */}
                  <MotionIconButton
                    color={isFavorite ? 'error' : 'default'}
                    onClick={handleToggleFavorite}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: alpha(theme.palette.common.white, 0.2),
                      backdropFilter: 'blur(4px)',
                      color: isFavorite ? '#ff6b6b' : 'white',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.3),
                      },
                    }}
                  >
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                  </MotionIconButton>

                  {/* Audio waveform visualization */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 150,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                    }}
                  >
                    {barData.map((height, index) => (
                      <MotionBox
                        key={index}
                        animate={{ height }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                        sx={{
                          width: `${(100 / barData.length) * 0.6}%`,
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.8
                          ),
                          borderRadius: 1,
                          minWidth: 3,
                          maxWidth: 6,
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Play Controls Section */}
                <MotionBox
                  sx={{
                    p: 3,
                    pt: 0,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Progress slider */}
                  <Box sx={{ mb: 2 }}>
                    <Slider
                      value={currentTime}
                      max={duration || 100}
                      onChange={handleSliderChange}
                      aria-labelledby="audio-progress-slider"
                      sx={{
                        height: 4,
                        color: 'white',
                        '& .MuiSlider-thumb': {
                          width: 12,
                          height: 12,
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.common.white, 0.16)}`,
                          },
                        },
                        '& .MuiSlider-rail': {
                          opacity: 0.3,
                        },
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'white',
                      }}
                    >
                      <Typography variant="caption">
                        {formatTime(currentTime)}
                      </Typography>
                      <Typography variant="caption">
                        {formatTime(duration)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Playback controls */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: { xs: 1, sm: 2 },
                      mb: 2,
                    }}
                  >
                    <MotionIconButton
                      onClick={handleRestart}
                      color="inherit"
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ color: 'white' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <RestartAlt />
                    </MotionIconButton>

                    <MotionIconButton
                      onClick={handleRewind}
                      color="inherit"
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ color: 'white' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ReplayRounded />
                    </MotionIconButton>

                    <MotionBox
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        width: isMobile ? 48 : 56,
                        height: isMobile ? 48 : 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      }}
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: isMobile ? 24 : 30,
                          }}
                        />
                      ) : (
                        <PlayArrow
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: isMobile ? 24 : 30,
                          }}
                        />
                      )}
                    </MotionBox>

                    <MotionIconButton
                      onClick={handleForward}
                      color="inherit"
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ color: 'white' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ForwardRounded />
                    </MotionIconButton>

                    <MotionIconButton
                      onClick={toggleMute}
                      color="inherit"
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ color: 'white' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isMuted ? <VolumeMute /> : <VolumeUp />}
                    </MotionIconButton>
                  </Box>

                  {/* Volume slider */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      px: 2,
                    }}
                  >
                    <VolumeOff
                      sx={{ color: 'white', opacity: 0.7, fontSize: 16 }}
                    />
                    <Slider
                      value={isMuted ? 0 : volume}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={handleVolumeChange}
                      aria-labelledby="volume-slider"
                      sx={{
                        width: '100%',
                        height: 4,
                        color: 'white',
                        '& .MuiSlider-thumb': {
                          width: 12,
                          height: 12,
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.common.white, 0.16)}`,
                          },
                        },
                        '& .MuiSlider-rail': {
                          opacity: 0.3,
                        },
                      }}
                    />
                    <VolumeUp
                      sx={{ color: 'white', opacity: 0.7, fontSize: 16 }}
                    />
                  </Box>
                </MotionBox>
              </MotionPaper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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
                    Audio Information
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Info fontSize="small" /> Details
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Provider:</strong>{' '}
                    {audio.provider || 'Unknown Provider'}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Duration:</strong>{' '}
                    {formatTime(audio.durationSeconds)}
                  </Typography>
                </Box>

                {audio.script && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Audiotrack fontSize="small" /> Script
                    </Typography>
                    <Typography
                      variant="body2"
                      paragraph
                      sx={{
                        p: 2,
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.05
                        ),
                        borderRadius: 1,
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        fontStyle: 'italic',
                      }}
                    >
                      "{audio.script}"
                    </Typography>
                    <MotionButton
                      variant="outlined"
                      size="small"
                      startIcon={copied ? <Check /> : <ContentCopy />}
                      onClick={handleCopyScript}
                      sx={{ mb: 2, borderRadius: 2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copied ? 'Copied!' : 'Copy Script'}
                    </MotionButton>
                  </Box>
                )}

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Schedule fontSize="small" /> Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(audio.createdAt)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <MotionButton
                    variant="contained"
                    color="primary"
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
                    color="primary"
                    onClick={handleShare}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    sx={{ bgcolor: 'action.hover' }}
                  >
                    <Share />
                  </MotionIconButton>

                  {isOwner && (
                    <MotionIconButton
                      color="error"
                      onClick={async () => {
                        if (
                          confirm('Are you sure you want to delete this audio?')
                        ) {
                          try {
                            await deleteAudio(audio.id)
                            router.push('/media/audios')
                          } catch (error) {
                            console.error('Failed to delete audio:', error)
                          }
                        }
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      sx={{ bgcolor: 'action.hover' }}
                    >
                      <Delete />
                    </MotionIconButton>
                  )}
                </Box>
              </MotionPaper>
            </Grid>
          </Grid>
        )}
      </MotionBox>
    </Container>
  )
}
