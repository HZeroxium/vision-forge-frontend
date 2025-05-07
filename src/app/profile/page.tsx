// src/app/profile/page.tsx

'use client'

import React, { useState } from 'react'
import {
  Container,
  CircularProgress,
  Button,
  Paper,
  Typography,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useAppSelector } from '@store/store'
import { useRouter } from 'next/navigation'
import { fadeIn } from '@/utils/animations'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileInformationTab from '@/components/profile/ProfileInformationTab'
import SecurityTab from '@/components/profile/SecurityTab'
import TabNavigation from '@/components/profile/TabNavigation'

// Motion components
const MotionPaper = motion(Paper)

export default function UserProfilePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, loading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  // State for tab navigation
  const [tabValue, setTabValue] = useState(0)

  // General notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  // Show notification
  const showNotification = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={2}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="h6" mb={3}>
            You are not logged in
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/auth/login')}
            sx={{ mr: 2, borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}
          >
            Log In
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/auth/register')}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}
          >
            Sign Up
          </Button>
        </MotionPaper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Tabs Navigation */}
        <TabNavigation
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          isMobile={isMobile}
        />

        {/* Tab Content */}
        <motion.div variants={fadeIn}>
          {tabValue === 0 && (
            <ProfileInformationTab
              user={user}
              showNotification={showNotification}
            />
          )}
          {tabValue === 1 && (
            <SecurityTab showNotification={showNotification} />
          )}
        </motion.div>
      </motion.div>

      {/* Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  )
}
