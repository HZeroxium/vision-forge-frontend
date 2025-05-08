// /src/layouts/DashboardLayout.tsx

'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  useMediaQuery,
  useTheme,
  alpha,
  Typography,
  Fade,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import Header from '@components/layout/Header'
import Sidebar from '@components/navigation/Sidebar'
import Footer from '@components/layout/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

// Create motion components
const MotionMain = motion(Box)
const MotionContainer = motion(Container)
const MotionBox = motion(Box)

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme()
  const pathname = usePathname()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [pageKey, setPageKey] = useState('')
  const [mounted, setMounted] = useState(false)

  // Update page key when pathname changes for animation
  useEffect(() => {
    setPageKey(pathname)

    // Set mounted state for client-side rendering
    if (!mounted) {
      setMounted(true)
    }
  }, [pathname, mounted])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.default, 0.98)
            : theme.palette.background.default,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `radial-gradient(circle at 50% 0%, ${alpha(theme.palette.primary.dark, 0.12)} 0%, transparent 70%)`
            : `radial-gradient(circle at 50% 0%, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 70%)`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative patterns */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.02,
          pointerEvents: 'none',
          backgroundImage:
            theme.palette.mode === 'dark'
              ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
              : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${theme.spacing(9)})` },
          ml: { xs: 0, md: 0 }, // Remove any margin
          position: 'relative',
          zIndex: 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Header placeholder if needed */}
        {/* <Header /> */}

        {/* Main content with animation */}
        <AnimatePresence mode="wait">
          <MotionMain
            key={pageKey}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            sx={{
              flexGrow: 1,
              py: { xs: 2, sm: 3, md: 4 },
              px: { xs: 1, sm: 2, md: 3 },
              overflow: 'auto',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <MotionContainer
              maxWidth="xl"
              sx={{
                height: '100%',
                position: 'relative',
              }}
              variants={contentVariants}
            >
              {/* Add a subtle background gradient to the main content */}
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                sx={{
                  position: 'absolute',
                  top: '-10%',
                  left: '5%',
                  width: '50%',
                  height: '30%',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />

              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                sx={{
                  position: 'absolute',
                  bottom: '0%',
                  right: '5%',
                  width: '40%',
                  height: '40%',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.03)} 0%, transparent 70%)`,
                  filter: 'blur(60px)',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />

              {/* Page content wrapper with glassmorphism effect for sections that need it */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
            </MotionContainer>
          </MotionMain>
        </AnimatePresence>

        {/* Footer with fade animation */}
        <Fade in={mounted} timeout={800}>
          <Box>
            <Footer />
          </Box>
        </Fade>
      </Box>
    </Box>
  )
}

export default DashboardLayout
