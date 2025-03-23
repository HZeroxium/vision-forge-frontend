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
    router.push('/media/videos')
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
      <Button
        variant="outlined"
        onClick={handleBack}
        sx={{ mb: 2 }}
        className="hover:shadow-md transition-all"
      >
        Back to Video Library
      </Button>
      {video && (
        <Card
          sx={{
            transition: 'box-shadow 0.2s ease',
            '&:hover': { boxShadow: 6 },
          }}
          className="bg-base-100"
        >
          {/* CHANGED START: Embed inline video player in detail page */}
          {video.url ? (
            <Box sx={{ position: 'relative', height: 0, paddingTop: '56.25%' }}>
              <video
                controls
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          ) : (
            <Box sx={{ height: 300, backgroundColor: '#000' }} />
          )}
          {/* CHANGED END */}
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
            {/* Optionally, additional actions can be added here */}
          </CardActions>
        </Card>
      )}
    </Container>
  )
}
