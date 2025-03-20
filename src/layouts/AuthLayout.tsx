// src/layouts/AuthLayout.tsx
import { Container, Paper } from '@mui/material'
import React from 'react'

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {children}
      </Paper>
    </Container>
  )
}

export default AuthLayout
