'use client'
import React, { ChangeEvent, useRef, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Alert,
} from '@mui/material'

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
  const [newBlockScript, setNewBlockScript] = useState<string>('')
  const [newBlockPrompt, setNewBlockPrompt] = useState<string>('')
  const [newBlockFile, setNewBlockFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewBlockFile(event.target.files[0])
    }
  }

  const handleAddBlock = async () => {
    await onAddBlock(newBlockScript, newBlockPrompt, newBlockFile)
  }

  // Reset form when dialog closes
  const handleClose = () => {
    setNewBlockScript('')
    setNewBlockPrompt('')
    setNewBlockFile(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Block</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Image (Optional)
          </Typography>

          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            Choose Image File
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </Button>

          {newBlockFile && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected: {newBlockFile.name} (
              {Math.round(newBlockFile.size / 1024)} KB)
            </Typography>
          )}

          <TextField
            label="Prompt (Optional)"
            multiline
            rows={2}
            fullWidth
            value={newBlockPrompt}
            onChange={(e) => setNewBlockPrompt(e.target.value)}
            sx={{ mb: 3 }}
            helperText="A description of the image content"
          />

          <TextField
            label="Script"
            multiline
            rows={4}
            fullWidth
            value={newBlockScript}
            onChange={(e) => setNewBlockScript(e.target.value)}
            required
            helperText="The narration script for this block"
          />

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
          onClick={handleAddBlock}
          variant="contained"
          color="primary"
          disabled={!newBlockScript || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Add Block'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddBlockDialog
