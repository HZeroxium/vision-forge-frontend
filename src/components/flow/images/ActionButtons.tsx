// src/components/flow/images/ActionButtons.tsx
'use client'
import React from 'react'
import { Box, Button, Tooltip, CircularProgress, Badge } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import RefreshIcon from '@mui/icons-material/Refresh'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

interface ActionButtonsProps {
  hasEditedScripts: boolean
  isRegeneratingImages: boolean
  isGeneratingInitialImages: boolean
  isSaving?: boolean // Add new prop for saving state
  onRegenerateImages: () => void
  onSaveAllChanges: () => void
  onProceedToAudio: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasEditedScripts,
  isRegeneratingImages,
  isGeneratingInitialImages,
  isSaving = false,
  onRegenerateImages,
  onSaveAllChanges,
  onProceedToAudio,
}) => {
  const buttonStyle = {
    borderRadius: 2,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 1,
    },
  }

  return (
    <Box display="flex" gap={2} mt={2} flexWrap="wrap">
      <Tooltip title="Generate a new set of images from your script">
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRegenerateImages}
          disabled={isRegeneratingImages || isSaving}
          sx={buttonStyle}
        >
          {isRegeneratingImages ? 'Regenerating...' : 'Regenerate Images'}
        </Button>
      </Tooltip>

      <Tooltip
        title={
          !hasEditedScripts
            ? 'No changes to save'
            : 'Save all your script edits'
        }
      >
        <span>
          {' '}
          <Badge
            variant="dot"
            color="error"
            invisible={!hasEditedScripts}
            sx={{
              '& .MuiBadge-badge': {
                right: 6,
                top: 6,
              },
            }}
          >
            <Button
              variant={hasEditedScripts ? 'contained' : 'outlined'}
              color="primary"
              startIcon={
                isSaving ? <CircularProgress size={20} /> : <SaveIcon />
              }
              onClick={onSaveAllChanges}
              disabled={!hasEditedScripts || isRegeneratingImages || isSaving}
              sx={buttonStyle}
            >
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </Badge>
        </span>
      </Tooltip>

      {/* <Button
        variant="contained"
        color="primary"
        endIcon={<NavigateNextIcon />}
        onClick={onProceedToAudio}
        disabled={isRegeneratingImages || isGeneratingInitialImages || isSaving}
        sx={{
          ml: { xs: 0, sm: 'auto' },
          borderRadius: 2,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2,
          },
        }}
      >
        Continue to Audio
      </Button> */}
    </Box>
  )
}

export default ActionButtons
