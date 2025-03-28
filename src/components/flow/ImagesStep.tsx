// src/components/flow/ImagesStep.tsx
'use client'
import React from 'react'
import { Box, Button, Typography, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'

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
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6">
        Generated Images & Corresponding Scripts
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
                onChange={(e) => onEditImageScript(index, e.target.value)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" gap={2}>
        <Button variant="outlined" onClick={onRegenerateImages}>
          Regenerate Images
        </Button>
        <Button variant="contained" onClick={onProceedToAudio}>
          Proceed to Audio Configuration
        </Button>
      </Box>
    </Box>
  )
}

export default ImagesStep
