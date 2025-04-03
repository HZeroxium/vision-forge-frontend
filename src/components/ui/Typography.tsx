import React from 'react'
import { motion } from 'framer-motion'
import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from '@mui/material'

// Create motion component
const MotionTypography = motion(MuiTypography)

interface AnimatedTypographyProps extends MuiTypographyProps {
  animate?: boolean
  delay?: number
  duration?: number
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'
    | 'inherit'
  children: React.ReactNode
}

const Typography: React.FC<AnimatedTypographyProps> = ({
  animate = true,
  delay = 0,
  duration = 0.6,
  variant = 'body1',
  children,
  ...props
}) => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay },
    },
  }

  if (!animate) {
    return (
      <MuiTypography variant={variant} {...props}>
        {children}
      </MuiTypography>
    )
  }

  return (
    <MotionTypography
      variant={variant}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      {...props}
    >
      {children}
    </MotionTypography>
  )
}

export default Typography
