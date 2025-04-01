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
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onPrevious,
  onNext,
  disableNext = false,
  nextLabel = 'Next Step',
}) => {
  const [showAlert, setShowAlert] = useState(false)

  // Don't render buttons on video step
  if (currentStep === 'videoGenerating' || currentStep === 'videoGenerated') {
    return null
  }

  const handleDisabledClick = () => {
    setShowAlert(true)
  }

  // Chuẩn bị thông báo dựa vào step hiện tại
  const alertMessage =
    currentStep === 'script'
      ? 'Please generate a script before proceeding to the next step.'
      : 'Please complete the current step before proceeding.'

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
        >
          Previous Step
        </Button>
      ) : (
        <Box /> // Empty box for spacing when Previous button is not shown
      )}

      {onNext && (
        <>
          {disableNext ? (
            <Tooltip title={alertMessage}>
              <span>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleDisabledClick}
                  sx={{
                    opacity: 0.7,
                    '&:hover': {
                      cursor: 'not-allowed',
                      opacity: 0.7,
                    },
                  }}
                >
                  {nextLabel}
                </Button>
              </span>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={onNext}
            >
              {nextLabel}
            </Button>
          )}
        </>
      )}

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
