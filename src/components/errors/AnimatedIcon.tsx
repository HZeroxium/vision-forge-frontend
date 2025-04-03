import React from 'react'
import { motion } from 'framer-motion'
import { Box, SxProps, Theme } from '@mui/material'

// Create motion components
const MotionBox = motion(Box)

interface AnimatedIconProps {
  icon: React.ReactNode
  size?: number
  color?: string
  bgColor?: string
  rotationDegrees?: number[]
  rotationDuration?: number
  sx?: SxProps<Theme>
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  size = 120,
  color,
  bgColor = 'primary.light',
  rotationDegrees = [0, 10, 0, -10, 0],
  rotationDuration = 5,
  sx = {},
}) => {
  return (
    <MotionBox
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: bgColor,
        color: color || 'primary.contrastText',
        mb: 4,
        ...sx,
      }}
    >
      <MotionBox
        animate={{
          rotate: rotationDegrees,
        }}
        transition={{
          duration: rotationDuration,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {icon}
      </MotionBox>
    </MotionBox>
  )
}

export default AnimatedIcon
