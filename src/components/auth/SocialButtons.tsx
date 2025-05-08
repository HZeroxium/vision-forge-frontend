'use client'
import React from 'react'
import { Button, Box, Typography, Divider } from '@mui/material'
import { Google, GitHub } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import env from '@/config/env' // Make sure this exists with API_URL

// Create motion components
const MotionButton = motion.create(Button)
const MotionBox = motion.create(Box)

interface SocialButtonsProps {
  direction?: 'row' | 'column'
}

const SocialButtons: React.FC<SocialButtonsProps> = ({
  direction = 'column',
}) => {
  const { t } = useTranslation('auth')

  const handleGoogleLogin = () => {
    // Redirect to backend Google auth endpoint
    window.location.href = `${env.API_URL}/auth/google`
  }

  return (
    <MotionBox sx={{ width: '100%' }}>
      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('or')}
        </Typography>
      </Divider>

      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection:
            direction === 'row' ? { xs: 'column', sm: 'row' } : 'column',
          width: '100%',
        }}
      >
        <MotionButton
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleGoogleLogin}
          startIcon={<Google />}
          whileHover={{ scale: 1.02, boxShadow: 2 }}
          whileTap={{ scale: 0.98 }}
          sx={{
            py: 1.2,
            borderRadius: 2,
            textTransform: 'none',
            borderWidth: 1.5,
          }}
        >
          {t('loginWithGoogle')}
        </MotionButton>

        <MotionButton
          variant="outlined"
          color="info"
          fullWidth
          onClick={() => {
            // For now, we're keeping GitHub login separate
            // You could implement a similar flow for GitHub
            console.log('GitHub login not yet implemented')
          }}
          startIcon={<GitHub />}
          whileHover={{ scale: 1.02, boxShadow: 2 }}
          whileTap={{ scale: 0.98 }}
          sx={{
            py: 1.2,
            borderRadius: 2,
            textTransform: 'none',
            borderWidth: 1.5,
          }}
        >
          GitHub
        </MotionButton>
      </MotionBox>
    </MotionBox>
  )
}

export default SocialButtons
