// src/components/flow/ProgressTracker.tsx
'use client'
import React from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
  Tooltip,
  Typography,
  StepIconProps,
} from '@mui/material'
import {
  Description as ScriptIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  Movie as MovieIcon,
  Share as ShareIcon,
  Check as CheckIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { styled } from '@mui/system'

type StepType =
  | 'script'
  | 'images'
  | 'audio'
  | 'videoGenerating'
  | 'videoGenerated'
  | 'socialUpload'

interface ProgressTrackerProps {
  currentStep: string
}

// Custom styled components for StepIcon
const StepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.grey[300],
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  ...(ownerState.active && {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transform: 'scale(1.1)',
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.success.main,
  }),
}))

// Motion component for animated icon
const MotionBox = motion(Box)

// Custom step icon component
function CustomStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props
  const stepIcons = {
    1: <ScriptIcon />,
    2: <ImageIcon />,
    3: <AudioIcon />,
    4: <MovieIcon />,
    5: <ShareIcon />,
  }

  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? (
        <MotionBox
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CheckIcon />
        </MotionBox>
      ) : (
        <MotionBox
          animate={active ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: active ? 1 : 0 }}
        >
          {stepIcons[icon as keyof typeof stepIcons]}
        </MotionBox>
      )}
    </StepIconRoot>
  )
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Map the current step to a numeric index for the Stepper component
  const getStepIndex = (): number => {
    switch (currentStep) {
      case 'script':
        return 0
      case 'images':
        return 1
      case 'audio':
        return 2
      case 'videoGenerating':
      case 'videoGenerated':
        return 3
      case 'socialUpload':
        return 4
      default:
        return 0
    }
  }

  // Define the steps with their labels, icons and descriptions
  const steps = [
    {
      label: isMobile ? '' : 'Script',
      description: 'Create and edit your script',
    },
    {
      label: isMobile ? '' : 'Images',
      description: 'Generate and customize images',
    },
    {
      label: isMobile ? '' : 'Audio',
      description: 'Configure audio settings',
    },
    {
      label: isMobile ? '' : 'Video',
      description: 'Create your final video',
    },
    {
      label: isMobile ? '' : 'Share',
      description: 'Publish to social media',
    },
  ]

  // Get the active step index
  const activeStep = getStepIndex()

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          '& .MuiStepConnector-line': {
            height: 3,
            border: 0,
            backgroundColor: theme.palette.grey[300],
            borderRadius: 1,
          },
          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
            backgroundColor: theme.palette.secondary.main,
          },
          '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            backgroundColor: theme.palette.success.main,
          },
          '& .MuiStepLabel-label': {
            mt: 1,
            fontSize: isMobile ? '0.7rem' : '0.875rem',
            fontWeight: 'medium',
          },
          '& .MuiStepLabel-root.Mui-active .MuiStepLabel-label': {
            fontWeight: 'bold',
            color: theme.palette.text.primary,
          },
          '& .MuiStepLabel-root.Mui-completed .MuiStepLabel-label': {
            color: theme.palette.success.main,
          },
          '& .MuiStepper-root': {
            padding: isTablet ? 1 : 2,
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={index} completed={index < activeStep}>
            <Tooltip
              title={
                <Typography variant="body2">{step.description}</Typography>
              }
              placement="top"
              arrow
            >
              <StepLabel StepIconComponent={CustomStepIcon}>
                {step.label}
              </StepLabel>
            </Tooltip>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

export default ProgressTracker
