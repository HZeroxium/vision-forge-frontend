import React from 'react'
import { motion } from 'framer-motion'
import { Typography, SxProps, Theme } from '@mui/material'

// Create motion component
const MotionTypography = motion(Typography)

interface ErrorMessageProps {
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  titleVariant?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  descriptionVariant?:
    | 'body1'
    | 'body2'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
  maxWidth?: number | string
  sx?: SxProps<Theme>
  highlightedText?: string
  highlightColor?: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  description,
  titleVariant = 'h4',
  descriptionVariant = 'h6',
  maxWidth = 600,
  sx = {},
  highlightedText,
  highlightColor = 'primary.main',
}) => {
  // Function to highlight text if provided
  const highlightTextInDescription = (
    text: string,
    highlight: string,
    color: string
  ) => {
    if (!highlight) return text

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} style={{ fontWeight: 'bold', color }}>
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <>
      {title && (
        <MotionTypography
          variant={titleVariant}
          component="h2"
          fontWeight="bold"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          sx={{ mb: 2 }}
        >
          {title}
        </MotionTypography>
      )}

      {description && (
        <MotionTypography
          variant={descriptionVariant}
          color="text.secondary"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          sx={{ mb: 4, maxWidth, mx: 'auto', ...sx }}
        >
          {highlightedText
            ? highlightTextInDescription(
                description as string,
                highlightedText,
                highlightColor
              )
            : description}
        </MotionTypography>
      )}
    </>
  )
}

export default ErrorMessage
