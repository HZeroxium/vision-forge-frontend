// src/app/media/audio/[id]/page.tsx
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
  CardContent,
  CardActions,
  CardMedia,
} from '@mui/material'
import { fetchAudio } from '@services/audiosService'
import type { Audio } from '@services/audiosService'

export default function AudioDetailPage() {
  const { id } = useParams() // Get audio id from the URL
  const router = useRouter()
  const [audio, setAudio] = useState<Audio | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    // Fetch audio details using the provided id
    fetchAudio(Array.isArray(id) ? id[0] : id)
      .then((data) => {
        setAudio(data)
        setError(null)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch audio detail')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // Navigate back to the audios list page
  const handleBack = () => {
    router.push('/media/audios')
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
          Back to Audio Library
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
        Back to Audio Library
      </Button>
      {audio && (
        <Card
          sx={{
            transition: 'box-shadow 0.2s ease',
            '&:hover': { boxShadow: 6 },
          }}
          className="bg-base-100"
        >
          {/* Optionally, if you want to display a cover image: */}
          {audio.url && (
            <CardMedia
              component="img"
              image="images/logo.webp" // In case audio provider also has a cover image URL; otherwise, remove this block
              alt={audio.provider}
              sx={{ display: 'none' }} // Hide if not needed
            />
          )}
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Provider: {audio.provider}
            </Typography>
            <Typography variant="body1">
              Duration: {audio.durationSeconds} sec
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Script: {audio.script}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 1 }}
            >
              Created at: {new Date(audio.createdAt).toLocaleString()}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Updated at: {new Date(audio.updatedAt).toLocaleString()}
            </Typography>
            {/* CHANGED START: Embedded inline audio player */}
            <Box sx={{ mt: 2 }}>
              <audio controls style={{ width: '100%' }}>
                <source src={audio.url} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </Box>
            {/* CHANGED END */}
          </CardContent>
          {/* Optionally, you may add CardActions for additional controls */}
        </Card>
      )}
    </Container>
  )
}
