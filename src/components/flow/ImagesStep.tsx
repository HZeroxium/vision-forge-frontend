// src/components/flow/ImagesStep.tsx
'use client'
import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import SaveIcon from '@mui/icons-material/Save'

interface ImagesStepProps {
  imagesData: { image_urls: string[]; scripts: string[] }
  onEditImageScript: (index: number, newScript: string) => void
  onRegenerateImages: () => Promise<void>
  onProceedToAudio: () => void
}

const ImagesStep: React.FC<ImagesStepProps> = ({
  imagesData,
  onEditImageScript,
  onRegenerateImages,
  onProceedToAudio,
}) => {
  const [editedScripts, setEditedScripts] = useState<boolean[]>(
    Array(imagesData.scripts.length).fill(false)
  )
  const [showSaveNotification, setShowSaveNotification] = useState(false)

  const handleScriptChange = (index: number, newScript: string) => {
    onEditImageScript(index, newScript)
    const newEditedScripts = [...editedScripts]
    newEditedScripts[index] = true
    setEditedScripts(newEditedScripts)
  }

  const handleSaveAllChanges = () => {
    setShowSaveNotification(true)
    setEditedScripts(Array(imagesData.scripts.length).fill(false))
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6">
        Generated Images & Corresponding Scripts
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Edit the scripts below to customize each image's narration. Your changes
        will be used when generating the final video.
      </Typography>

      <Grid container spacing={2}>
        {imagesData.image_urls.map((imgUrl, index) => (
          <Grid key={index} size={{ xs: 12, sm: 4 }}>
            <Box display="flex" flexDirection="column" gap={1}>
              <img
                src={imgUrl}
                alt={`Generated ${index + 1}`}
                style={{ width: '100%', height: 'auto' }}
              />
              <TextField
                label={`Script for Image ${index + 1}`}
                variant="outlined"
                fullWidth
                multiline
                minRows={3}
                value={imagesData.scripts[index]}
                onChange={(e) => handleScriptChange(index, e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderColor: editedScripts[index]
                      ? 'primary.main'
                      : 'inherit',
                  },
                }}
              />
              {editedScripts[index] && (
                <Typography variant="caption" color="primary">
                  Edited (will be saved automatically)
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" gap={2}>
        <Button variant="outlined" onClick={onRegenerateImages}>
          Regenerate Images
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveAllChanges}
          disabled={!editedScripts.some((edited) => edited)}
        >
          Save All Changes
        </Button>
        <Button variant="contained" onClick={onProceedToAudio}>
          Proceed to Audio Configuration
        </Button>
      </Box>

      <Snackbar
        open={showSaveNotification}
        autoHideDuration={3000}
        onClose={() => setShowSaveNotification(false)}
      >
        <Alert
          severity="success"
          onClose={() => setShowSaveNotification(false)}
        >
          Script changes saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ImagesStep
