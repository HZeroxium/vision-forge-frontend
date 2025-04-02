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
        {/* Header Section */}
        <MotionPaper
          variants={fadeIn}
          elevation={0}
          sx={{
            mb: 4,
            pt: { xs: 6, md: 7 },
            pb: { xs: 6, md: 7 },
            px: { xs: 3, md: 5 },
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 40%, ${theme.palette.primary.light} 100%)`,
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Animated dots background */}
          <Box
            component={motion.div}
            animate={{
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '25px 25px',
              zIndex: 0,
            }}
          />

          <Grid container alignItems="center" spacing={3}>
            <Grid xs={12} md={7} sx={{ position: 'relative', zIndex: 1 }}>
              <MotionBox
                sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Headphones sx={{ mr: 1, fontSize: 30 }} />
                <MotionTypography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                  Audio Library
                </MotionTypography>
              </MotionBox>

              <MotionTypography
                variant="h6"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  maxWidth: 600,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0.9 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Browse and manage your AI-generated audio collection for use in
                your projects
              </MotionTypography>

              <MotionBox
                display="flex"
                gap={2}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    color: 'white',
                    px: 3,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                    },
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate New Audio
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    px: 3,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upload Audio
                </Button>
              </MotionBox>
            </Grid>

            <Grid
              xs={12}
              md={5}
              sx={{
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Animated equalizer bars */}
                <MotionBox
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: 1,
                    height: 50,
                  }}
                >
                  {audioEqualizerAnimation.bars.map((bar, i) => (
                    <MotionBox
                      key={i}
                      initial={bar.initial}
                      animate={bar.animate}
                      sx={{
                        width: 6,
                        backgroundColor: 'white',
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </MotionBox>

                <MotionBox
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(255,255,255,0.4)',
                      '0 0 0 20px rgba(255,255,255,0.0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              </MotionBox>
            </Grid>
          </Grid>
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
              <Grid xs={12} md={4} key={i}>
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

        {/* Gallery Section */}
        <MotionPaper
          variants={fadeIn}
          elevation={2}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            backgroundColor: 'background.paper',
          }}
        >
          <AudioGallery />
        </MotionPaper>
      </MotionBox>
    </Container>
  )
}
