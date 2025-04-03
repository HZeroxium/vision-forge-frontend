'use client'
import React from 'react'
import { Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'

// Create motion components
const MotionBox = motion(Box)
const MotionTypography = motion(Typography)

interface AuthHeaderProps {
  title: string
  subtitle?: string
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ mb: 3, textAlign: 'center' }}
    >
      <MotionTypography
        variant="h4"
        sx={(theme) => ({
          fontWeight: 700,
          mb: 1,
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.light})`
              : `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        })}
      >
        {title}
      </MotionTypography>

      {subtitle && (
        <MotionTypography
          variant="body1"
          color="text.secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {subtitle}
        </MotionTypography>
      )}
    </MotionBox>
  )
}

export default AuthHeader
