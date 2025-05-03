// src/components/flow/StepNavigation.tsx

'use client'
import React from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { NavigateBefore, NavigateNext } from '@mui/icons-material'
import { motion } from 'framer-motion'

const MotionButton = motion(Button)
const MotionBox = motion(Box)

interface StepNavigationProps {
  currentStep: string
  onPrevious: () => void
  onNext: () => void
  disableNext?: boolean
  nextLabel?: string
  showNext?: boolean
  showPrevious?: boolean
  isGeneratingImages?: boolean
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onPrevious,
  onNext,
  disableNext = false,
  nextLabel = 'Next Step',
  showNext = true,
  showPrevious = true,
  isGeneratingImages = false,
}) => {
  const theme = useTheme()

  // Determine what step we're on for UI enhancements
  const getStepName = (): string => {
    switch (currentStep) {
      case 'script':
        return 'Script Creation'
      case 'images':
        return 'Image Generation'
      case 'audio':
        return 'Audio Configuration'
      case 'videoGenerating':
        return 'Video Generation'
      case 'videoGenerated':
        return 'Video Preview'
      case 'socialUpload':
        return 'Social Media Upload'
      default:
        return ''
    }
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 4,
        gap: 2,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: { xs: 'none', md: 'block' },
          fontWeight: 'medium',
        }}
      >
        Current Step:{' '}
        <Typography component="span" color="secondary" fontWeight="bold">
          {getStepName()}
        </Typography>
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
        }}
      >
        {/* Previous button */}
        {showPrevious ? (
          <MotionButton
            variant="outlined"
            color="inherit"
            onClick={onPrevious}
            startIcon={<NavigateBefore />}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              minWidth: { xs: '120px', sm: '100px' },
              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
              borderRadius: 2,
            }}
          >
            Previous
          </MotionButton>
        ) : (
          <Box sx={{ display: { xs: 'none', sm: 'block' } }} /> // Empty box for spacing on larger screens
        )}

        {/* Next button */}
        {showNext && (
          <MotionButton
            variant="contained"
            color="primary"
            onClick={onNext}
            endIcon={<NavigateNext />}
            disabled={disableNext || isGeneratingImages}
            whileHover={
              !disableNext && !isGeneratingImages ? { scale: 1.05 } : undefined
            }
            whileTap={
              !disableNext && !isGeneratingImages ? { scale: 0.95 } : undefined
            }
            sx={{
              minWidth: { xs: '140px', sm: '120px' },
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isGeneratingImages ? 'Generating...' : nextLabel}
            {isGeneratingImages && (
              <Box
                component={motion.div}
                animate={{
                  x: ['0%', '100%'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'linear',
                }}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(90deg, transparent, ${theme.palette.primary.light}, transparent)`,
                  zIndex: 0,
                }}
              />
            )}
          </MotionButton>
        )}
      </Box>
    </MotionBox>
  )
}

export default StepNavigation
