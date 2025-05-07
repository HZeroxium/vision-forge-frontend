// /src/components/flow/images/AddBlockDialog.tsx

'use client'
import React, { useState, ChangeEvent, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  Pagination,
  Chip,
  FormHelperText,
  Tooltip,
  Badge,
  Stack,
  useTheme,
} from '@mui/material'
import { Check as CheckIcon, Error as ErrorIcon } from '@mui/icons-material'
import { useImages } from '@hooks/useImages'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`add-block-tabpanel-${index}`}
      aria-labelledby={`add-block-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

interface AddBlockDialogProps {
  open: boolean
  onClose: () => void
  onAddBlock: (
    script: string,
    prompt: string,
    file: File | null,
    imageUrl?: string
  ) => Promise<void>
  isUploading: boolean
  error: string | null
}

const AddBlockDialog: React.FC<AddBlockDialogProps> = ({
  open,
  onClose,
  onAddBlock,
  isUploading,
  error,
}) => {
  const [script, setScript] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // Add validation state
  const [scriptError, setScriptError] = useState('')
  const [imageError, setImageError] = useState('')
  const [showValidation, setShowValidation] = useState(false)

  const theme = useTheme()

  // Extract userTotalPages from the hook
  const { userImages, userLoading, userTotalPages, loadUserImages } =
    useImages()

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setScript('')
      setPrompt('')
      setSelectedFile(null)
      setSelectedImageUrl(null)
      setTabValue(0)
      setCurrentPage(1)
      setScriptError('')
      setImageError('')
      setShowValidation(false)
    }
  }, [open])

  // Load user's images when dialog opens on "My Images" tab
  useEffect(() => {
    if (open && tabValue === 1) {
      loadUserImages(currentPage, 20) // Load images for the current page with pagination
    }
  }, [open, tabValue, loadUserImages, currentPage])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setSelectedFile(file)
      setSelectedImageUrl(null) // Clear selected existing image
      setImageError('') // Clear image error when file is selected

      // Update prompt with filename if empty
      if (!prompt) {
        const fileName = file.name.split('.')[0]
        setPrompt(fileName.replace(/-|_/g, ' '))
      }
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    // Reset to first page when switching to "My Images" tab
    if (newValue === 1) {
      setCurrentPage(1)
    }
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value)
  }

  const handleSelectExisting = (imageUrl: string) => {
    console.log('Image selected:', imageUrl) // Debug log
    setSelectedImageUrl(imageUrl)
    setSelectedFile(null) // Clear selected file
    setImageError('') // Clear image error when image is selected
  }

  const validateFields = () => {
    let isValid = true
    setShowValidation(true)

    if (!script.trim()) {
      setScriptError('Script is required')
      isValid = false
    } else {
      setScriptError('')
    }

    if (!selectedFile && !selectedImageUrl) {
      setImageError('An image is required')
      isValid = false
    } else {
      setImageError('')
    }

    return isValid
  }

  const handleAddBlock = async () => {
    if (!validateFields()) {
      return
    }

    // If an existing image was selected, pass it to the parent component
    if (selectedImageUrl) {
      await onAddBlock(script, prompt, null, selectedImageUrl)
    } else {
      await onAddBlock(script, prompt, selectedFile)
    }
    onClose()
  }

  const isAddButtonDisabled = () => {
    // Require script and either a file upload or an existing image selection
    return !script || (!selectedFile && !selectedImageUrl) || isUploading
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Block</DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Script *"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={script}
            onChange={(e) => {
              setScript(e.target.value)
              if (e.target.value.trim()) setScriptError('')
            }}
            error={!!scriptError && showValidation}
            helperText={showValidation && scriptError}
            required
          />

          <TextField
            margin="dense"
            label="Prompt (optional)"
            type="text"
            fullWidth
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle1"
            display="flex"
            alignItems="center"
            gutterBottom
          >
            Select Image *
            {showValidation && imageError && (
              <Chip
                icon={<ErrorIcon />}
                label={imageError}
                color="error"
                size="small"
                sx={{ ml: 2 }}
              />
            )}
            {(selectedFile || selectedImageUrl) && (
              <Chip
                icon={<CheckIcon />}
                label="Image selected"
                color="success"
                size="small"
                sx={{ ml: 2 }}
              />
            )}
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 1 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Upload New" />
              <Tab label="My Images" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                component="label"
                color={selectedFile ? 'success' : 'primary'}
                sx={{
                  mt: 2,
                  border: selectedFile
                    ? `2px solid ${theme.palette.success.main}`
                    : undefined,
                }}
              >
                {selectedFile ? 'Change Image File' : 'Choose Image File *'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>

              {selectedFile && (
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CheckIcon color="success" />
                  <Typography variant="body2">
                    Selected: {selectedFile.name} (
                    {Math.round(selectedFile.size / 1024)} KB)
                  </Typography>
                </Box>
              )}

              {!selectedFile &&
                showValidation &&
                imageError &&
                tabValue === 0 && (
                  <FormHelperText error>
                    Please select an image file
                  </FormHelperText>
                )}
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {userLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
              >
                <CircularProgress />
              </Box>
            ) : userImages.length > 0 ? (
              <>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {userImages.map((image) => (
                    <Grid item xs={6} sm={4} md={3} key={image.id}>
                      <Tooltip
                        title={image.prompt || 'Select this image'}
                        arrow
                      >
                        <Card
                          onClick={() => handleSelectExisting(image.url)}
                          sx={{
                            cursor: 'pointer',
                            borderWidth: 2,
                            borderStyle: 'solid',
                            borderColor:
                              selectedImageUrl === image.url
                                ? theme.palette.primary.main
                                : 'transparent',
                            boxShadow:
                              selectedImageUrl === image.url
                                ? `0 0 8px ${theme.palette.primary.main}`
                                : undefined,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            },
                            position: 'relative',
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="120"
                            image={image.url}
                            alt={image.prompt || 'User image'}
                            sx={{ objectFit: 'cover' }}
                          />

                          {selectedImageUrl === image.url && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'primary.main',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 1,
                              }}
                            >
                              <CheckIcon
                                fontSize="small"
                                sx={{ color: 'white' }}
                              />
                            </Box>
                          )}
                        </Card>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>

                {userTotalPages > 1 && (
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                      count={userTotalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="medium"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}

                {showValidation && imageError && tabValue === 1 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Please select an image from the gallery
                  </Alert>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary">
                  No images available. Upload some images first.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setTabValue(0)}
                  sx={{ mt: 2 }}
                >
                  Switch to upload
                </Button>
              </Box>
            )}
          </TabPanel>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAddBlock}
          variant="contained"
          color="primary"
          disabled={isUploading}
        >
          {isUploading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Add Block'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddBlockDialog
