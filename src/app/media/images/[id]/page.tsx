// src/app/images/[id]/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material'
import { fetchImage } from '@/services/imagesService'
import type { Image } from '@/services/imagesService'

export default function ImageDetailPage() {
  const { id } = useParams() // Retrieve image id from URL
  const router = useRouter()
  const [image, setImage] = useState<Image | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    // Fetch image details using the provided id
    fetchImage(Array.isArray(id) ? id[0] : id)
      .then((data) => {
        setImage(data)
        setError(null)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch image detail')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // Navigate back to the gallery page
  const handleBack = () => {
    router.push('/media/images')
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="outlined" onClick={handleBack}>
          Back to Gallery
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        onClick={handleBack}
        sx={{ mb: 2 }}
        className="hover:shadow-md transition-all"
      >
        Back to Gallery
      </Button>
      {image && (
        <Card
          sx={{
            transition: 'box-shadow 0.2s ease',
            '&:hover': {
              boxShadow: 6,
            },
          }}
          className="bg-base-100"
        >
          <CardMedia component="img" image={image.url} alt={image.prompt} />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {image.prompt}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Style: {image.style}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Created at: {new Date(image.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}
