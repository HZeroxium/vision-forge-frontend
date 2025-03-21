// src/components/auth/ForgotPasswordForm.tsx
'use client'
import React, { useState, FormEvent } from 'react'
import { Box, TextField, Typography, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@store/store'
import { forgotPasswordAsync, clearError } from '@store/authSlice'

const ForgotPasswordForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const resultAction = await dispatch(forgotPasswordAsync({ email }))
    if (forgotPasswordAsync.fulfilled.match(resultAction)) {
      setMessage('Password reset token generated. Please check your email.')
    }
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
        Forgot Password
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
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      {message && (
        <Typography color="primary" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Reset Password'}
      </Button>
    </Box>
  )
}

export default ForgotPasswordForm
