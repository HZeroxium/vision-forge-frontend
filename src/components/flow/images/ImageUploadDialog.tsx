'use client'
import React, { ChangeEvent, useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  CircularProgress,
  Divider,
  useTheme,
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
      id={`image-upload-tabpanel-${index}`}
      aria-labelledby={`image-upload-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

interface ImageUploadDialogProps {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<void>
  onSelectExisting?: (imageUrl: string) => void
  isUploading: boolean
  error: string | null
  uploadProgress: number
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  onUpload,
  onSelectExisting,
  isUploading,
  error,
  uploadProgress,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const theme = useTheme()

  // Use the images hook to access user images
  const { userImages, userLoading, loadUserImages } = useImages()

  // Load user's images when dialog opens on "My Images" tab
  useEffect(() => {
    if (open && tabValue === 1) {
      loadUserImages(1, 20) // Load first page with 20 images
    }
  }, [open, tabValue, loadUserImages])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile)
    }
  }

  const handleSelectExisting = (imageUrl: string) => {
    if (onSelectExisting) {
      onSelectExisting(imageUrl)
      onClose()
    }
  }

  // Reset selected file when dialog closes
  const handleClose = () => {
    setSelectedFile(null)
    setTabValue(0)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Select or Upload Image</DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Upload New" />
          <Tab label="My Images" />
        </Tabs>
      </Box>

      <DialogContent>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
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
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected: {selectedFile.name} (
                {Math.round(selectedFile.size / 1024)} KB)
              </Typography>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Uploading: {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {userLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={300}
            >
              <CircularProgress />
            </Box>
          ) : userImages.length > 0 ? (
            <Grid container spacing={2}>
              {userImages.map((image) => (
                <Grid item xs={6} sm={4} md={3} key={image.id}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleSelectExisting(image.url)}
                      sx={{ height: '100%' }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={image.url}
                        alt={image.prompt || 'Image'}
                        sx={{ objectFit: 'cover' }}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight={300}
              gap={2}
            >
              <Typography color="text.secondary">
                You don't have any images yet.
              </Typography>
              <Button variant="outlined" onClick={() => setTabValue(0)}>
                Upload your first image
              </Button>
            </Box>
          )}
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {tabValue === 0 && (
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ImageUploadDialog
