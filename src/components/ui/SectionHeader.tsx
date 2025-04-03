import React from 'react'
import { motion } from 'framer-motion'
import { Typography, Box, SxProps, Theme } from '@mui/material'

// Create motion components
const MotionBox = motion(Box)
const MotionTypography = motion(Typography)

interface SectionHeaderProps {
  title: string
  description?: string
  textAlign?: 'left' | 'center' | 'right'
  color?: string
  descriptionColor?: string
  maxWidth?: number | string
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  descriptionVariant?:
    | 'body1'
    | 'body2'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
  sx?: SxProps<Theme>
  titleSx?: SxProps<Theme>
  descriptionSx?: SxProps<Theme>
  fadeInDelay?: number
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  textAlign = 'center',
  color = 'primary',
  descriptionColor = 'text.secondary',
  maxWidth = 700,
  titleVariant = 'h3',
  descriptionVariant = 'h6',
  sx = {},
  titleSx = {},
  descriptionSx = {},
  fadeInDelay = 0,
}) => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: fadeInDelay },
    },
  }

  return (
    <MotionBox
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn}
      sx={{
        textAlign,
        mb: description ? 8 : 4,
        ...sx,
      }}
    >
      <MotionTypography
        variant={titleVariant}
        component="h2"
        fontWeight="bold"
        color={color}
        gutterBottom
        sx={titleSx}
      >
        {title}
      </MotionTypography>

      {description && (
        <Typography
          variant={descriptionVariant}
          color={descriptionColor}
          sx={{
            maxWidth,
            mx: textAlign === 'center' ? 'auto' : undefined,
            ...descriptionSx,
          }}
        >
          {description}
        </Typography>
      )}
    </MotionBox>
  )
}

export default SectionHeader
