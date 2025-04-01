// src/components/flow/images/ScriptEditor.tsx
'use client'
import React from 'react'
import {
  Box,
  TextField,
  Typography,
  CardContent,
  useTheme,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface ScriptEditorProps {
  currentImageIndex: number
  script: string
  isEdited: boolean
  isFullscreen: boolean
  isRegeneratingImages: boolean
  onScriptChange: (index: number, newScript: string) => void
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({
  currentImageIndex,
  script,
  isEdited,
  isFullscreen,
  isRegeneratingImages,
  onScriptChange,
}) => {
  const theme = useTheme()

  return (
    <CardContent
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: isFullscreen ? '100%' : { xs: '100%', md: '40%' },
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EditIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">
          Script for Image {currentImageIndex + 1}
        </Typography>
      </Box>

      <TextField
        variant="outlined"
        fullWidth
        multiline
        rows={6}
        value={script}
        onChange={(e) => onScriptChange(currentImageIndex, e.target.value)}
        disabled={isRegeneratingImages}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderColor: isEdited ? theme.palette.primary.main : 'inherit',
            border: isEdited
              ? `1px solid ${theme.palette.primary.main}`
              : undefined,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.primary.light,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 8px ${theme.palette.primary.light}`,
            },
          },
        }}
      />

      {isEdited && (
        <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
          <CheckCircleIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
          <Typography
            variant="caption"
            color="primary.main"
            fontWeight="medium"
          >
            Changes need to be saved
          </Typography>
        </Box>
      )}
    </CardContent>
  )
}

export default ScriptEditor
