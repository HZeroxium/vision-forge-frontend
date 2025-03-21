// src/app/audios/page.tsx
'use client'
import React from 'react'
import { Container, Typography } from '@mui/material'
import AudioGallery from '@components/media/AudioGallery'

export default function AudiosPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Audio Library
      </Typography>
      <AudioGallery />
    </Container>
  )
}
