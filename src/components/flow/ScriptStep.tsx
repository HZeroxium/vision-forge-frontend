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
  Divider,
  Paper,
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import LoadingIndicator from '../common/LoadingIndicator'
import SourcesList from './SourcesList'
import { Source } from '@services/scriptsService'
import { ContentStyleOption } from '@/app/flow/generate-video/page'

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
  onUpdateScript: () => Promise<any>
  onProceedToImages: () => Promise<void>
  contentStyleOptions: ContentStyleOption[]
  languageOptions: { value: string; label: string }[]
  onReset: () => void
  isGeneratingScript?: boolean
  sources?: Source[] // Add sources prop
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
  sources = [], // Default to empty array
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

  const hasSources = sources && sources.length > 0

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
            <MenuItem key={option.displayValue} value={option.displayValue}>
              {option.label ||
                option.displayValue.charAt(0).toUpperCase() +
                  option.displayValue.slice(1)}
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
              <LoadingIndicator isLoading={true} size={20} showAfterDelay={0} />
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
          <LoadingIndicator
            isLoading={true}
            size={60}
            message="AI is generating your script..."
          />
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

          {hasSources && (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 2,
                mt: 2,
                borderColor: 'primary.light',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(66, 66, 66, 0.2)'
                    : 'rgba(230, 244, 255, 0.4)',
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <FactCheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" color="primary">
                  Fact Checked Content
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                This script has been fact-checked against reliable sources. View
                the sources below for verification.
              </Typography>
            </Paper>
          )}

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="outlined"
              onClick={handleUpdateScript}
              disabled={isUpdatingScript}
              startIcon={
                isUpdatingScript ? (
                  <LoadingIndicator
                    isLoading={true}
                    size={16}
                    showAfterDelay={0}
                  />
                ) : null
              }
            >
              {isUpdatingScript ? 'Updating...' : 'Update Script'}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={onProceedToImages}
              disabled={isGeneratingScript || isUpdatingScript}
            >
              Proceed to Images
            </Button>
          </Box>

          {hasSources && (
            <>
              <Divider sx={{ my: 3 }} />
              <SourcesList sources={sources} />
            </>
          )}
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
