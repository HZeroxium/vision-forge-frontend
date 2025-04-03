import React from 'react'
import { motion } from 'framer-motion'
import { Button, SxProps, Theme } from '@mui/material'
import Link from 'next/link'

// Create motion component
const MotionButton = motion(Button)

interface ActionButtonProps {
  children: React.ReactNode
  href?: string
  variant?: 'text' | 'outlined' | 'contained'
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
  size?: 'small' | 'medium' | 'large'
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  onClick?: () => void
  delay?: number
  hoverScale?: number
  tapScale?: number
  sx?: SxProps<Theme>
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  href,
  variant = 'contained',
  color = 'primary',
  size = 'large',
  startIcon,
  endIcon,
  onClick,
  delay = 0,
  hoverScale = 1.05,
  tapScale = 0.98,
  sx = {},
}) => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    },
  }

  return (
    <MotionButton
      component={href ? Link : undefined}
      href={href}
      variant={variant}
      color={color}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      sx={{
        py: 1.5,
        px: variant === 'text' ? 1 : 3,
        borderRadius: 2,
        ...sx,
      }}
    >
      {children}
    </MotionButton>
  )
}

export default ActionButton
