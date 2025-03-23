// src/components/media/ImageGallery.tsx
import React, { useEffect } from 'react'
import {
  Typography,
  CircularProgress,
  Box,
  Pagination,
  Button,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useImages } from '@hooks/useImages'
import ImageCard from './ImageCard'

const ImageGallery: React.FC = () => {
  const { images, loading, error, page, totalPages, loadImages } = useImages()

  useEffect(() => {
    // Only fetch images if there is no error (avoid auto-retry spam)
    if (!error) {
      loadImages(page, 10)
    }
    // page and loadImages are dependencies, error stops auto retry on error state
  }, [loadImages, page, error])

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
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h6" color="error">
          Oops! Failed to load images.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => loadImages(page, 10)}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box mt={4} className="bg-base-100 p-4 rounded-md shadow-sm">
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
