// src/components/auth/LoginForm.tsx
'use client'
import React, { useState, FormEvent } from 'react'
import { Box, TextField, Typography, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@store/store'
import { loginAsync, clearError } from '@store/authSlice'

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { loading, error, user } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(loginAsync({ email, password }))
  }

  // Clear error on input change
  const handleInputChange = () => {
    if (error) {
      dispatch(clearError())
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          handleInputChange()
        }}
        required
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          handleInputChange()
        }}
        required
      />
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      {user && (
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Welcome, {user.name || user.email}!
        </Typography>
      )}
    </Box>
  )
}

export default LoginForm
