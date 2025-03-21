// src/app/images/page.tsx
'use client'
import React from 'react'
import { Container, Typography } from '@mui/material'
import ImageGallery from '../../components/media/ImageGallery'

export default function ImagesPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Image Gallery
      </Typography>
      <ImageGallery />
    </Container>
  )
}
