// src/components/flow/images/ActionButtons.tsx
'use client'
import React from 'react'
import { Box, Button, Tooltip } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CircularProgress from '@mui/material/CircularProgress'

interface ActionButtonsProps {
  hasEditedScripts: boolean
  isRegeneratingImages: boolean
  isGeneratingInitialImages: boolean
  isSaving: boolean
  onRegenerateImages: () => Promise<void>
  onSaveAllChanges: () => Promise<void>
  onProceedToAudio: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasEditedScripts,
  isRegeneratingImages,
  isGeneratingInitialImages,
  isSaving,
  onRegenerateImages,
  onSaveAllChanges,
  onProceedToAudio,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        mt: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Regenerate Images Button */}
        <Tooltip title="Generate new images from the current script">
          <span>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onRegenerateImages}
              disabled={
                isRegeneratingImages || isGeneratingInitialImages || isSaving
              }
              startIcon={
                isRegeneratingImages ? (
                  <CircularProgress size={20} />
                ) : (
                  <AutoAwesomeIcon />
                )
              }
            >
              {isRegeneratingImages ? 'Regenerating...' : 'Regenerate Images'}
            </Button>
          </span>
        </Tooltip>

        {/* Save Changes Button */}
        <Tooltip
          title={
            hasEditedScripts
              ? 'Save all script changes'
              : 'No script changes to save'
          }
        >
          <span>
            <Button
              variant="outlined"
              onClick={onSaveAllChanges}
              disabled={
                !hasEditedScripts ||
                isRegeneratingImages ||
                isGeneratingInitialImages ||
                isSaving
              }
              startIcon={
                isSaving ? <CircularProgress size={20} /> : <SaveIcon />
              }
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </span>
        </Tooltip>
      </Box>

      {/* Proceed Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={onProceedToAudio}
        disabled={isRegeneratingImages || isGeneratingInitialImages || isSaving}
        endIcon={<NavigateNextIcon />}
      >
        Proceed to Audio
      </Button>
    </Box>
  )
}

export default ActionButtons
