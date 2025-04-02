// src/app/media/images/page.tsx
'use client'
import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import ImageGallery from '@components/media/ImageGallery'
import { fadeIn } from '@/utils/animations'

const MotionTypography = motion(Typography)
const MotionBox = motion(Box)
const MotionPaper = motion(Paper)

export default function ImagesPage() {
  return (
    <Container maxWidth="xl" sx={{ pt: 4, pb: 6 }}>
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <MotionPaper
          variants={fadeIn}
          elevation={0}
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e9f0f6 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <MotionTypography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary"
            textAlign="center"
            sx={{ mb: 2 }}
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6 },
              },
            }}
          >
            AI-Generated Image Gallery
          </MotionTypography>

          <MotionTypography
            variant="h6"
            color="text.secondary"
            textAlign="center"
            sx={{
              maxWidth: 800,
              mb: 2,
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.1 },
              },
            }}
          >
            Browse through our collection of AI-generated images created with
            Vision Forge
          </MotionTypography>
        </MotionPaper>

        <MotionPaper
          variants={fadeIn}
          elevation={2}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            backgroundColor: 'background.paper',
          }}
        >
          <ImageGallery />
        </MotionPaper>
      </MotionBox>
    </Container>
  )
}
