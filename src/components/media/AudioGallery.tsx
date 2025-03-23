// src/components/media/AudioGallery.tsx
import React, { useEffect } from 'react'
import {
  Typography,
  CircularProgress,
  Box,
  Pagination,
  Button,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useAudios } from '@hooks/useAudios'
import AudioCard from './AudioCard'

const AudioGallery: React.FC = () => {
  const { audios, loading, error, page, totalPages, loadAudios } = useAudios()

  // Load audios when the component mounts
  useEffect(() => {
    // Only fetch audios if there is no error to prevent auto-retry spam
    if (!error) {
      loadAudios(page, 10)
    }
  }, [loadAudios, page, error])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    loadAudios(value, 10)
  }

  // Optional: Handle delete audio (dispatch a delete action here)
  const handleDelete = (id: string) => {
    // Implement deletion logic (e.g., dispatch deleteAudioAsync)
    console.log('Delete audio with id:', id)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h6" color="error">
          Oops! Failed to load audios.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => loadAudios(page, 10)}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box mt={4}>
      <Grid container spacing={2}>
        {audios.map((audio) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={audio.id}>
            <AudioCard audio={audio} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  )
}

export default AudioGallery
