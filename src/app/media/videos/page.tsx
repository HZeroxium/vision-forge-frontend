// src/app/videos/page.tsx
'use client'
import React from 'react'
import { Container, Typography } from '@mui/material'
import VideoGallery from '@components/video/VideoGallery'

export default function VideosPage() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        py: 2,
        borderRadius: 2,
        backgroundColor: 'var(--tw-prose-bg, theme(colors.base-100))',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Video Library
      </Typography>
      <VideoGallery />
    </Container>
  )
}
