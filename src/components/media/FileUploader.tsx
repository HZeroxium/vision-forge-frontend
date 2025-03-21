// src/components/media/FileUploader.tsx
// src/components/upload/FileUploader.tsx
import React, { useState, ChangeEvent } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { uploadFile } from '@services/uploadService'

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setMessage('')
    try {
      await onUpload(selectedFile)
      setMessage('File uploaded successfully.')
    } catch (error: any) {
      setMessage('File upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload-input"
      />
      <label htmlFor="file-upload-input">
        <Button variant="outlined" component="span">
          Choose File
        </Button>
      </label>
      {selectedFile && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          {selectedFile.name}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>
      {message && (
        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
    </Box>
  )
}

export default FileUploader
