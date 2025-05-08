'use client'
import React, { useState, useEffect } from 'react'
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
  Divider,
  Zoom,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowBack,
  AutoAwesome,
  LightMode,
  ArrowForward,
  Lightbulb,
  Shield,
  Speed,
  Construction,
} from '@mui/icons-material'
import useThemeHook from '@/hooks/useTheme'
import ThemeToggle from '@/components/theme/ThemeToggle'

// Create motion components
const MotionBox = motion(Box)
const MotionCard = motion(Card)
const MotionTypography = motion(Typography)
const MotionDivider = motion(Divider)
const MotionIconButton = motion(IconButton)

/**
 * AuthLayout: Modern, tech-themed layout for authentication pages with enhanced animations and improved UI/UX
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme()
  const router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const { isDarkMode } = useThemeHook()
  const [mounted, setMounted] = useState(false)

  // Mount effect for animations
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  const logoMotion = {
    rest: { scale: 1, rotateY: 0 },
    hover: {
      scale: 1.05,
      rotateY: [0, 10, 0, -10, 0],
      filter: [
        'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))',
        'drop-shadow(0px 8px 16px rgba(0,0,0,0.5))',
        'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))',
      ],
      transition: {
        rotateY: {
          repeat: 1,
          duration: 1.5,
          ease: 'easeInOut',
        },
        filter: {
          repeat: 1,
          duration: 1.5,
          ease: 'easeInOut',
        },
        scale: {
          duration: 0.4,
        },
      },
    },
    pulse: {
      scale: [1, 1.03, 1],
      rotate: [0, 0.5, 0, -0.5, 0],
      filter: [
        'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
        'drop-shadow(0px 6px 12px rgba(0,0,0,0.35))',
        'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
      ],
      transition: {
        repeat: Infinity,
        repeatDelay: 3,
        duration: 2,
        ease: 'easeInOut',
      },
    },
  }

  const floatingIconVariants = {
    animate: (custom: number) => ({
      y: [0, -10, 0, 10, 0],
      x: [0, 5, 0, -5, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 5 + custom,
          ease: 'easeInOut',
        },
        x: {
          repeat: Infinity,
          duration: 7 + custom,
          ease: 'easeInOut',
        },
      },
    }),
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        position: 'relative',
        background: isDarkMode
          ? `linear-gradient(125deg, rgba(10,12,20,0.98) 0%, rgba(15,23,42,0.99) 100%)`
          : `linear-gradient(125deg, rgba(240,245,255,0.97) 0%, rgba(255,255,255,0.98) 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Enhanced animated background elements */}
      <MotionBox
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <MotionBox
            key={i}
            variants={itemVariants}
            sx={{
              position: 'absolute',
              background: `radial-gradient(circle, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}20)`,
              borderRadius: '50%',
              filter: 'blur(40px)',
              zIndex: 0,
            }}
            initial={{
              x: Math.random() * 100 - 50 + '%',
              y: Math.random() * 100 - 50 + '%',
              width: 100 + Math.random() * 300 + 'px',
              height: 100 + Math.random() * 300 + 'px',
              opacity: 0.1 + Math.random() * 0.15,
            }}
            animate={{
              x: [null, Math.random() * 3 - 1.5 + '%'],
              y: [null, Math.random() * 3 - 1.5 + '%'],
              opacity: [null, 0.08 + Math.random() * 0.15],
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </MotionBox>

      {/* Floating icons around the layout */}
      {!isMobile && (
        <>
          <MotionBox
            custom={0}
            variants={floatingIconVariants}
            animate="animate"
            style={{
              position: 'absolute',
              top: '20%',
              left: '15%',
              zIndex: 1,
              opacity: 0.2,
            }}
          >
            <Shield
              sx={{
                fontSize: 40,
                color: theme.palette.primary.main,
              }}
            />
          </MotionBox>
          <MotionBox
            custom={1.5}
            variants={floatingIconVariants}
            animate="animate"
            style={{
              position: 'absolute',
              bottom: '25%',
              left: '10%',
              zIndex: 1,
              opacity: 0.2,
            }}
          >
            <Speed
              sx={{
                fontSize: 48,
                color: theme.palette.secondary.main,
              }}
            />
          </MotionBox>
          <MotionBox
            custom={2.2}
            variants={floatingIconVariants}
            animate="animate"
            style={{
              position: 'absolute',
              top: '25%',
              right: '12%',
              zIndex: 1,
              opacity: 0.2,
            }}
          >
            <Lightbulb
              sx={{
                fontSize: 44,
                color: theme.palette.secondary.main,
              }}
            />
          </MotionBox>
          <MotionBox
            custom={1.8}
            variants={floatingIconVariants}
            animate="animate"
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '20%',
              zIndex: 1,
              opacity: 0.2,
            }}
          >
            <Construction
              sx={{
                fontSize: 36,
                color: theme.palette.primary.main,
              }}
            />
          </MotionBox>
        </>
      )}

      {/* Enhanced navigation buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 20 },
          left: { xs: 16, sm: 20 },
          zIndex: 10,
          display: 'flex',
          gap: 1.5,
        }}
      >
        <Tooltip title="Back to home" arrow placement="right">
          <MotionIconButton
            whileHover={{
              scale: 1.1,
              boxShadow: `0 0 15px ${theme.palette.primary.main}40`,
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/')}
            sx={{
              bgcolor: theme.palette.background.paper,
              boxShadow: theme.shadows[3],
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.background.default,
              },
              transition: 'all 0.3s ease',
            }}
            size={isSmall ? 'small' : 'medium'}
          >
            <ArrowBack fontSize={isSmall ? 'small' : 'medium'} />
          </MotionIconButton>
        </Tooltip>

        {/* Theme Toggle */}
        <ThemeToggle />
      </Box>

      {/* Main content with enhanced layout - now centered around the logo */}
      <Grid container sx={{ width: '100%', height: '100%', zIndex: 1 }}>
        {/* Logo and branding column */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: { xs: 3, sm: 4, md: 5 },
            pb: { xs: 1, sm: 2, md: 5 },
            textAlign: 'center',
          }}
        >
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            sx={{
              maxWidth: { xs: 340, sm: 500 },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Logo with enhanced animation */}
            <Link
              href="/"
              style={{
                display: 'inline-block',
                marginBottom: isMobile ? 12 : 16,
              }}
            >
              <MotionBox
                initial="rest"
                whileHover="hover"
                animate={mounted ? 'pulse' : 'rest'}
                variants={logoMotion}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {/* Glowing background effect for the logo */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '110%',
                    height: '110%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${theme.palette.primary.main}30 0%, transparent 70%)`,
                    filter: 'blur(25px)',
                    opacity: isDarkMode ? 0.4 : 0.3,
                    transform: 'translateY(5%)',
                  }}
                />

                <Image
                  src="/images/logo.webp"
                  alt="Vision Forge"
                  width={isMobile ? 140 : isTablet ? 160 : 180}
                  height={isMobile ? 140 : isTablet ? 160 : 180}
                  style={{
                    objectFit: 'contain',
                    filter: isDarkMode
                      ? 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.4))'
                      : 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25))',
                    zIndex: 3,
                  }}
                  priority
                />
              </MotionBox>
            </Link>

            {/* Enhanced brand typography */}
            <MotionTypography
              variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}
              fontWeight="bold"
              sx={{
                mb: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: isDarkMode ? '0 2px 15px rgba(0,0,0,0.4)' : 'none',
                letterSpacing: '-0.02em',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Vision Forge
            </MotionTypography>

            {/* Animated tagline */}
            <MotionTypography
              variant={isMobile ? 'body1' : 'h6'}
              color="text.secondary"
              sx={{
                mb: { xs: 3, md: 4 },
                maxWidth: 400,
                px: 2,
                fontWeight: 500,
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
                <MotionBox
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 3,
                    duration: 1.5,
                  }}
                >
                  <AutoAwesome
                    fontSize={isSmall ? 'small' : 'medium'}
                    color="primary"
                    sx={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))' }}
                  />
                </MotionBox>
                Empowering your creativity with AI
              </Box>
            </MotionTypography>

            <AnimatePresence>
              {!isMobile && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  {/* Decorative divider */}
                  <MotionDivider
                    sx={{
                      width: '60%',
                      mb: 4,
                      mx: 'auto',
                    }}
                    initial={{ width: '0%', opacity: 0 }}
                    animate={{ width: '60%', opacity: 0.7 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  />

                  {/* Feature highlights */}
                  <Grid container spacing={2} sx={{ maxWidth: 500, mb: 3 }}>
                    {[
                      {
                        icon: <Shield color="primary" />,
                        text: 'Secure Authentication',
                      },
                      {
                        icon: <Speed color="primary" />,
                        text: 'High Performance',
                      },
                      {
                        icon: <Lightbulb color="primary" />,
                        text: 'Smart Features',
                      },
                      {
                        icon: <Construction color="primary" />,
                        text: 'Powerful Tools',
                      },
                    ].map((feature, index) => (
                      <Grid key={index} size={{ xs: 6 }}>
                        <MotionBox
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.8 + index * 0.1,
                            duration: 0.5,
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            mb: 1,
                          }}
                        >
                          <Box sx={{ color: theme.palette.primary.main }}>
                            {feature.icon}
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="medium"
                          >
                            {feature.text}
                          </Typography>
                        </MotionBox>
                      </Grid>
                    ))}
                  </Grid>
                </MotionBox>
              )}
            </AnimatePresence>

            {/* Enhanced image container */}
            <MotionBox
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 180, sm: 220, md: 280 },
                borderRadius: { xs: 3, md: 4 },
                overflow: 'hidden',
                display: { xs: 'none', md: 'block' },
                boxShadow: isDarkMode
                  ? '0 10px 40px rgba(0, 0, 0, 0.4)'
                  : '0 10px 40px rgba(0, 0, 0, 0.15)',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Interactive banner image */}
              <MotionBox
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.5, ease: 'easeOut' },
                }}
                sx={{ height: '100%' }}
              >
                {/* <Image
                  src="/images/banner.webp"
                  alt="AI Technology"
                  fill
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'all 0.5s ease-out',
                  }}
                  priority
                /> */}
                {/* Overlay on the image */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}55, ${theme.palette.secondary.dark}50)`,
                    backdropFilter: 'blur(2px)',
                  }}
                />
              </MotionBox>
            </MotionBox>

            {/* Extra text element for larger screens only */}
            <MotionTypography
              variant="body2"
              sx={{
                mt: 4,
                color: 'text.secondary',
                opacity: 0.85,
                fontStyle: 'italic',
                display: { xs: 'none', md: 'block' },
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Create, transform, and inspire with state-of-the-art AI tools
            </MotionTypography>
          </MotionBox>
        </Grid>

        {/* Enhanced form section */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            p: { xs: 2, sm: 4, md: 5 },
            position: 'relative',
          }}
        >
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.5 }}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              background: isDarkMode
                ? 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.15), transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.07), transparent 70%)',
              zIndex: 0,
            }}
          />

          <MotionCard
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              boxShadow: isDarkMode
                ? '0 15px 40px rgba(0, 0, 0, 0.4)'
                : '0 15px 40px rgba(0, 0, 0, 0.15)',
            }}
            sx={{
              width: '100%',
              maxWidth: { xs: 400, md: 480 },
              borderRadius: { xs: 2, md: 3 },
              overflow: 'hidden',
              boxShadow: isDarkMode
                ? '0 10px 35px rgba(0, 0, 0, 0.3)'
                : '0 10px 35px rgba(0, 0, 0, 0.1)',
              background: theme.palette.background.paper,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`,
              position: 'relative',
              zIndex: 1,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                zIndex: 1,
              },
            }}
            elevation={2}
          >
            <CardContent
              sx={{
                p: { xs: 2.5, sm: 4 },
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Children components (login/register forms) */}
              {children}
            </CardContent>
          </MotionCard>

          {/* Footer text with subtle animation */}
          <Zoom in={mounted} style={{ transitionDelay: '500ms' }}>
            <MotionTypography
              variant="caption"
              sx={{
                mt: 2,
                mb: 1,
                color: 'text.secondary',
                opacity: 0.7,
                textAlign: 'center',
                width: '100%',
                maxWidth: 400,
              }}
            >
              &copy; {new Date().getFullYear()} Vision Forge. All rights
              reserved.
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                <LightMode sx={{ fontSize: 12 }} />
                <span>Secured with end-to-end encryption</span>
                <MotionBox
                  animate={{ x: [0, 2, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                >
                  <ArrowForward sx={{ fontSize: 12 }} />
                </MotionBox>
              </Box>
            </MotionTypography>
          </Zoom>
        </Grid>
      </Grid>
    </MotionBox>
  )
}
