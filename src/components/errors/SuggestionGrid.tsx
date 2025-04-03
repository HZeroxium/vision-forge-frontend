import React from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, SxProps, Theme } from '@mui/material'
import SuggestionCard, { SuggestionCardProps } from './SuggestionCard'

// Create motion component
const MotionBox = motion(Box)

interface SuggestionGridProps {
  title?: string
  suggestions: Omit<SuggestionCardProps, 'delay'>[]
  columns?: { xs?: number; sm?: number; md?: number; lg?: number }
  gap?: number
  sx?: SxProps<Theme>
}

const SuggestionGrid: React.FC<SuggestionGridProps> = ({
  title,
  suggestions,
  columns = { xs: 1, sm: 2, md: 3 },
  gap = 3,
  sx = {},
}) => {
  // Convert columns configuration to grid template columns
  const gridTemplateColumns = Object.entries(columns).reduce(
    (acc, [breakpoint, value]) => ({
      ...acc,
      [breakpoint]: `repeat(${value}, 1fr)`,
    }),
    {}
  )

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      sx={sx}
    >
      {title && (
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
          {title}
        </Typography>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns,
          gap,
        }}
      >
        {suggestions.map((suggestion, index) => (
          <SuggestionCard key={index} {...suggestion} delay={0.1 * index} />
        ))}
      </Box>
    </MotionBox>
  )
}

export default SuggestionGrid
