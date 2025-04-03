'use client'
import React from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material'
import { motion } from 'framer-motion'
import VideoGallery from '@components/video/VideoGallery'
import { fadeIn } from '@/utils/animations'
import {
  Videocam,
  MovieCreation,
  VideoLibrary,
  AddCircleOutline,
  Upload,
} from '@mui/icons-material'
import Grid from '@mui/material/Grid2'

const MotionTypography = motion(Typography)
const MotionBox = motion(Box)
const MotionPaper = motion(Paper)

export default function VideosPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const iconMotion = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 300, damping: 20 },
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
            background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.secondary.light} 100%)`,
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Animated background pattern */}
          <Box
            component={motion.div}
            animate={{
              opacity: [0.07, 0.1, 0.07],
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
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: '30px 30px',
              zIndex: 0,
            }}
          />

          <Grid container alignItems="center" spacing={3}>
            <Grid
              size={{ xs: 12, md: 7 }}
              sx={{ position: 'relative', zIndex: 1 }}
            >
              <MotionBox
                sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <MovieCreation sx={{ mr: 1, fontSize: 30 }} />
                <MotionTypography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                  Video Library
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
                Your AI-generated videos collection - browse, manage, and use
                them in your projects
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
                  color="primary"
                  startIcon={<AddCircleOutline />}
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
                  Create New Video
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
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
                  Upload Video
                </Button>
              </MotionBox>
            </Grid>

            <Grid
              size={{ xs: 12, md: 5 }}
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
                  width: 240,
                  height: 240,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Animated video frame */}
                <MotionBox
                  initial={{ scale: 0.9, opacity: 0.7 }}
                  animate={{
                    scale: [0.9, 1, 0.9],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <MovieCreation
                    sx={{
                      fontSize: 60,
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  />

                  {/* Video play indicator */}
                  <MotionBox
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      backgroundColor: theme.palette.primary.main,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
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
                icon: <Videocam />,
                title: 'HD Quality',
                desc: 'Crisp, high-definition videos for all your needs',
              },
              {
                icon: <VideoLibrary />,
                title: 'Easy Management',
                desc: 'Organize and find your videos effortlessly',
              },
              {
                icon: <MovieCreation />,
                title: 'AI Generation',
                desc: 'Create stunning videos with our AI technology',
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
                      backgroundColor: `${theme.palette.secondary.main}15`,
                      color: theme.palette.secondary.main,
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
          <VideoGallery />
        </MotionPaper>
      </MotionBox>
    </Container>
  )
}
