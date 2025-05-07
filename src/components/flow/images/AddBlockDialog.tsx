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
} from '@mui/material'
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
    file: File | null
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

  // Use the images hook to access user images
  const { userImages, userLoading, loadUserImages } = useImages()

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setScript('')
      setPrompt('')
      setSelectedFile(null)
      setSelectedImageUrl(null)
      setTabValue(0)
    }
  }, [open])

  // Load user's images when dialog opens on "My Images" tab
  useEffect(() => {
    if (open && tabValue === 1) {
      loadUserImages(1, 20) // Load first page with 20 images
    }
  }, [open, tabValue, loadUserImages])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      setSelectedImageUrl(null) // Clear selected existing image
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSelectExisting = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl)
    setSelectedFile(null) // Clear selected file
  }

  const handleAddBlock = async () => {
    // If an existing image was selected, we'll pass null as the file
    // and handle the imageUrl in the parent component
    await onAddBlock(script, prompt, selectedFile)
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
        <TextField
          autoFocus
          margin="dense"
          label="Script"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Prompt (optional)"
          type="text"
          fullWidth
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">Select Image</Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 1 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Upload New" />
              <Tab label="My Images" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Choose Image File
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {selectedFile.name} (
                {Math.round(selectedFile.size / 1024)} KB)
              </Typography>
            )}
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
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {userImages.map((image) => (
                  <Grid item xs={6} sm={4} md={3} key={image.id}>
                    <Card
                      sx={{
                        border:
                          selectedImageUrl === image.url
                            ? '2px solid #1976d2'
                            : 'none',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.05)' },
                      }}
                    >
                      <CardActionArea
                        onClick={() => handleSelectExisting(image.url)}
                      >
                        <CardMedia
                          component="img"
                          height="120"
                          image={image.url}
                          alt={image.prompt || 'User image'}
                        />
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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
          disabled={isAddButtonDisabled()}
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
