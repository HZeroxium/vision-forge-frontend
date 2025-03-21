// src/components/media/ImageGallery.tsx
import React, { useEffect } from 'react'
import { Typography, CircularProgress, Box, Pagination } from '@mui/material'
import Grid from '@mui/material/Grid2' // Updated to use Grid2 instead of deprecated Grid
import { useImages } from '@hooks/useImages'
import ImageCard from './ImageCard'

const ImageGallery: React.FC = () => {
  const { images, loading, error, page, totalPages, loadImages } = useImages()

  useEffect(() => {
    loadImages(page, 10)
  }, [loadImages, page])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    loadImages(value, 10)
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
        {images.map((img) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={img.id}>
            <ImageCard image={img} />
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

export default ImageGallery
