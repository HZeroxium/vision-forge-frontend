'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material'
import { ArrowBack, Save, Cancel } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useScripts } from '@/hooks/useScripts'
import { ContentStyleOption } from '@/app/flow/generate-video/page'

const MotionPaper = motion(Paper)
const MotionButton = motion(Button)

const contentStyleOptions: ContentStyleOption[] = [
  { displayValue: 'default', backendValue: 'phổ thông', label: 'Default' },
  { displayValue: 'child', backendValue: 'trẻ em', label: 'Child-Friendly' },
  { displayValue: 'in-depth', backendValue: 'chuyên gia', label: 'In-Depth' },
]

// Function to get display value from backend value
const getDisplayValue = (backendValue: string): string => {
  const option = contentStyleOptions.find(
    (opt) => opt.backendValue === backendValue
  )
  return option?.displayValue || backendValue
}

// Function to get backend value from display value
const getBackendValue = (displayValue: string): string => {
  const option = contentStyleOptions.find(
    (opt) => opt.displayValue === displayValue
  )
  return option?.backendValue || displayValue
}

export default function EditScriptPage() {
  const params = useParams()
  const router = useRouter()
  const scriptId = Array.isArray(params.id) ? params.id[0] : params.id

  const { script, loading, error, fetchScript, updateScript } = useScripts()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [style, setStyle] = useState('default')
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (scriptId) {
      fetchScript(scriptId)
    }
  }, [fetchScript, scriptId])

  useEffect(() => {
    if (script) {
      setTitle(script.title)
      setContent(script.content || '')
      setStyle(script.style ? getDisplayValue(script.style) : 'default')
    }
  }, [script])

  const handleBack = () => {
    router.back()
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setSaveError('Title is required')
      return
    }

    if (!scriptId) {
      setSaveError('Script ID is missing')
      return
    }

    try {
      setSaveLoading(true)
      setSaveError(null)

      await updateScript(scriptId, {
        title: title.trim(),
        content,
        style: getBackendValue(style),
      })

      setSaveSuccess(true)
      setTimeout(() => {
        router.push(`/scripts/${scriptId}`)
      }, 1000)
    } catch (error) {
      console.error('Failed to update script:', error)
      setSaveError('Failed to update script')
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading && !script) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={handleBack} startIcon={<ArrowBack />}>
          Go Back
        </Button>
      </Container>
    )
  }

  if (!script && !loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Script not found
        </Alert>
        <Button onClick={handleBack} startIcon={<ArrowBack />}>
          Go Back
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Edit Script
        </Typography>
      </Box>

      {saveError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setSaveError(null)}
        >
          {saveError}
        </Alert>
      )}

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Script saved successfully! Redirecting...
        </Alert>
      )}

      <MotionPaper
        elevation={3}
        sx={{ p: 3, borderRadius: 2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            error={saveError === 'Title is required'}
            helperText={
              saveError === 'Title is required' ? 'Title is required' : ''
            }
          />

          <FormControl fullWidth>
            <InputLabel id="style-label">Content Style</InputLabel>
            <Select
              labelId="style-label"
              value={style}
              label="Content Style"
              onChange={(e) => setStyle(e.target.value)}
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

          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={10}
          />

          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}
          >
            <MotionButton
              variant="outlined"
              color="inherit"
              startIcon={<Cancel />}
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </MotionButton>

            <MotionButton
              variant="contained"
              color="primary"
              startIcon={
                saveLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Save />
                )
              }
              onClick={handleSave}
              disabled={saveLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Changes
            </MotionButton>
          </Box>
        </Box>
      </MotionPaper>
    </Container>
  )
}
