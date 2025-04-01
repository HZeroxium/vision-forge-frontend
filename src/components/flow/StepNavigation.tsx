// src/components/flow/StepNavigation.tsx
'use client'
import React, { useState } from 'react'
import { Box, Button, Snackbar, Alert, Tooltip } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

interface StepNavigationProps {
  currentStep: string
  onPrevious?: () => void
  onNext?: () => void
  disableNext?: boolean
  nextLabel?: string
  isGeneratingImages?: boolean // New prop to handle image generation state
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onPrevious,
  onNext,
  disableNext = false,
  nextLabel = 'Next Step',
  isGeneratingImages = false, // Default value
}) => {
  const [showAlert, setShowAlert] = useState(false)

  // Don't render buttons on video step
  if (currentStep === 'videoGenerating' || currentStep === 'videoGenerated') {
    return null
  }

  const handleDisabledClick = () => {
    setShowAlert(true)
  }

  // Get step-specific alert message and tooltip content
  const getAlertMessage = () => {
    switch (currentStep) {
      case 'script':
        return 'Please generate a script before proceeding to the next step.'
      case 'images':
        return isGeneratingImages
          ? 'Please wait until the images have finished generating.'
          : 'Please wait for image generation to complete before proceeding.'
      case 'audio':
        return 'Please configure audio settings before generating the video.'
      default:
        return 'Please complete the current step before proceeding.'
    }
  }

  const alertMessage = getAlertMessage()

  // Determine if we should show a tooltip even when not disabled
  const getTooltipContent = () => {
    if (disableNext) return alertMessage

    if (currentStep === 'images' && isGeneratingImages) {
      return 'Images are still being generated. You can continue once they are ready.'
    }

    return null
  }

  const tooltipContent = getTooltipContent()

  // Render the next button based on state
  const renderNextButton = () => {
    const button = (
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        onClick={disableNext ? handleDisabledClick : onNext}
        sx={{
          opacity: disableNext ? 0.7 : 1,
          transition: 'all 0.2s ease',
          '&:hover': disableNext
            ? {
                cursor: 'not-allowed',
                opacity: 0.7,
              }
            : {
                transform: 'translateY(-2px)',
                boxShadow: 2,
              },
        }}
      >
        {nextLabel}
      </Button>
    )

    // If we have tooltip content, wrap in Tooltip
    if (tooltipContent) {
      return (
        <Tooltip title={tooltipContent} placement="top">
          <span>{button}</span>
        </Tooltip>
      )
    }

    return button
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: 4,
        mb: 2,
      }}
    >
      {currentStep !== 'script' && onPrevious ? (
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onPrevious}
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 1,
            },
          }}
        >
          Previous Step
        </Button>
      ) : (
        <Box /> // Empty box for spacing when Previous button is not shown
      )}

      {onNext && renderNextButton()}

      <Snackbar
        open={showAlert}
        autoHideDuration={4000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default StepNavigation
