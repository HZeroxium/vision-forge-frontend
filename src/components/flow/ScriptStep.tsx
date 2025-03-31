// src/components/flow/ScriptStep.tsx
'use client'
import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

interface ScriptStepProps {
  title: string
  setTitle: (value: string) => void
  selectedContentStyle: string
  setSelectedContentStyle: (value: string) => void
  selectedLanguage: string
  setSelectedLanguage: (value: string) => void
  localContent: string
  setLocalContent: (value: string) => void
  scriptExists: boolean
  onCreateScript: () => Promise<void>
  onUpdateScript: () => Promise<void>
  onProceedToImages: () => Promise<void>
  contentStyleOptions: string[]
  languageOptions: { value: string; label: string }[]
  onReset: () => void
  isGeneratingScript?: boolean
}

const ScriptStep: React.FC<ScriptStepProps> = ({
  title,
  setTitle,
  selectedContentStyle,
  setSelectedContentStyle,
  selectedLanguage,
  setSelectedLanguage,
  localContent,
  setLocalContent,
  scriptExists,
  onCreateScript,
  onUpdateScript,
  onProceedToImages,
  contentStyleOptions,
  languageOptions,
  onReset,
  isGeneratingScript = false,
}) => {
  const [showNoScriptAlert, setShowNoScriptAlert] = useState(false)
  const [isUpdatingScript, setIsUpdatingScript] = useState(false)
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
  const [showUpdateError, setShowUpdateError] = useState(false)

  const handleUpdateScript = async () => {
    console.log('Starting script update...')
    setIsUpdatingScript(true)
    try {
      console.log('Calling onUpdateScript...')
      await onUpdateScript()
      console.log('Script update completed')
      // Thông báo thành công
      setShowUpdateSuccess(true)
    } catch (error) {
      console.error('Error updating script:', error)
      // Thông báo lỗi
      setShowUpdateError(true)
    } finally {
      setIsUpdatingScript(false)
    }
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel id="content-style-label">Content Style</InputLabel>
        <Select
          labelId="content-style-label"
          label="Content Style"
          value={selectedContentStyle}
          onChange={(e) => setSelectedContentStyle(e.target.value)}
        >
          {contentStyleOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="language-label">Language</InputLabel>
        <Select
          labelId="language-label"
          label="Language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languageOptions.map((lang) => (
            <MenuItem key={lang.value} value={lang.value}>
              {lang.label.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          onClick={onCreateScript}
          fullWidth
          disabled={isGeneratingScript}
          startIcon={
            isGeneratingScript ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          {isGeneratingScript ? 'Generating...' : 'Generate Script'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          disabled={isGeneratingScript}
        >
          Reset Flow
        </Button>
      </Box>

      {isGeneratingScript && (
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress size={60} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                AI
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {scriptExists && (
        <>
          <Typography variant="subtitle1">
            Script Content (Editable):
          </Typography>
          <TextField
            label="Script Content"
            variant="outlined"
            fullWidth
            multiline
            minRows={6}
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
          />
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={handleUpdateScript}
              disabled={isUpdatingScript}
              startIcon={
                isUpdatingScript ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {isUpdatingScript ? 'Updating...' : 'Update Script'}
            </Button>
          </Box>
        </>
      )}

      <Snackbar
        open={showNoScriptAlert}
        autoHideDuration={4000}
        onClose={() => setShowNoScriptAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setShowNoScriptAlert(false)}>
          You need to generate a script before proceeding to the next step.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showUpdateSuccess}
        autoHideDuration={4000}
        onClose={() => setShowUpdateSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowUpdateSuccess(false)}>
          Script updated successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showUpdateError}
        autoHideDuration={4000}
        onClose={() => setShowUpdateError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setShowUpdateError(false)}>
          Error updating script.
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ScriptStep
