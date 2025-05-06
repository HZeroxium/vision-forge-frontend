'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Typography, CircularProgress, Paper, Alert } from '@mui/material'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@store/store'
import { setGoogleAuth } from '@store/authSlice'

const GoogleAuthCallbackPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const token = searchParams.get('token')

        if (!token) {
          setStatus('error')
          setErrorMessage('No authentication token received')
          return
        }

        // Store token in localStorage and fetch user profile
        await dispatch(setGoogleAuth(token)).unwrap()

        setStatus('success')

        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } catch (error) {
        console.error('Google auth error:', error)
        setStatus('error')
        setErrorMessage('Authentication failed. Please try again.')
      }
    }

    handleGoogleCallback()
  }, [dispatch, router, searchParams])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        p: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            width: '100%',
            maxWidth: 400,
          }}
        >
          {status === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6">Completing your sign-in...</Typography>
            </>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <Alert severity="success" sx={{ mb: 2 }}>
                Successfully signed in!
              </Alert>
              <Typography>Redirecting to dashboard...</Typography>
            </motion.div>
          )}

          {status === 'error' && (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                Authentication Error
              </Alert>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {errorMessage}
              </Typography>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/auth/login')}
                style={{
                  background: 'transparent',
                  border: '1px solid #1976d2',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#1976d2',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Back to Login
              </motion.button>
            </>
          )}
        </Paper>
      </motion.div>
    </Box>
  )
}

export default GoogleAuthCallbackPage
