'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Avatar, Typography, useTheme, alpha } from '@mui/material'
import Grid from '@mui/material/Grid2'

// Create motion components
const MotionBox = motion.create(Box)
const MotionTypography = motion.create(Typography)

interface UserProfileProps {
  user: {
    name?: string
    email: string
  } | null
  open: boolean
}

const UserProfile: React.FC<UserProfileProps> = ({ user, open }) => {
  const theme = useTheme()

  if (!user) return null

  return (
    <Box
      sx={{
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Avatar
            src="/images/user-avatar.png" // Placeholder for user avatar
            alt={user.name || 'User'}
            sx={{
              width: 42,
              height: 42,
              bgcolor: theme.palette.secondary.main,
              boxShadow: `0 4px 14px ${alpha(theme.palette.secondary.main, 0.4)}`,
              border: '2px solid',
              borderColor: alpha(theme.palette.secondary.light, 0.6),
              position: 'relative',
              zIndex: 1,
            }}
          >
            {user.name?.charAt(0) || user.email?.charAt(0)}
          </Avatar>
        </MotionBox>

        <AnimatePresence>
          {open && (
            <MotionBox
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              sx={{ ml: 2, overflow: 'hidden' }}
            >
              <MotionTypography
                variant="subtitle2"
                fontWeight="bold"
                noWrap
                sx={{
                  maxWidth: 140,
                  color: theme.palette.text.primary,
                  textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
                whileHover={{ x: 3 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {user.name || user.email.split('@')[0]}
              </MotionTypography>

              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{
                  maxWidth: 140,
                  display: 'block',
                  mt: 0.3,
                  opacity: 0.8,
                }}
              >
                {user.email}
              </Typography>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>

      {/* Background decorative element */}
      {open && (
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
            opacity: 0.6,
            zIndex: 0,
          }}
        />
      )}
    </Box>
  )
}

export default UserProfile
