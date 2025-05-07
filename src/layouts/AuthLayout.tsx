'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { motion } from 'framer-motion'
import { ArrowBack, AutoAwesome } from '@mui/icons-material'
import useThemeHook from '@/hooks/useTheme'
import ThemeToggle from '@/components/theme/ThemeToggle'

// Create motion components
const MotionBox = motion(Box)
const MotionCard = motion(Card)
const MotionTypography = motion(Typography)

/**
 * AuthLayout: Modern, tech-themed layout for authentication pages
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme()
  const router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Use our custom hook instead of local state
  const { isDarkMode } = useThemeHook()

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        position: 'relative',
        background: `linear-gradient(135deg, ${
          isDarkMode ? 'rgba(13,15,20,0.95)' : 'rgba(240,242,245,0.9)'
        } 0%, ${
          isDarkMode ? 'rgba(20,25,40,0.95)' : 'rgba(250,252,255,0.9)'
        } 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <MotionBox
            key={i}
            sx={{
              position: 'absolute',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}30)`,
              borderRadius: '50%',
              filter: 'blur(40px)',
            }}
            initial={{
              x: Math.random() * 100 - 50 + '%',
              y: Math.random() * 100 - 50 + '%',
              width: 100 + Math.random() * 200 + 'px',
              height: 100 + Math.random() * 200 + 'px',
              opacity: 0.1 + Math.random() * 0.2,
            }}
            animate={{
              x: [null, Math.random() * 2 - 1 + '%'],
              y: [null, Math.random() * 2 - 1 + '%'],
              opacity: [null, 0.1 + Math.random() * 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: 'mirror',
            }}
          />
        ))}
      </Box>

      {/* Navigation buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 2,
          display: 'flex',
          gap: 1,
        }}
      >
        <Tooltip title="Back to home">
          <IconButton
            onClick={() => router.push('/')}
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            sx={{
              bgcolor: theme.palette.background.paper,
              boxShadow: theme.shadows[2],
            }}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>

        {/* Use our ThemeToggle component instead */}
        <ThemeToggle />
      </Box>

      {/* Main content */}
      <Grid container sx={{ width: '100%', height: '100%', zIndex: 1 }}>
        {/* Left branding section */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            textAlign: 'center',
          }}
        >
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            sx={{
              maxWidth: 500,
              display: { xs: 'flex', md: 'block' },
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Link
              href="/"
              style={{ display: 'inline-block', marginBottom: 24 }}
            >
              <MotionBox
                src="/images/logo.webp"
                alt="Vision Forge"
                whileHover={{ scale: 1.05 }}
                width={isMobile ? 120 : 160}
                height="auto"
                sx={{
                  objectFit: 'contain',
                  filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
                }}
              />
            </Link>

            <MotionTypography
              variant={isMobile ? 'h5' : 'h3'}
              fontWeight="bold"
              sx={{
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', md: 'block' },
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Vision Forge
            </MotionTypography>

            <MotionTypography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 4,
                display: { xs: 'none', md: 'block' },
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <AutoAwesome fontSize="small" color="primary" />
                Empowering your creativity with AI
              </Box>
            </MotionTypography>

            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 180, sm: 240, md: 300 },
                borderRadius: 4,
                overflow: 'hidden',
                display: { xs: 'none', md: 'block' },
                boxShadow: theme.shadows[8],
              }}
            >
              <Image
                src="/images/logo.webp"
                alt="AI Technology"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}40, ${theme.palette.secondary.dark}40)`,
                }}
              />
            </MotionBox>
          </MotionBox>
        </Grid>

        {/* Right form section */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: { xs: 2, sm: 4, md: 6 },
          }}
        >
          <MotionCard
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            sx={{
              width: '100%',
              maxWidth: 480,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              background: theme.palette.background.paper,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>{children}</CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  )
}
