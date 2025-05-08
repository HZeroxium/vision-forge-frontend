import React from 'react'
import { Box, Typography } from '@mui/material'
import { YouTube } from '@mui/icons-material'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface HeaderProps {
  title: string
  subtitle: string
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ mb: 4 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <YouTube color="error" sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      <Typography variant="subtitle1" color="text.secondary">
        {subtitle}
      </Typography>
    </MotionBox>
  )
}

export default Header
