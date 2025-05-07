'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  IconButton,
  Avatar,
  Typography,
  useTheme,
  alpha,
} from '@mui/material'
import MovieCreationIcon from '@mui/icons-material/MovieCreation'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

// Create motion components
const MotionBox = motion.create(Box)
const MotionIconButton = motion.create(IconButton)
const MotionTypography = motion.create(Typography)

interface SidebarHeaderProps {
  open: boolean
  onToggle: () => void
  isMobile: boolean
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  open,
  onToggle,
  isMobile,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 2,
        justifyContent: open ? 'space-between' : 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Logo and Brand */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MotionBox
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar
            sx={{
              bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              width: 40,
              height: 40,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              border: `2px solid ${alpha(theme.palette.primary.light, 0.6)}`,
            }}
          >
            <MovieCreationIcon
              sx={{
                color: 'white',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
              }}
            />
          </Avatar>
        </MotionBox>

        <AnimatePresence>
          {open && (
            <MotionTypography
              variant="h6"
              sx={{
                ml: 2,
                fontWeight: 'bold',
                userSelect: 'none',
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              Vision Forge
            </MotionTypography>
          )}
        </AnimatePresence>
      </Box>

      {/* Toggle button */}
      <MotionIconButton
        onClick={onToggle}
        edge="end"
        sx={{
          display: { xs: 'none', md: 'flex' },
          background: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backdropFilter: 'blur(4px)',
          '&:hover': {
            background: alpha(theme.palette.background.paper, 0.8),
          },
        }}
        whileHover={{ scale: 1.1, rotate: open ? -180 : 0 }}
        whileTap={{ scale: 0.9 }}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </MotionIconButton>
    </Box>
  )
}

export default SidebarHeader
