import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material'
import { SvgIconComponent } from '@mui/icons-material'
import { motion } from 'framer-motion'

interface SummaryCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactElement
  color: string
  isLoading?: boolean
  delay?: number
}

const MotionCard = motion(Card)

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  isLoading = false,
  delay = 0,
}) => {
  const theme = useTheme()

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      sx={{ borderRadius: 2, height: '100%' }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Chip
            icon={icon}
            label={title}
            size="small"
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              '& .MuiChip-icon': {
                color: 'inherit',
              },
            }}
          />
        </Box>
        <Typography variant="h4" fontWeight="medium" sx={{ mt: 1 }}>
          {isLoading ? <CircularProgress size={24} /> : value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      </CardContent>
    </MotionCard>
  )
}

export default SummaryCard
