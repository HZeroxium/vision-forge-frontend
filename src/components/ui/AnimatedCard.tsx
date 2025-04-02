import React from 'react'
import { motion } from 'framer-motion'
import { Card, SxProps, Theme } from '@mui/material'

// Create motion component
const MotionCard = motion(Card)

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  hoverEffect?: boolean
  hoverScale?: number
  viewportOnce?: boolean
  viewportAmount?: number
  sx?: SxProps<Theme>
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  hoverEffect = true,
  hoverScale = 1.03,
  viewportOnce = true,
  viewportAmount = 0.1,
  sx = {},
}) => {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay },
    },
  }

  // Hover animation
  const hoverAnimation = hoverEffect
    ? {
        y: -10,
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        transition: { duration: 0.3 },
      }
    : {}

  return (
    <MotionCard
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, amount: viewportAmount }}
      variants={cardVariants}
      whileHover={hoverEffect ? hoverAnimation : undefined}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        ...sx,
      }}
    >
      {children}
    </MotionCard>
  )
}

export default AnimatedCard
