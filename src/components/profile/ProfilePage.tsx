// src/components/profile/ProfilePage.tsx
import React, { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Typography, Paper } from '@mui/material'

const ProfilePage: React.FC = () => {
  const { user, loadProfile, loading } = useAuth()

  useEffect(() => {
    loadProfile()
  }, [])

  if (loading || !user) return <Typography>Loading profile...</Typography>

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Name: {user.name}</Typography>
      <Typography>Role: {user.role}</Typography>
      <Typography>
        Created At: {new Date(user.createdAt).toLocaleString()}
      </Typography>
    </Paper>
  )
}

export default ProfilePage
