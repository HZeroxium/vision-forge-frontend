import React from 'react'
import { motion } from 'framer-motion'
import { Box, useTheme } from '@mui/material'

interface ParticlesBackgroundProps {
  particleCount?: number
  colorRange?: [number, number]
  backgroundScale?: [number, number, number]
  backgroundRotation?: [number, number, number, number, number]
  backgroundDuration?: number
}

const MotionBox = motion(Box)

export const ParticlesSVG: React.FC<{
  particleCount?: number
  colorRange?: [number, number]
}> = ({
  particleCount = 20,
  colorRange = [200, 320], // Range from cyan/blue to purple
}) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 400 400"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      opacity: 0.5,
    }}
  >
    {Array.from({ length: particleCount }).map((_, i) => (
      <motion.circle
        key={i}
        cx={Math.random() * 400}
        cy={Math.random() * 400}
        r={Math.random() * 5 + 1}
        fill={`hsl(${Math.random() * (colorRange[1] - colorRange[0]) + colorRange[0]}, 80%, 60%)`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          repeatType: 'loop',
          delay: Math.random() * 5,
        }}
      />
    ))}
  </svg>
)

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  particleCount = 20,
  colorRange = [200, 320],
  backgroundScale = [1, 1.1, 1],
  backgroundRotation = [0, 5, 0, -5, 0],
  backgroundDuration = 20,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      <ParticlesSVG particleCount={particleCount} colorRange={colorRange} />
      <MotionBox
        animate={{
          scale: backgroundScale,
          rotate: backgroundRotation,
        }}
        transition={{
          duration: backgroundDuration,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle, ${theme.palette.primary.light}15, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </Box>
  )
}

export default ParticlesBackground
