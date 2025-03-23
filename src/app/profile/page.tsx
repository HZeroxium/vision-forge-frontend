// src/app/profile/page.tsx
'use client'

import React from 'react'
import {
  Container,
  Typography,
  Button,
  Box,
  Avatar,
  Card,
  CardContent,
} from '@mui/material'
import { useAppSelector, useAppDispatch } from '@store/store'
import { logout } from '@store/authSlice'
import { useRouter } from 'next/navigation'

export default function UserProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())
    router.push('/') // Redirect to home after logout
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6" align="center">
          You are not logged in.
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Avatar sx={{ width: 80, height: 80 }}>
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : user.email.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5">{user.name || user.email}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Role: {user.role}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
