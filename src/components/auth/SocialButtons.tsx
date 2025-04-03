'use client'
import React from 'react'
import { Button, Box, Typography, Divider } from '@mui/material'
import { Google, GitHub } from '@mui/icons-material'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// Create motion components
const MotionButton = motion(Button)
const MotionBox = motion(Box)

interface SocialButtonsProps {
  direction?: 'row' | 'column'
}

const SocialButtons: React.FC<SocialButtonsProps> = ({
  direction = 'column',
}) => {
  const { t } = useTranslation('auth')

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
          onClick={() => signIn('google')}
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
          onClick={() => signIn('github')}
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
