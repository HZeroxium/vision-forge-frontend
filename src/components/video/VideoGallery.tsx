// src/components/video/VideoGallery.tsx
import React, { useEffect } from 'react'
import { Typography, CircularProgress, Box, Pagination } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useVideos } from '@hooks/useVideos'
import VideoCard from './VideoCard'

const VideoGallery: React.FC = () => {
  const { videos, loading, error, page, totalPages, loadVideos } = useVideos()

  // Load videos when the component mounts or when page changes
  useEffect(() => {
    loadVideos(page, 10)
  }, [loadVideos, page])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    loadVideos(value, 10)
  }

  // Handle preview button – open video URL in a new window or modal
  const handlePreview = (url?: string) => {
    if (url) {
      window.open(url, '_blank')
    }
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
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    )
  }

  return (
    <Box mt={4}>
      <Grid container spacing={2}>
        {videos.map((video) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.id}>
            <VideoCard
              video={video}
              onPreview={handlePreview}
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

export default VideoGallery
