import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Box, Typography, Button, Paper, SxProps, Theme } from '@mui/material'

// Create motion component
const MotionPaper = motion(Paper)

export interface SuggestionCardProps {
  title: string
  path: string
  icon: React.ReactNode
  description: string
  buttonText?: string
  delay?: number
  sx?: SxProps<Theme>
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  title,
  path,
  icon,
  description,
  buttonText = 'Explore',
  delay = 0,
  sx = {},
}) => {
  return (
    <MotionPaper
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
        border: '1px solid',
        borderColor: 'divider',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          color: 'primary.main',
        }}
      >
        {icon}
        <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, flexGrow: 1 }}
      >
        {description}
      </Typography>
      <Button
        component={Link}
        href={path}
        variant="outlined"
        size="small"
        sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
      >
        {buttonText}
      </Button>
    </MotionPaper>
  )
}

export default SuggestionCard
