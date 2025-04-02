'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Avatar, Typography } from '@mui/material'

// Create motion components
const MotionBox = motion.create(Box)

interface UserProfileProps {
  user: {
    name?: string
    email: string
  } | null
  open: boolean
}

const UserProfile: React.FC<UserProfileProps> = ({ user, open }) => {
  if (!user) return null

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        justifyContent: open ? 'flex-start' : 'center',
      }}
    >
      <Avatar
        src="/images/user-avatar.png" // Placeholder for user avatar
        alt={user.name || 'User'}
        sx={{
          width: 40,
          height: 40,
          bgcolor: 'secondary.main',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid',
          borderColor: 'secondary.light',
        }}
      >
        {user.name?.charAt(0) || user.email?.charAt(0)}
      </Avatar>
      <AnimatePresence>
        {open && (
          <MotionBox
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            sx={{ ml: 2, overflow: 'hidden' }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              noWrap
              sx={{ maxWidth: 140 }}
            >
              {user.name || user.email.split('@')[0]}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 140 }}
            >
              {user.email}
            </Typography>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default UserProfile
