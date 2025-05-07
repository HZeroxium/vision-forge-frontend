// src/components/flow/ScriptStep.tsx
'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  Checkbox,
  FormControlLabel,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import {
  AddCircle as AddCircleIcon,
  Delete as DeleteIcon,
  Create as CreateIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  RestartAlt as RestartAltIcon,
  FactCheck as FactCheckIcon,
  Save as SaveIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import type { ContentStyleOption } from '@/app/flow/generate-video/page'
import { Source } from '@/services/scriptsService'
import SourcesList from './SourcesList'

interface ScriptStepProps {
  title: string
  setTitle: (title: string) => void
  selectedContentStyle: string
  setSelectedContentStyle: (style: string) => void
  selectedLanguage: string
  setSelectedLanguage: (language: string) => void
  localContent: string
  setLocalContent: (content: string) => void
  scriptExists: boolean
  onCreateScript: () => Promise<void>
  onUpdateScript: () => Promise<void>
  onProceedToImages: () => void
  contentStyleOptions: ContentStyleOption[]
  languageOptions: { value: string; label: string }[]
  onReset: () => void
  isGeneratingScript: boolean
  sources: Source[]
  includePersonalDescription: boolean
  setIncludePersonalDescription: (include: boolean) => void
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
  isGeneratingScript,
  sources = [],
  includePersonalDescription,
  setIncludePersonalDescription,
}) => {
  const [isUpdatingScript, setIsUpdatingScript] = useState(false)
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
  const [showUpdateError, setShowUpdateError] = useState(false)
  const [showNoScriptAlert, setShowNoScriptAlert] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleUpdateScript = async () => {
    console.log('Starting script update...')
    setIsUpdatingScript(true)
    try {
      console.log('Calling onUpdateScript...')
      await onUpdateScript()
      console.log('Script update completed')
      setShowUpdateSuccess(true)
    } catch (error) {
      console.error('Error updating script:', error)
      setShowUpdateError(true)
    } finally {
      setIsUpdatingScript(false)
    }
  }

  const handleLocalContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setLocalContent(e.target.value)
  }

  const handleProceedToImages = () => {
    if (!scriptExists) {
      setShowNoScriptAlert(true)
      return
    }
    onProceedToImages()
  }

  const handleResetFlow = () => {
    if (scriptExists) {
      setShowResetDialog(true)
    } else {
      onReset()
    }
  }

  const confirmResetFlow = () => {
    setShowResetDialog(false)
    onReset()
  }

  const hasSources = sources && sources.length > 0

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Create Your Script</Typography>

        {/* Reset Flow button always available */}
        <Tooltip
          title={
            isGeneratingScript || isUpdatingScript
              ? 'Please wait for current operation to complete'
              : 'Reset the entire flow'
          }
        >
          <span>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RestartAltIcon />}
              onClick={handleResetFlow}
              disabled={isGeneratingScript || isUpdatingScript}
              size="small"
            >
              Reset Flow
            </Button>
          </span>
        </Tooltip>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={scriptExists}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Content Style</InputLabel>
          <Select
            value={selectedContentStyle}
            onChange={(e) => setSelectedContentStyle(e.target.value)}
            label="Content Style"
            disabled={scriptExists}
          >
            {contentStyleOptions.map((option) => (
              <MenuItem key={option.displayValue} value={option.displayValue}>
                {option.label || option.displayValue}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            label="Language"
            disabled={scriptExists}
          >
            {languageOptions.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.label.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title="When enabled, we'll use your profile information to create a more personalized script that matches your tone and preferences">
          <FormControlLabel
            control={
              <Checkbox
                checked={includePersonalDescription}
                onChange={(e) =>
                  setIncludePersonalDescription(e.target.checked)
                }
                disabled={isGeneratingScript || scriptExists}
                color="primary"
                icon={<PersonIcon />}
                checkedIcon={<PersonIcon />}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">
                  Include my profile description for personalization
                </Typography>
                <Tooltip title="Uses your profile description to tailor the script to your style">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            }
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          />
        </Tooltip>
      </Box>

      {!scriptExists ? (
        <Box display="flex" justifyContent="center">
          <Tooltip title={!title ? 'Please enter a title first' : ''}>
            <span style={{ width: '100%', maxWidth: '500px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={onCreateScript}
                disabled={!title || isGeneratingScript}
                startIcon={
                  isGeneratingScript ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CreateIcon />
                  )
                }
                sx={{ mb: 2, width: '100%' }}
              >
                {isGeneratingScript
                  ? 'Generating Script...'
                  : 'Generate Script'}
              </Button>
            </span>
          </Tooltip>
        </Box>
      ) : (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Script Content
          </Typography>
          <TextField
            multiline
            fullWidth
            minRows={8}
            maxRows={16}
            value={localContent}
            onChange={handleLocalContentChange}
            sx={{ mb: 2 }}
          />

          {/* Fact Checked Content section */}
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip
                title={
                  isUpdatingScript ? 'Saving changes...' : 'Save your changes'
                }
              >
                <span>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleUpdateScript}
                    disabled={isUpdatingScript}
                    startIcon={
                      isUpdatingScript ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SaveIcon />
                      )
                    }
                  >
                    {isUpdatingScript ? 'Updating...' : 'Update Script'}
                  </Button>
                </span>
              </Tooltip>
            </Box>

            {/* Add the Proceed to Images button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleProceedToImages}
              disabled={isGeneratingScript || isUpdatingScript}
              endIcon={<NavigateNextIcon />}
            >
              Proceed to Images
            </Button>
          </Box>

          {/* Sources List - Always display if sources exist */}
          {hasSources && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <FactCheckIcon sx={{ mr: 1 }} /> Sources
              </Typography>
              <SourcesList sources={sources} />
            </>
          )}
        </>
      )}

      {/* Replace Snackbar with Dialog for reset confirmation */}
      <Dialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">
          Reset Flow Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            This will reset your entire flow and lose all changes. Are you sure
            you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmResetFlow} color="error" variant="contained">
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
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
