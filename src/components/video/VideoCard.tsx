'use client'
import React, { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  IconButton,
  Chip,
  Tooltip,
  LinearProgress,
  Menu,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  VolumeOff,
  VolumeUp,
  DeleteOutline,
  BookmarkBorder,
  Bookmark,
  MoreVert,
  CheckCircle,
  WarningAmber,
  PendingOutlined,
  ErrorOutlined,
  ContentCopy,
  Info,
  Share,
  Download,
  Link as LinkIcon,
  Check,
} from '@mui/icons-material'
import type { Video } from '@services/videoService'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn, cardHover } from '@/utils/animations'

interface VideoCardProps {
  video: Video
  index: number
  onDelete?: (id: string) => void
  layout?: 'grid' | 'list'
}

const MotionCard = motion(Card)
const MotionBox = motion(Box)

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onDelete,
  layout = 'grid',
  index = 0,
}) => {
  const theme = useTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [copied, setCopied] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const isListView = layout === 'list'

  // Get color based on status
  const getStatusColor = () => {
    switch (video.status.toLowerCase()) {
      case 'completed':
        return 'success'
      case 'processing':
        return 'warning'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusIcon = () => {
    switch (video.status.toLowerCase()) {
      case 'completed':
        return <CheckCircle fontSize="small" />
      case 'processing':
        return <PendingOutlined fontSize="small" />
      case 'failed':
        return <ErrorOutlined fontSize="small" />
      default:
        return <WarningAmber fontSize="small" />
    }
  }

  // Format dates in a readable way
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format time for video progress
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Handle video play/pause
  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Handle video mute/unmute
  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Handle bookmark toggle
  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    // Here you'd typically save this to a database or localStorage
  }

  // Copy video ID to clipboard
  const handleCopyId = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(video.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    handleMenuClose()
  }

  // Open more options menu
  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }

  // Close more options menu
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Handle share video
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (navigator.share) {
      navigator
        .share({
          title: `Video: ${video.id}`,
          text: 'Check out this AI-generated video',
          url: window.location.href,
        })
        .catch((err) => console.error('Error sharing:', err))
    } else {
      handleCopyId(e)
    }

    handleMenuClose()
  }

  // Handle download video
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const link = document.createElement('a')
    link.href = video.url
    link.download = `vision-forge-video-${video.id}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    handleMenuClose()
  }

  // Video time update handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const currentTime = videoRef.current.currentTime
    const duration = videoRef.current.duration
    setCurrentTime(currentTime)
    setProgress((currentTime / duration) * 100)
  }

  // Video metadata loaded handler
  const handleMetadataLoaded = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }

  // Video ended handler
  const handleVideoEnded = () => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  // Pause video when scrolled out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && isPlaying && videoRef.current) {
            videoRef.current.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [isPlaying])

  // Pause on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  // Animated elements for grid view
  const gridViewContent = (
    <MotionCard
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      {...cardHover}
      ref={cardRef}
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-base-100"
    >
      {/* Video Thumbnail and Player */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: 200,
          backgroundColor: 'black',
        }}
      >
        <CardMedia
          component="video"
          ref={videoRef}
          src={video.url}
          poster={video.thumbnailUrl || '/images/logo.webp'}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleMetadataLoaded}
          onEnded={handleVideoEnded}
          muted={isMuted}
          sx={{
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Video Controls Overlay */}
        <AnimatePresence>
          {isHovered && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 1,
                zIndex: 2,
              }}
            >
              {/* Top controls */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip
                  icon={getStatusIcon()}
                  label={video.status}
                  size="small"
                  color={getStatusColor()}
                  sx={{ borderRadius: 1, height: 24 }}
                />

                <Box>
                  <Tooltip
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark video'}
                  >
                    <IconButton
                      size="small"
                      onClick={toggleBookmark}
                      sx={{
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
                        mr: 0.5,
                      }}
                    >
                      {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="More options">
                    <IconButton
                      size="small"
                      onClick={handleMenuOpen}
                      sx={{
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Center play button */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <MotionBox
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.secondary.main, 0.9),
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  {isPlaying ? (
                    <Pause sx={{ color: 'white' }} />
                  ) : (
                    <PlayArrow sx={{ color: 'white' }} />
                  )}
                </MotionBox>
              </Box>

              {/* Bottom controls */}
              <Box>
                {/* Progress bar */}
                {isPlaying && (
                  <Box sx={{ mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.secondary.main,
                        },
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 0.5,
                        fontSize: '0.75rem',
                        color: 'white',
                      }}
                    >
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                    <IconButton
                      size="small"
                      onClick={toggleMute}
                      sx={{ color: 'white' }}
                    >
                      {isMuted ? (
                        <VolumeOff fontSize="small" />
                      ) : (
                        <VolumeUp fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Typography variant="caption" sx={{ color: 'white' }}>
                    {formatDate(video.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Permanent progress bar (when playing but not hovered) */}
        {isPlaying && !isHovered && (
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.secondary.main,
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* Card Content */}
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            component="div"
            noWrap
            sx={{
              fontWeight: 'medium',
              fontSize: '0.9rem',
              width: onDelete ? '80%' : '100%',
            }}
          >
            {video.id}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Chip
            label={`${Math.round(duration)}s`}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 1,
              height: 20,
              fontSize: '0.7rem',
              backgroundColor: alpha(theme.palette.secondary.light, 0.1),
              borderColor: alpha(theme.palette.secondary.light, 0.3),
            }}
          />

          {onDelete && (
            <Tooltip title="Delete video">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  onDelete(video.id)
                }}
                sx={{ p: 0.5 }}
              >
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, minWidth: 180 },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleCopyId}>
          {copied ? (
            <Check fontSize="small" sx={{ mr: 1 }} />
          ) : (
            <ContentCopy fontSize="small" sx={{ mr: 1 }} />
          )}
          {copied ? 'Copied!' : 'Copy ID'}
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <Share fontSize="small" sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <Download fontSize="small" sx={{ mr: 1 }} />
          Download
        </MenuItem>
        <MenuItem
          component={Link}
          href={`/media/videos/${video.id}`}
          onClick={handleMenuClose}
        >
          <Info fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {onDelete && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onDelete(video.id)
              handleMenuClose()
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteOutline fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </MotionCard>
  )

  // Animated elements for list view
  const listViewContent = (
    <MotionCard
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.08 }}
      ref={cardRef}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-base-100"
    >
      {/* Video Thumbnail/Player (Left Side) */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', sm: 200 },
          height: { xs: 120, sm: '100%' },
          backgroundColor: 'black',
          flexShrink: 0,
        }}
      >
        <CardMedia
          component="video"
          ref={videoRef}
          src={video.url}
          poster={video.thumbnailUrl || '/images/logo.webp'}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleMetadataLoaded}
          onEnded={handleVideoEnded}
          muted={isMuted}
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Video Controls Overlay */}
        <AnimatePresence>
          {isHovered && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 1,
                zIndex: 2,
              }}
            >
              {/* Play/Pause Button */}
              <MotionBox
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.secondary.main, 0.9),
                  cursor: 'pointer',
                  mb: 1,
                }}
              >
                {isPlaying ? (
                  <Pause sx={{ color: 'white', fontSize: 20 }} />
                ) : (
                  <PlayArrow sx={{ color: 'white', fontSize: 20 }} />
                )}
              </MotionBox>

              {/* Controls Row */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                  <IconButton
                    size="small"
                    onClick={toggleMute}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      p: 0.5,
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
                    }}
                  >
                    {isMuted ? (
                      <VolumeOff fontSize="small" />
                    ) : (
                      <VolumeUp fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
                  <IconButton
                    size="small"
                    onClick={toggleBookmark}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      p: 0.5,
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
                    }}
                  >
                    {isBookmarked ? (
                      <Bookmark fontSize="small" />
                    ) : (
                      <BookmarkBorder fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Progress bar when playing */}
        {isPlaying && (
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.secondary.main,
                },
              }}
            />
          </Box>
        )}

        {/* Status chip (always visible in list view) */}
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <Chip
            icon={getStatusIcon()}
            label={video.status}
            size="small"
            color={getStatusColor()}
            sx={{
              borderRadius: 1,
              height: 24,
              fontSize: '0.7rem',
              backgroundColor: alpha(
                theme.palette[getStatusColor()].main,
                0.85
              ),
              '& .MuiChip-label': {
                px: 1,
                color: 'white',
              },
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
        </Box>
      </Box>

      {/* Content (Right Side) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: 'medium', mb: 0.5 }}
            >
              Video ID: {video.id}
            </Typography>

            <Tooltip title="More options">
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ ml: 1, p: 0.5 }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Created: {formatDate(video.createdAt)}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${Math.round(duration)}s`}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 1,
                height: 20,
                fontSize: '0.7rem',
                backgroundColor: alpha(theme.palette.secondary.light, 0.1),
                borderColor: alpha(theme.palette.secondary.light, 0.3),
              }}
            />

            {isPlaying && (
              <Typography variant="caption" color="text.secondary">
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Action buttons for list view */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: { xs: 1, sm: 0 },
          }}
        >
          {onDelete && (
            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteOutline />}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onDelete(video.id)
              }}
              sx={{
                mr: 1,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Delete
            </Button>
          )}

          <Button
            size="small"
            variant="contained"
            color="secondary"
            component={Link}
            href={`/media/videos/${video.id}`}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, minWidth: 180 },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleCopyId}>
          {copied ? (
            <Check fontSize="small" sx={{ mr: 1 }} />
          ) : (
            <ContentCopy fontSize="small" sx={{ mr: 1 }} />
          )}
          {copied ? 'Copied!' : 'Copy ID'}
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <Share fontSize="small" sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <Download fontSize="small" sx={{ mr: 1 }} />
          Download
        </MenuItem>
        <MenuItem
          component={Link}
          href={`/media/videos/${video.id}`}
          onClick={handleMenuClose}
        >
          <Info fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {onDelete && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onDelete(video.id)
              handleMenuClose()
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteOutline fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </MotionCard>
  )

  return (
    <Link
      href={`/media/videos/${video.id}`}
      style={{
        textDecoration: 'none',
        height: '100%',
        display: 'block',
      }}
      onClick={(e) => isPlaying && e.preventDefault()}
    >
      {isListView ? listViewContent : gridViewContent}
    </Link>
  )
}

export default VideoCard
