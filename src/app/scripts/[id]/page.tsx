'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Alert,
  IconButton,
} from '@mui/material'
import {
  ArrowBack,
  Edit,
  Delete,
  Description,
  FormatQuote,
  Code,
  Info,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useScripts } from '@/hooks/useScripts'
import { format } from 'date-fns'
import { Source } from '@/services/scriptsService'
import SourcesList from '@/components/flow/SourcesList'

const MotionPaper = motion(Paper)
const MotionBox = motion(Box)
const MotionButton = motion(Button)

export default function ScriptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const scriptId = Array.isArray(params.id) ? params.id[0] : params.id

  const { script, loading, error, fetchScript, deleteScript } = useScripts()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (scriptId) {
      fetchScript(scriptId)
    }
  }, [fetchScript, scriptId])

  const handleBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/scripts/edit/${scriptId}`)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this script?') && scriptId) {
      try {
        setDeleteLoading(true)
        await deleteScript(scriptId)
        router.push('/my-scripts')
      } catch (error) {
        setDeleteError('Failed to delete script')
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMMM dd, yyyy HH:mm')
  }

  if (loading) {
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

  if (!script) {
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

  const hasSources = script.sources && script.sources.length > 0

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
          >
            Back
          </Button>

          <Box>
            <MotionButton
              variant="outlined"
              color="primary"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ mr: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit
            </MotionButton>

            <MotionButton
              variant="outlined"
              color="error"
              startIcon={
                deleteLoading ? <CircularProgress size={20} /> : <Delete />
              }
              onClick={handleDelete}
              disabled={deleteLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete
            </MotionButton>
          </Box>
        </Box>

        {deleteError && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setDeleteError(null)}
          >
            {deleteError}
          </Alert>
        )}

        <MotionPaper
          elevation={2}
          sx={{ p: 3, mb: 3, borderRadius: 2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Description sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h4" component="h1">
              {script.title}
            </Typography>
          </Box>

          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              size="small"
              label={`Style: ${script.style || 'Default'}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              size="small"
              label={`Language: ${script.language || 'Unknown'}`}
              color="secondary"
              variant="outlined"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Created: {formatDate(script.createdAt)}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last updated: {formatDate(script.updatedAt)}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="subtitle1"
            sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
          >
            <FormatQuote sx={{ mr: 1, transform: 'rotate(180deg)' }} /> Content
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              my: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.02)',
              whiteSpace: 'pre-wrap',
            }}
          >
            <Typography variant="body1">
              {script.content || 'No content available'}
            </Typography>
          </Paper>

          {hasSources && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                >
                  <Info sx={{ mr: 1 }} /> Sources
                </Typography>
                <SourcesList sources={script.sources as Source[]} />
              </Box>
            </>
          )}
        </MotionPaper>
      </MotionBox>
    </Container>
  )
}
