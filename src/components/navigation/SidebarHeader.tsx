'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, IconButton, Avatar, Typography } from '@mui/material'
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
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 2,
        justifyContent: open ? 'space-between' : 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MotionBox whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <MovieCreationIcon />
          </Avatar>
        </MotionBox>
        <AnimatePresence>
          {open && (
            <MotionTypography
              variant="h6"
              sx={{ ml: 2, fontWeight: 'bold', userSelect: 'none' }}
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
      <MotionIconButton
        onClick={onToggle}
        edge="end"
        sx={{ display: { xs: 'none', md: 'flex' } }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </MotionIconButton>
    </Box>
  )
}

export default SidebarHeader
