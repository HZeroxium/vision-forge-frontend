'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Button,
  Pagination,
  CircularProgress,
  Grid,
  Divider,
  IconButton,
  Alert,
  Chip,
} from '@mui/material'
import { Delete, Edit, Visibility, Description } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useScripts } from '@/hooks/useScripts'
import { format } from 'date-fns'

const MotionPaper = motion(Paper)
const MotionCard = motion(Card)

export default function AllScriptsPage() {
  const router = useRouter()
  const {
    scripts,
    scriptsLoading,
    scriptsError,
    scriptsPage,
    scriptsLimit,
    scriptsTotalPages,
    fetchScripts,
    deleteScript,
  } = useScripts()

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    fetchScripts(scriptsPage, scriptsLimit)
  }, [fetchScripts, scriptsPage, scriptsLimit])

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    fetchScripts(value, scriptsLimit)
  }

  const handleViewScript = (id: string) => {
    router.push(`/scripts/${id}`)
  }

  const handleEditScript = (id: string) => {
    router.push(`/scripts/edit/${id}`)
  }

  const handleDeleteScript = async (id: string) => {
    try {
      setDeleteLoading(id)
      await deleteScript(id)
      // Refresh the current page
      fetchScripts(scriptsPage, scriptsLimit)
    } catch (error) {
      setDeleteError('Failed to delete script')
      console.error('Delete script error:', error)
    } finally {
      setDeleteLoading(null)
    }
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy HH:mm')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          All Scripts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/flow/generate-video')}
        >
          Create New Script
        </Button>
      </Box>

      {deleteError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setDeleteError(null)}
        >
          {deleteError}
        </Alert>
      )}

      {scriptsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {scriptsError}
        </Alert>
      )}

      {scriptsLoading && scripts.length === 0 ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : scripts.length > 0 ? (
        <Grid container spacing={3}>
          {scripts.map((script) => (
            <Grid item xs={12} key={script.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                variant="outlined"
                sx={{ position: 'relative' }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {script.title}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          size="small"
                          label={script.style || 'Default Style'}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={script.language || 'Unknown Language'}
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Created: {formatDate(script.createdAt)}
                      </Typography>

                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          maxWidth: '90%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {script.content || 'No content available'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex' }}>
                      <IconButton onClick={() => handleViewScript(script.id)}>
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => handleEditScript(script.id)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteScript(script.id)}
                        disabled={deleteLoading === script.id}
                      >
                        {deleteLoading === script.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Delete />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Description
            sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }}
          />
          <Typography variant="h6">No Scripts Found</Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first script to get started
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push('/flow/generate-video')}
          >
            Create Script
          </Button>
        </Paper>
      )}

      {scriptsTotalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={scriptsTotalPages}
            page={scriptsPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  )
}
