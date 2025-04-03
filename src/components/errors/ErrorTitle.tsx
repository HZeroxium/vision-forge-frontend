import React from 'react'
import { motion } from 'framer-motion'
import { Typography, useTheme, SxProps, Theme } from '@mui/material'

// Create motion component
const MotionTypography = motion(Typography)

interface ErrorTitleProps {
  title: string | React.ReactNode
  gradient?: boolean
  colors?: string[]
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  fontSize?: { xs?: string; sm?: string; md?: string; lg?: string }
  sx?: SxProps<Theme>
}

const ErrorTitle: React.FC<ErrorTitleProps> = ({
  title,
  gradient = true,
  colors,
  variant = 'h1',
  fontSize = { xs: '5rem', md: '8rem' },
  sx = {},
}) => {
  const theme = useTheme()
  const gradientColors = colors || [
    theme.palette.primary.main,
    theme.palette.secondary.main,
  ]

  return (
    <MotionTypography
      variant={variant}
      component="h1"
      fontWeight="bold"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      sx={{
        fontSize,
        ...(gradient && {
          background: `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }),
        mb: 2,
        ...sx,
      }}
    >
      {title}
    </MotionTypography>
  )
}

export default ErrorTitle
