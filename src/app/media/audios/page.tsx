// src/app/media/audios/page.tsx
'use client'
import React from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material'
import { motion } from 'framer-motion'
import AudioGallery from '@components/media/AudioGallery'
import { fadeIn } from '@/utils/animations'
import { useRouter } from 'next/navigation'
import {
  Audiotrack,
  GraphicEq,
  VolumeUp,
  Headphones,
} from '@mui/icons-material'
import Grid from '@mui/material/Grid2'

const MotionTypography = motion(Typography)
const MotionBox = motion(Box)
const MotionPaper = motion(Paper)
const MotionDivider = motion(Divider)

export default function AudiosPage() {
  const theme = useTheme()
  const router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const iconMotion = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  }

  const audioEqualizerAnimation = {
    bars: [
      {
        initial: { height: 15 },
        animate: {
          height: [15, 40, 20, 35, 15],
          transition: {
            repeat: Infinity,
            duration: 1.4,
            ease: 'easeInOut',
            delay: 0.2,
          },
        },
      },
      {
        initial: { height: 30 },
        animate: {
          height: [30, 10, 25, 15, 30],
          transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
            delay: 0,
          },
        },
      },
      {
        initial: { height: 20 },
        animate: {
          height: [20, 30, 10, 40, 20],
          transition: {
            repeat: Infinity,
            duration: 1.3,
            ease: 'easeInOut',
            delay: 0.1,
          },
        },
      },
      {
        initial: { height: 25 },
        animate: {
          height: [25, 15, 35, 20, 25],
          transition: {
            repeat: Infinity,
            duration: 1.7,
            ease: 'easeInOut',
            delay: 0.15,
          },
        },
      },
      {
        initial: { height: 10 },
        animate: {
          height: [10, 20, 15, 30, 10],
          transition: {
            repeat: Infinity,
            duration: 1.6,
            ease: 'easeInOut',
            delay: 0.05,
          },
        },
      },
    ],
  }

  const handleNavigateToGenerate = () => {
    router.push('/flow/generate-audio')
  }

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
              My Audio Library
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
              Browse through your AI-generated audio files created with Vision
              Forge
            </MotionTypography>
          </Box>

          <MotionBox
            display="flex"
            gap={2}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleNavigateToGenerate}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 2,
                minWidth: 180,
              }}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate New Audio
            </Button>
          </MotionBox>
        </MotionPaper>

        {/* Features Highlight */}
        <MotionBox
          variants={fadeIn}
          sx={{
            mb: 4,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Grid container spacing={3}>
            {[
              {
                icon: <Audiotrack />,
                title: 'Text-to-Speech',
                desc: 'Generate natural sounding audio from text',
              },
              {
                icon: <GraphicEq />,
                title: 'Multiple Voices',
                desc: 'Choose from a variety of voice styles and languages',
              },
              {
                icon: <VolumeUp />,
                title: 'High Quality',
                desc: 'Professional-grade audio for all your projects',
              },
            ].map((feature, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <MotionPaper
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 3,
                    boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                    background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                  }}
                >
                  <MotionBox
                    {...iconMotion}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: `${theme.palette.primary.main}15`,
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </MotionBox>
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </MotionBox>

        {/* Gallery Section - Using 'user' mode to show only the current user's audios */}
        <MotionPaper
          variants={fadeIn}
          elevation={2}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            backgroundColor: 'background.paper',
          }}
        >
          <AudioGallery mode="user" />
        </MotionPaper>
      </MotionBox>
    </Container>
  )
}
