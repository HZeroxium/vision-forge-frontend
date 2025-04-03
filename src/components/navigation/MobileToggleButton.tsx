'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

// Create motion components
const MotionIconButton = motion.create(IconButton)

interface MobileToggleButtonProps {
  onClick: () => void
}

const MobileToggleButton: React.FC<MobileToggleButtonProps> = ({ onClick }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: (theme) => theme.zIndex.drawer + 2,
        display: { xs: 'block', md: 'none' },
      }}
    >
      <MotionIconButton
        color="primary"
        onClick={onClick}
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          boxShadow: 3,
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MenuIcon />
      </MotionIconButton>
    </Box>
  )
}

export default MobileToggleButton
