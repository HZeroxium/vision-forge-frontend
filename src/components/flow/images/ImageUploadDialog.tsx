'use client'
import React, { ChangeEvent, useState } from 'react'
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
} from '@mui/material'

interface ImageUploadDialogProps {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
  error: string | null
  uploadProgress: number
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  onUpload,
  isUploading,
  error,
  uploadProgress,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile)
    }
  }

  // Reset selected file when dialog closes
  const handleClose = () => {
    setSelectedFile(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Upload Custom Image</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Replace Image'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImageUploadDialog
