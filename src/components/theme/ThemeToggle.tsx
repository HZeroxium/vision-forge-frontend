'use client'
import React from 'react'
import { IconButton, Tooltip, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import Brightness4Icon from '@mui/icons-material/Brightness4' // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7' // Light mode icon
import useThemeHook from '@/hooks/useTheme'

// Create motion component
const MotionIconButton = motion(IconButton)

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large'
  tooltip?: boolean
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'medium',
  tooltip = true,
}) => {
  const { toggleTheme, isDarkMode } = useThemeHook()
  const muiTheme = useTheme()

  const button = (
    <MotionIconButton
      color="inherit"
      onClick={toggleTheme}
      size={size}
      whileHover={{ rotate: 180, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </MotionIconButton>
  )

  if (tooltip) {
    return (
      <Tooltip
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {button}
      </Tooltip>
    )
  }

  return button
}

export default ThemeToggle
