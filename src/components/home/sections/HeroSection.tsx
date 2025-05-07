'use client'
import React, { useState, useEffect } from 'react'
import {
  Typography,
  Container,
  Box,
  useTheme,
  Divider,
  alpha,
  useMediaQuery,
} from '@mui/material'
import {
  PlayArrow,
  KeyboardArrowDown,
  AutoAwesome,
  Bolt,
} from '@mui/icons-material'
import Grid from '@mui/material/Grid2'

import Link from 'next/link'
import Image from 'next/image'
import {
  MotionBox,
  MotionTypography,
  MotionButton,
} from '@/components/motion/MotionComponents'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/utils/animations'

interface HeroSectionProps {
  onScrollToFeatures: () => void
}

const MotionDivider = motion(Divider)

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToFeatures }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const floatingAnimation = {
    y: ['-5px', '5px', '-5px'],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }

  const glowAnimation = {
    opacity: [0.5, 0.8, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }

  return (
    <Box
      sx={{
        background: `radial-gradient(circle at 70% 30%, ${alpha(theme.palette.primary.light, 0.15)} 0%, transparent 70%), 
                    linear-gradient(135deg, #0a1929 0%, #0d47a1 100%)`,
        color: 'white',
        pt: { xs: 10, md: 14 },
        pb: { xs: 12, md: 16 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated gradient orbs */}
      {mounted && (
        <>
          <MotionBox
            animate={glowAnimation}
            sx={{
              position: 'absolute',
              top: '-10%',
              left: '-5%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.4)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 70%)`,
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />
          <MotionBox
            animate={{
              ...glowAnimation,
              transition: { ...glowAnimation.transition, delay: 1 },
            }}
            sx={{
              position: 'absolute',
              bottom: '-15%',
              right: '-10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.3)} 0%, ${alpha(theme.palette.secondary.dark, 0.1)} 70%)`,
              filter: 'blur(60px)',
              zIndex: 0,
            }}
          />
        </>
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <MotionBox
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <MotionTypography
                variant="h2"
                fontWeight="bold"
                variants={fadeIn}
                sx={{
                  mb: 2,
                  background: `linear-gradient(90deg, #ffffff, ${theme.palette.primary.light})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 5px 25px rgba(0,0,0,0.3)',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Create Stunning Videos with AI
              </MotionTypography>

              <MotionTypography
                variant="h5"
                variants={fadeIn}
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '90%',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  fontWeight: 300,
                }}
              >
                Transform your ideas into professional videos in minutes, not
                days
              </MotionTypography>

              <MotionDivider
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '40%', opacity: 0.5 }}
                transition={{ delay: 0.5, duration: 1 }}
                sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.2)' }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <MotionButton
                  href="/flow/generate-video"
                  variant="contained"
                  size="large"
                  startIcon={<Bolt />}
                  sx={{
                    py: 1.8,
                    px: 4,
                    borderRadius: 3,
                    background: `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                    boxShadow: `0 8px 20px ${alpha(theme.palette.success.main, 0.4)}`,
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                      boxShadow: `0 10px 25px ${alpha(theme.palette.success.main, 0.5)}`,
                    },
                  }}
                  variants={fadeIn}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Creating
                </MotionButton>

                <MotionButton
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    py: 1.8,
                    px: 4,
                    borderRadius: 3,
                    borderColor: alpha('#ffffff', 0.5),
                    color: 'white',
                    backdropFilter: 'blur(8px)',
                    background: alpha('rgba(255,255,255,0.05)', 0.1),
                    textTransform: 'none',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      background: alpha('rgba(255,255,255,0.1)', 0.2),
                      boxShadow: '0 0 15px rgba(255,255,255,0.2)',
                    },
                  }}
                  variants={fadeIn}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Watch Demo
                </MotionButton>
              </Box>

              {!isMobile && (
                <Box sx={{ mt: 6, display: 'flex', alignItems: 'center' }}>
                  <MotionBox
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        backdropFilter: 'blur(10px)',
                        background: alpha('rgba(255,255,255,0.1)', 0.1),
                        p: 1,
                        px: 2,
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <AutoAwesome
                        sx={{ color: theme.palette.warning.light }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Powered by state-of-the-art AI technology
                      </Typography>
                    </Box>
                  </MotionBox>
                </Box>
              )}
            </MotionBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              sx={{
                position: 'relative',
                width: { xs: '280px', sm: '320px', md: '380px' },
                height: { xs: '280px', sm: '320px', md: '380px' },
                margin: '0 auto',
                borderRadius: '20%',
                overflow: 'visible',
              }}
            >
              {/* Glow effect behind logo */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: '-10%',
                  borderRadius: '30%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.3)} 0%, transparent 70%)`,
                  filter: 'blur(25px)',
                  opacity: 0.8,
                }}
              />

              {/* Rotating border */}
              <MotionBox
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                sx={{
                  position: 'absolute',
                  inset: '-5%',
                  borderRadius: '25%',
                  border: `2px solid ${alpha('#ffffff', 0.15)}`,
                  borderTopColor: theme.palette.primary.main,
                  borderRightColor: 'transparent',
                }}
              />

              {/* Floating logo container */}
              <MotionBox
                animate={floatingAnimation}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '20%',
                  overflow: 'hidden',
                  boxShadow: `
                    0 20px 40px ${alpha('#000000', 0.3)},
                    0 0 0 1px ${alpha('#ffffff', 0.1)} inset
                  `,
                  backdropFilter: 'blur(5px)',
                  background: `linear-gradient(135deg, ${alpha('#ffffff', 0.1)}, ${alpha('#ffffff', 0.03)})`,
                }}
              >
                <Image
                  src="/images/logo.webp"
                  alt="AI Video Creation"
                  fill
                  style={{
                    objectFit: 'contain',
                    padding: '8%',
                  }}
                  priority
                />
              </MotionBox>

              {/* Floating particles around logo */}
              {!isMobile && mounted && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <MotionBox
                      key={i}
                      initial={{
                        x: (Math.random() - 0.5) * 100,
                        y: (Math.random() - 0.5) * 100,
                        opacity: 0,
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 150,
                        y: (Math.random() - 0.5) * 150,
                        opacity: [0.3, 0.8, 0.3],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 5,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: i * 0.7,
                      }}
                      sx={{
                        position: 'absolute',
                        width: 8 + Math.random() * 15,
                        height: 8 + Math.random() * 15,
                        borderRadius: '50%',
                        background: theme.palette.primary.main,
                        filter: 'blur(3px)',
                        top: '50%',
                        left: '50%',
                      }}
                    />
                  ))}
                </>
              )}
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
          zIndex: 5,
        }}
        onClick={onScrollToFeatures}
      >
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            opacity: 0.8,
            fontWeight: 500,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}
        >
          Discover More
        </Typography>
        <MotionBox
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <KeyboardArrowDown sx={{ fontSize: 28 }} />
        </MotionBox>
      </MotionBox>
    </Box>
  )
}

export default HeroSection
