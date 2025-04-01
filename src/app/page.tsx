'use client'
import React, { useEffect } from 'react'
import DashboardLayout from '@layouts/DashboardLayout'
import {
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  MovieCreation,
  Speed,
  AutoAwesome,
  Devices,
  KeyboardArrowDown,
  VideoLibrary,
  Create,
  CloudUpload,
  PlayArrow,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

// Animate components with framer-motion
const MotionBox = motion(Box)
const MotionTypography = motion(Typography)
const MotionButton = motion(Button)
const MotionGrid = motion(Grid)
const MotionCard = motion(Card)

export default function HomePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const features = [
    {
      title: 'AI-Powered Script Creation',
      description:
        'Create compelling video scripts in seconds with our advanced AI technology.',
      icon: <Create fontSize="large" color="primary" />,
      delay: 0.2,
    },
    {
      title: 'Professional Visuals',
      description:
        'Generate beautiful, on-brand visuals that perfectly match your content.',
      icon: <AutoAwesome fontSize="large" color="primary" />,
      delay: 0.4,
    },
    {
      title: 'Fast Rendering',
      description:
        'Our optimized rendering pipeline produces high-quality videos in record time.',
      icon: <Speed fontSize="large" color="primary" />,
      delay: 0.6,
    },
    {
      title: 'Multi-Platform Support',
      description:
        'Create videos optimized for any platform - social media, websites, presentations.',
      icon: <Devices fontSize="large" color="primary" />,
      delay: 0.8,
    },
  ]

  const steps = [
    {
      title: 'Write Your Script',
      description:
        'Start with a concept or let our AI help you craft the perfect script.',
      icon: <Create fontSize="large" />,
      delay: 0.3,
    },
    {
      title: 'Generate Visuals',
      description:
        'Our AI transforms your script into stunning visuals that match your brand.',
      icon: <AutoAwesome fontSize="large" />,
      delay: 0.5,
    },
    {
      title: 'Add Audio',
      description:
        'Choose from our library of music or upload your own voice recordings.',
      icon: <CloudUpload fontSize="large" />,
      delay: 0.7,
    },
    {
      title: 'Publish Your Video',
      description:
        'Export your finished video in multiple formats ready for sharing.',
      icon: <VideoLibrary fontSize="large" />,
      delay: 0.9,
    },
  ]

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <MotionTypography
                  variant="h2"
                  component="h1"
                  fontWeight="bold"
                  variants={fadeIn}
                  sx={{ mb: 2 }}
                >
                  Create Stunning Videos with AI
                </MotionTypography>
                <MotionTypography
                  variant="h5"
                  variants={fadeIn}
                  sx={{ mb: 4, opacity: 0.9 }}
                >
                  Transform your ideas into professional videos in minutes, not
                  days
                </MotionTypography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <MotionButton
                    component={Link}
                    href="/flow/generate-video"
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      background: theme.palette.success.main,
                      '&:hover': {
                        background: theme.palette.success.dark,
                      },
                    }}
                    variants={fadeIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Creating
                  </MotionButton>
                  <MotionButton
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.1)',
                      },
                    }}
                    variants={fadeIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Watch Demo
                  </MotionButton>
                </Box>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                sx={{
                  position: 'relative',
                  height: { xs: '300px', md: '400px' },
                  width: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <Image
                  src="/images/logo.webp"
                  alt="AI Video Creation"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </MotionBox>
            </Grid>
          </Grid>
        </Container>

        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.2,
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={scrollToFeatures}
        >
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            Discover More
          </Typography>
          <KeyboardArrowDown />
        </MotionBox>
      </Box>

      {/* Features Section */}
      <Box
        id="features"
        sx={{
          py: { xs: 8, md: 12 },
          background: '#f8f9fa',
        }}
      >
        <Container>
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            sx={{ textAlign: 'center', mb: 8 }}
          >
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Why Choose Vision Forge
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto' }}
            >
              Our AI-powered platform makes video creation easier than ever
              before
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, delay: feature.delay },
                    },
                  }}
                  whileHover={{
                    y: -10,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    transition: { duration: 0.3 },
                  }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 3,
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      fontWeight="bold"
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container>
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            sx={{ textAlign: 'center', mb: 8 }}
          >
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              How It Works
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto' }}
            >
              From concept to completion in four simple steps
            </Typography>
          </MotionBox>

          <Grid
            container
            spacing={isTablet ? 4 : 2}
            sx={{ position: 'relative' }}
          >
            {!isTablet && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100px',
                  left: '50px',
                  right: '50px',
                  height: '4px',
                  background: '#e0e0e0',
                  zIndex: 0,
                }}
              />
            )}

            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionBox
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, delay: step.delay },
                    },
                  }}
                  sx={{
                    textAlign: 'center',
                    height: '100%',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      mx: 'auto',
                      position: 'relative',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    }}
                  >
                    {step.icon}
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        bgcolor: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mb: 1, fontWeight: 'bold' }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 250, mx: 'auto' }}
                  >
                    {step.description}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Showcase Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e9f0f6 100%)',
        }}
      >
        <Container>
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              See It In Action
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto' }}
            >
              Check out these incredible videos created with Vision Forge
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <MotionCard
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, delay: item * 0.2 },
                    },
                  }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  sx={{
                    overflow: 'hidden',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`/images/banner.webp`}
                      alt={`Example video ${item}`}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MotionBox
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: 'rgba(0,0,0,0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <PlayArrow sx={{ color: 'white', fontSize: 30 }} />
                      </MotionBox>
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {
                        [
                          'Marketing Explainer',
                          'Product Showcase',
                          'Training Video',
                        ][item - 1]
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {
                        [
                          'Created in just 10 minutes with AI scripting and visuals.',
                          'High-quality product demonstration with custom branding.',
                          'Complex concepts made simple through visual storytelling.',
                        ][item - 1]
                      }
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            sx={{
              textAlign: 'center',
              p: 6,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              color: 'white',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <MotionTypography
              variant="h3"
              component="h2"
              fontWeight="bold"
              variants={fadeIn}
              sx={{ mb: 2 }}
            >
              Ready to Create Amazing Videos?
            </MotionTypography>
            <MotionTypography
              variant="h6"
              variants={fadeIn}
              sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
            >
              Start your creative journey today with Vision Forge's AI-powered
              video creation tools
            </MotionTypography>
            <MotionButton
              component={Link}
              href="/flow/generate-video"
              variant="contained"
              size="large"
              startIcon={<MovieCreation />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontSize: '1.1rem',
                background: theme.palette.success.main,
                '&:hover': {
                  background: theme.palette.success.dark,
                },
              }}
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Creating For Free
            </MotionButton>
          </MotionBox>
        </Container>
      </Box>
    </DashboardLayout>
  )
}
