// src/components/media/AudioCard.tsx
import React, { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  DeleteOutline,
  FavoriteBorder,
  Favorite,
  MusicNote,
  AccessTime,
  CalendarToday,
} from '@mui/icons-material'
import type { Audio } from '@services/audiosService'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/animations'

interface AudioCardProps {
  audio: Audio
  index: number
  onDelete?: (id: string) => void
  compact?: boolean
}

const MotionCard = motion(Card)
const MotionBox = motion(Box)
const MotionIconButton = motion(IconButton)

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
  const theme = useTheme()

  const audioColors = [
    `linear-gradient(135deg, ${alpha('#6366F1', 0.9)} 0%, ${alpha('#4F46E5', 0.85)} 100%)`,
    `linear-gradient(135deg, ${alpha('#F43F5E', 0.9)} 0%, ${alpha('#E11D48', 0.85)} 100%)`,
    `linear-gradient(135deg, ${alpha('#10B981', 0.9)} 0%, ${alpha('#059669', 0.85)} 100%)`,
    `linear-gradient(135deg, ${alpha('#F59E0B', 0.9)} 0%, ${alpha('#D97706', 0.85)} 100%)`,
    `linear-gradient(135deg, ${alpha('#8B5CF6', 0.9)} 0%, ${alpha('#7C3AED', 0.85)} 100%)`,
    `linear-gradient(135deg, ${alpha('#EC4899', 0.9)} 0%, ${alpha('#DB2777', 0.85)} 100%)`,
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
        transition={{ delay: index * 0.05 }}
        whileHover={{
          y: -6,
          boxShadow: `0 15px 30px ${alpha(theme.palette.common.black, 0.15)}`,
          transition: { duration: 0.3 },
        }}
        sx={{
          height: '100%',
          position: 'relative',
          borderRadius: compact ? 2.5 : 3,
          overflow: 'hidden',
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.07)}`,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box
          sx={{
            position: 'relative',
            height: compact ? '110px' : '150px',
            background: bgGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundSize: '200% 200%',
            animation: isPlaying
              ? 'gradient-animation 5s ease infinite'
              : 'none',
            '@keyframes gradient-animation': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          }}
        >
          <audio
            ref={audioRef}
            src={audio.url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnded}
          />

          {isPlaying && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 15,
                left: 0,
                right: 0,
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                gap: 0.5,
                padding: '0 20px',
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <MotionBox
                  key={i}
                  sx={{
                    width: '4px',
                    height: '10px',
                    backgroundColor: alpha('#fff', 0.7),
                    borderRadius: 4,
                  }}
                  animate={{
                    height: [
                      10,
                      Math.random() * 20 + 5,
                      Math.random() * 15 + 10,
                      10,
                    ],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </Box>
          )}

          <MotionBox
            initial={{ scale: 1 }}
            animate={{
              scale: isPlaying ? [1, 1.05, 1] : 1,
              transition: {
                duration: 2,
                repeat: isPlaying ? Infinity : 0,
                ease: 'easeInOut',
              },
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            sx={{
              width: compact ? 60 : 80,
              height: compact ? 60 : 80,
              borderRadius: '50%',
              bgcolor: alpha('#fff', 0.2),
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              boxShadow: isPlaying
                ? `0 0 20px ${alpha('#fff', 0.5)}, 0 0 30px ${alpha('#fff', 0.3)}`
                : `0 4px 15px ${alpha('#000', 0.2)}`,
              border: `1px solid ${alpha('#fff', 0.3)}`,
            }}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause sx={{ color: 'white', fontSize: compact ? 26 : 36 }} />
            ) : (
              <PlayArrow sx={{ color: 'white', fontSize: compact ? 26 : 36 }} />
            )}
          </MotionBox>

          <Box
            component={motion.div}
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{
              opacity: isPlaying ? [0.2, 0.4, 0.2] : 0.2,
              scale: isPlaying ? [0.8, 1.2, 0.8] : 0.8,
              transition: {
                duration: 3,
                repeat: isPlaying ? Infinity : 0,
                ease: 'easeInOut',
              },
            }}
            sx={{
              position: 'absolute',
              width: compact ? 100 : 150,
              height: compact ? 100 : 150,
              borderRadius: '50%',
              bgcolor: alpha('#fff', 0.15),
              zIndex: 1,
            }}
          />

          <Box
            component={motion.div}
            initial={{ opacity: 0.1, scale: 0.6 }}
            animate={{
              opacity: isPlaying ? [0.1, 0.25, 0.1] : 0.1,
              scale: isPlaying ? [0.6, 1.4, 0.6] : 0.6,
              transition: {
                duration: 4,
                repeat: isPlaying ? Infinity : 0,
                ease: 'easeInOut',
                delay: 0.5,
              },
            }}
            sx={{
              position: 'absolute',
              width: compact ? 120 : 180,
              height: compact ? 120 : 180,
              borderRadius: '50%',
              bgcolor: alpha('#fff', 0.1),
              zIndex: 1,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
            }}
          >
            <MotionIconButton
              size="small"
              onClick={toggleFavorite}
              sx={{
                bgcolor: alpha('#fff', 0.15),
                backdropFilter: 'blur(5px)',
                border: `1px solid ${alpha('#fff', 0.2)}`,
                '&:hover': { bgcolor: alpha('#fff', 0.25) },
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFavorite ? (
                <Favorite fontSize="small" sx={{ color: '#ff6b6b' }} />
              ) : (
                <FavoriteBorder fontSize="small" sx={{ color: 'white' }} />
              )}
            </MotionIconButton>
          </Box>

          {!isPlaying && !isHovered && (
            <MusicNote
              sx={{
                position: 'absolute',
                bottom: 12,
                fontSize: compact ? 18 : 22,
                color: alpha('#fff', 0.7),
              }}
            />
          )}

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
                bgcolor: alpha('#fff', 0.2),
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white',
                },
              }}
            />
          )}
        </Box>

        <CardContent
          sx={{
            pb: compact ? '8px !important' : '16px !important',
            px: 2.5,
            pt: 2,
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography
              variant={compact ? 'body2' : 'subtitle1'}
              fontWeight={500}
              noWrap
              sx={{
                color: theme.palette.text.primary,
                transition: 'color 0.3s ease',
              }}
            >
              {audio.provider || 'Unknown Provider'}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
                opacity: 0.7,
              }}
            >
              <AccessTime
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                component="span"
              >
                {formatDuration(audio.durationSeconds)}
              </Typography>

              <Box
                component="span"
                sx={{
                  mx: 0.5,
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  bgcolor: 'text.disabled',
                }}
              />

              <CalendarToday
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                component="span"
              >
                {new Date(audio.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Box>

          {!compact && audio.script && (
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
                  lineHeight: 1.4,
                  height: '2.8em',
                  fontSize: '0.8rem',
                  fontStyle: 'italic',
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  borderRadius: 1,
                  py: 0.5,
                  px: 1,
                  borderLeft: `3px solid ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                }}
              >
                {audio.script}
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
                sx={{
                  borderRadius: 1.5,
                  fontSize: '0.7rem',
                  height: 24,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  fontWeight: 500,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                }}
              />

              {onDelete && (
                <Tooltip title="Delete audio">
                  <MotionIconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      onDelete(audio.id)
                    }}
                    sx={{
                      p: 0.5,
                      bgcolor: alpha(theme.palette.error.main, 0.05),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                      },
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <DeleteOutline fontSize="small" />
                  </MotionIconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </CardContent>
      </MotionCard>
    </Link>
  )
}

export default AudioCard
