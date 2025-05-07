import React from 'react'
import { Typography, Container, Box, useTheme } from '@mui/material'
import { PlayArrow, KeyboardArrowDown } from '@mui/icons-material'
import Grid from '@mui/material/Grid2'

import Link from 'next/link'
import Image from 'next/image'
import {
  MotionBox,
  MotionTypography,
  MotionButton,
} from '@/components/motion/MotionComponents'
import { fadeIn, staggerContainer } from '@/utils/animations'

interface HeroSectionProps {
  onScrollToFeatures: () => void
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToFeatures }) => {
  const theme = useTheme()

  return (
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
          <Grid size={{ xs: 12, md: 6 }}>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              sx={{
                position: 'relative',
                width: { xs: '250px', sm: '300px', md: '350px' },
                aspectRatio: '1/1',
                margin: '0 auto',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              <Image
                src="/images/logo.webp"
                alt="AI Video Creation"
                fill
                style={{ objectFit: 'contain' }}
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
        onClick={onScrollToFeatures}
      >
        <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
          Discover More
        </Typography>
        <KeyboardArrowDown />
      </MotionBox>
    </Box>
  )
}

export default HeroSection
