import React from 'react'
import { motion } from 'framer-motion'
import { Box, Container, SxProps, Theme } from '@mui/material'

// Create motion component
const MotionBox = motion(Box)

interface ErrorContainerProps {
  children: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  centered?: boolean
  sx?: SxProps<Theme>
  containerSx?: SxProps<Theme>
}

const ErrorContainer: React.FC<ErrorContainerProps> = ({
  children,
  maxWidth = 'lg',
  centered = true,
  sx = {},
  containerSx = {},
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <Container
      maxWidth={maxWidth}
      sx={{ height: '100%', py: 4, ...containerSx }}
    >
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          ...(centered && { textAlign: 'center' }),
          position: 'relative',
          pt: { xs: 4, md: 6 },
          pb: { xs: 6, md: 10 },
          overflow: 'hidden',
          ...sx,
        }}
      >
        {children}
      </MotionBox>
    </Container>
  )
}

export default ErrorContainer
