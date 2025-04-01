// src/components/flow/images/ActionButtons.tsx
'use client'
import React from 'react'
import { Box, Button, Tooltip } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import RefreshIcon from '@mui/icons-material/Refresh'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

interface ActionButtonsProps {
  hasEditedScripts: boolean
  isRegeneratingImages: boolean
  isGeneratingInitialImages: boolean
  onRegenerateImages: () => void
  onSaveAllChanges: () => void
  onProceedToAudio: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasEditedScripts,
  isRegeneratingImages,
  isGeneratingInitialImages,
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
          disabled={isRegeneratingImages}
          sx={buttonStyle}
        >
          {isRegeneratingImages ? 'Regenerating...' : 'Regenerate Images'}
        </Button>
      </Tooltip>

      <Tooltip title="Save all your script edits">
        {!hasEditedScripts || isRegeneratingImages ? (
          <span>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={onSaveAllChanges}
              disabled={true}
              sx={buttonStyle}
            >
              Save All Changes
            </Button>
          </span>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={onSaveAllChanges}
            disabled={false}
            sx={buttonStyle}
          >
            Save All Changes
          </Button>
        )}
      </Tooltip>

      <Button
        variant="contained"
        color="primary"
        endIcon={<NavigateNextIcon />}
        onClick={onProceedToAudio}
        disabled={isRegeneratingImages || isGeneratingInitialImages}
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
      </Button>
    </Box>
  )
}

export default ActionButtons
