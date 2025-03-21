// src/components/media/AudioGallery.tsx
import React, { useEffect } from 'react'
import {
  Grid,
  Typography,
  CircularProgress,
  Box,
  Pagination,
} from '@mui/material'
import { useAudios } from '@hooks/useAudios'
import AudioCard from './AudioCard'

const AudioGallery: React.FC = () => {
  const { audios, loading, error, page, totalPages, loadAudios } = useAudios()

  // Load audios when the component mounts
  useEffect(() => {
    loadAudios(page, 10)
  }, [loadAudios, page])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    loadAudios(value, 10)
  }

  // Optional: Handle play audio function (e.g., open a modal with an audio player)
  const handlePlay = (url: string) => {
    window.open(url, '_blank')
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
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    )
  }

  return (
    <Box mt={4}>
      <Grid container spacing={2}>
        {audios.map((audio) => (
          <Grid item xs={12} sm={6} md={4} key={audio.id}>
            <AudioCard
              audio={audio}
              onPlay={handlePlay}
              onDelete={handleDelete}
            />
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
