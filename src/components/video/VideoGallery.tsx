// src/components/video/VideoGallery.tsx
import React, { useEffect } from 'react'
import {
  Typography,
  CircularProgress,
  Box,
  Pagination,
  Button,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useVideos } from '@hooks/useVideos'
import VideoCard from './VideoCard'

const VideoGallery: React.FC = () => {
  const { videos, loading, error, page, totalPages, loadVideos } = useVideos()

  // Load videos when the component mounts or when page changes
  useEffect(() => {
    // Only fetch videos if there is no error to prevent auto-retry spam
    if (!error) {
      loadVideos(page, 10)
    }
  }, [loadVideos, page, error])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    loadVideos(value, 10)
  }

  // Handle delete button (to be implemented)
  const handleDelete = (id: string) => {
    // Implement deletion logic, e.g., dispatch a deleteVideoAsync action
    console.log('Delete video with ID:', id)
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
          Oops! Failed to load images.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => loadVideos(page, 10)}
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
        {videos.map((video) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.id}>
            <VideoCard video={video} onDelete={handleDelete} />
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

export default VideoGallery
