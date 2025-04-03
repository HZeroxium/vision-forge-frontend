'use client'
import React from 'react'
import { Button, CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'

// Create motion component
const MotionButton = motion(Button)

interface AuthButtonProps {
  type?: 'button' | 'submit' | 'reset'
  text: string
  loading?: boolean
  onClick?: () => void
  fullWidth?: boolean
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  variant?: 'contained' | 'outlined' | 'text'
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  disabled?: boolean
  className?: string
}

const AuthButton: React.FC<AuthButtonProps> = ({
  type = 'button',
  text,
  loading = false,
  onClick,
  fullWidth = true,
  color = 'primary',
  variant = 'contained',
  startIcon,
  endIcon,
  disabled = false,
  className,
}) => {
  return (
    <MotionButton
      type={type}
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      sx={{
        py: 1.2,
        borderRadius: 2,
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 600,
        boxShadow:
          variant === 'contained' ? (theme) => theme.shadows[3] : 'none',
        background:
          variant === 'contained'
            ? (theme) =>
                `linear-gradient(45deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`
            : undefined,
        position: 'relative',
        overflow: 'hidden',
        '&::before':
          variant === 'contained'
            ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'all 0.6s',
              }
            : {},
        '&:hover::before':
          variant === 'contained'
            ? {
                left: '100%',
              }
            : {},
      }}
      className={className}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : text}
    </MotionButton>
  )
}

export default AuthButton
