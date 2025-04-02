// src/components/media/AudioCard.tsx
import React, { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Box,
  IconButton,
  Chip,
  Tooltip,
  LinearProgress,
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  VolumeUp,
  DeleteOutline,
  FavoriteBorder,
  Favorite,
  MoreVert,
} from '@mui/icons-material'
import type { Audio } from '@services/audiosService'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeIn, cardHover } from '@/utils/animations'

interface AudioCardProps {
  audio: Audio
  index: number
  onDelete?: (id: string) => void
  compact?: boolean
}

const MotionCard = motion(Card)

const AudioCard: React.FC<AudioCardProps> = ({
  audio,
  onDelete,
  index,
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const audioColors = [
    'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
    'linear-gradient(135deg, #FF6B6B 0%, #FF0000 100%)',
    'linear-gradient(135deg, #6BFFB8 0%, #00FFAA 100%)',
    'linear-gradient(135deg, #FFB86B 0%, #FFA500 100%)',
  ]

  const colorIndex = index % audioColors.length
  const bgGradient = audioColors[colorIndex]

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      setCurrentTime(progress)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <Link
      href={`/media/audios/${audio.id}`}
      className="no-underline"
      onClick={(e) => isPlaying && e.preventDefault()}
      style={{ height: '100%', display: 'block' }}
    >
      <MotionCard
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: index * 0.1 }}
        {...cardHover}
        sx={{
          height: '100%',
          position: 'relative',
          borderRadius: compact ? 2 : 3,
          bgcolor: 'background.paper',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-base-100"
      >
        <Box
          sx={{
            position: 'relative',
            height: compact ? '100px' : '140px',
            background: bgGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <audio
            ref={audioRef}
            src={audio.url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnded}
          />

          <Box
            component={motion.div}
            initial={{ scale: 1 }}
            animate={{
              scale: isPlaying ? [1, 1.1, 1] : 1,
              transition: {
                duration: 1.5,
                repeat: isPlaying ? Infinity : 0,
                ease: 'easeInOut',
              },
            }}
            sx={{
              width: compact ? 50 : 70,
              height: compact ? 50 : 70,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
            }}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause sx={{ color: 'white', fontSize: compact ? 24 : 32 }} />
            ) : (
              <PlayArrow sx={{ color: 'white', fontSize: compact ? 24 : 32 }} />
            )}
          </Box>

          {!compact && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isPlaying ? [0.3, 0.5, 0.3] : 0.3,
                scale: isPlaying ? [1, 1.2, 1] : 1,
                transition: {
                  duration: 2,
                  repeat: isPlaying ? Infinity : 0,
                  ease: 'easeInOut',
                },
              }}
              sx={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.1)',
                zIndex: 1,
              }}
            />
          )}

          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
            }}
          >
            <IconButton
              size="small"
              onClick={toggleFavorite}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFavorite ? (
                <Favorite fontSize="small" sx={{ color: '#ff6b6b' }} />
              ) : (
                <FavoriteBorder fontSize="small" sx={{ color: 'white' }} />
              )}
            </IconButton>
          </Box>

          {isPlaying && (
            <LinearProgress
              variant="determinate"
              value={currentTime}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white',
                },
              }}
            />
          )}
        </Box>

        <CardContent
          sx={{ pb: compact ? '8px !important' : '16px !important' }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography
              variant={compact ? 'body2' : 'subtitle1'}
              fontWeight="medium"
              noWrap
            >
              {audio.provider || 'Unknown Provider'}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              component="div"
            >
              {formatDuration(audio.durationSeconds)} •{' '}
              {new Date(audio.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          {!compact && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                  height: '2.6em',
                  fontSize: '0.8rem',
                }}
              >
                {audio.script || 'No script available'}
              </Typography>
            </Box>
          )}

          {!compact && (
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Chip
                label={audio.provider}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ borderRadius: 1, fontSize: '0.7rem', height: 24 }}
              />

              {onDelete && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    onDelete(audio.id)
                  }}
                  sx={{ p: 0.5 }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}
        </CardContent>
      </MotionCard>
    </Link>
  )
}

export default AudioCard
