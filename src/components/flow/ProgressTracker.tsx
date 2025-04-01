// src/components/flow/ProgressTracker.tsx
'use client'
import React from 'react'
import { Box, Typography, styled } from '@mui/material'

const steps = [
  { key: 'script', label: 'Script' },
  { key: 'images', label: 'Images' },
  { key: 'audio', label: 'Audio' },
  { key: 'video', label: 'Video' },
]

const StepContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  position: 'relative',
  marginBottom: theme.spacing(4),
}))

const StepBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  height: 4,
  backgroundColor: theme.palette.grey[300],
  zIndex: 0,
  transform: 'translateY(-50%)',
}))

const ProgressBar = styled(Box)<{ width: number }>(({ theme, width }) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  height: 4,
  width: `${width}%`,
  backgroundColor: theme.palette.primary.main,
  zIndex: 1,
  transform: 'translateY(-50%)',
  transition: 'width 0.5s ease-in-out',
}))

interface StepCircleProps {
  active: boolean
  completed: boolean
}

const StepCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'completed',
})<StepCircleProps>(({ theme, active, completed }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: completed
    ? theme.palette.primary.main
    : active
      ? theme.palette.background.paper
      : theme.palette.grey[100],
  color: completed
    ? theme.palette.primary.contrastText
    : active
      ? theme.palette.primary.main
      : theme.palette.text.secondary,
  border: active ? `2px solid ${theme.palette.primary.main}` : 'none',
  boxShadow: active ? theme.shadows[2] : 'none',
  zIndex: 2,
  transition: 'all 0.3s ease-in-out',
}))

const StepLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  textAlign: 'center',
  fontSize: '0.875rem',
  transition: 'color 0.3s ease-in-out',
}))

interface ProgressTrackerProps {
  currentStep: string
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep }) => {
  // Find the current step index
  const currentStepIndex = steps.findIndex((step) => {
    if (currentStep === 'videoGenerating' || currentStep === 'videoGenerated') {
      return step.key === 'video'
    }
    return step.key === currentStep
  })

  // Calculate progress percentage
  const progressWidth = Math.min(
    100,
    ((currentStepIndex + 1) / steps.length) * 100
  )

  return (
    <Box sx={{ mb: 4, mt: 2 }}>
      <StepContainer>
        <StepBar />
        <ProgressBar width={progressWidth} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex
            const isCompleted = index < currentStepIndex

            return (
              <Box
                key={step.key}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <StepCircle active={isActive} completed={isCompleted}>
                  {isCompleted ? '✓' : index + 1}
                </StepCircle>
                <StepLabel
                  color={
                    isActive
                      ? 'primary.main'
                      : isCompleted
                        ? 'text.primary'
                        : 'text.secondary'
                  }
                  fontWeight={isActive || isCompleted ? 'medium' : 'normal'}
                >
                  {step.label}
                </StepLabel>
              </Box>
            )
          })}
        </Box>
      </StepContainer>
    </Box>
  )
}

export default ProgressTracker
