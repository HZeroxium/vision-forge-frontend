// src/app/media/images/page.tsx
'use client'
import React from 'react'
import { Container, Typography, Box, Paper, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Add } from '@mui/icons-material'
import ImageGallery from '@/components/media/ImageGallery'
import { fadeIn } from '@/utils/animations'

const MotionTypography = motion(Typography)
const MotionBox = motion(Box)
const MotionPaper = motion(Paper)
const MotionButton = motion(Button)

export default function ImagesPage() {
  const router = useRouter()

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
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Box sx={{ maxWidth: { xs: '100%', md: '70%' } }}>
            <MotionTypography
              variant="h4"
              gutterBottom
              fontWeight="bold"
              color="primary"
              textAlign={{ xs: 'center', md: 'left' }}
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
              My Image Gallery
            </MotionTypography>

            <MotionTypography
              variant="h6"
              color="text.secondary"
              textAlign={{ xs: 'center', md: 'left' }}
              sx={{
                maxWidth: 800,
                mb: { xs: 3, md: 0 },
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
              Browse through your AI-generated images created with Vision Forge
            </MotionTypography>
          </Box>

          <MotionButton
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => router.push('/flow/generate-image')}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 2,
              minWidth: 180,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.2 },
              },
            }}
          >
            Create New Image
          </MotionButton>
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
          <ImageGallery mode="user" />
        </MotionPaper>
      </MotionBox>
    </Container>
  )
}
