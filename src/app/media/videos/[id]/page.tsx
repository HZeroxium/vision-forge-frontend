// src/app/videos/[id]/page.tsx
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
  CardActions,
} from '@mui/material'
import { fetchVideo } from '@services/videoService'
import type { Video } from '@services/videoService'

export default function VideoDetailPage() {
  const { id } = useParams() // Get video ID from the URL
  const router = useRouter()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    // Fetch video details using the provided id
    fetchVideo(Array.isArray(id) ? id[0] : id)
      .then((data) => {
        setVideo(data)
        setError(null)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch video detail')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // Navigate back to the video library page
  const handleBack = () => {
    router.push('/videos')
  }

  // Handle preview – open video URL in a new window (or later open in modal)
  const handlePreview = () => {
    if (video?.url) {
      window.open(video.url, '_blank')
    }
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
          Back to Video Library
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
        Back to Video Library
      </Button>
      {video && (
        <Card>
          {video.thumbnailUrl ? (
            <CardMedia
              component="img"
              image={video.thumbnailUrl}
              alt="Video Thumbnail"
              sx={{ height: 300 }}
            />
          ) : (
            <CardMedia
              component="img"
              image="/images/banner.webp" // Fallback image
              alt="Placeholder Thumbnail"
              sx={{ height: 300 }}
            />
          )}
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Video ID: {video.id}
            </Typography>
            <Typography variant="body1">Status: {video.status}</Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              Created: {new Date(video.createdAt).toLocaleString()}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              Updated: {new Date(video.updatedAt).toLocaleString()}
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={handlePreview}>
              Preview Video
            </Button>
          </CardActions>
        </Card>
      )}
    </Container>
  )
}
