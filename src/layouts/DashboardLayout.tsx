// /src/layouts/DashboardLayout.tsx

'use client'
import React, { useState } from 'react'
import { Box, Container, useMediaQuery, useTheme } from '@mui/material'
import Header from '@components/layout/Header'
import Sidebar from '@components/navigation/Sidebar'
import Footer from '@components/layout/Footer'
import { motion } from 'framer-motion'

// Create motion versions of components
const MotionMain = motion(Box)

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
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
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Header */}
        {/* <Header /> */}

        {/* Main content with animation */}
        <MotionMain
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            flexGrow: 1,
            py: 3,
            px: { xs: 2, sm: 3 },
            overflow: 'auto',
          }}
        >
          <Container maxWidth="xl" sx={{ height: '100%' }}>
            {children}
          </Container>
        </MotionMain>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  )
}

export default DashboardLayout
