// src/components/auth/ResetPasswordForm.tsx
'use client'
import React, { useState, FormEvent } from 'react'
import { Box, TextField, Typography, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@store/store'
import { resetPasswordAsync, clearError } from '@store/authSlice'

const ResetPasswordForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation do not match.')
      return
    }
    const resultAction = await dispatch(
      resetPasswordAsync({ token, newPassword })
    )
    if (resetPasswordAsync.fulfilled.match(resultAction)) {
      setMessage('Password has been reset successfully.')
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
        Reset Password
      </Typography>
      <TextField
        label="Reset Token"
        variant="outlined"
        fullWidth
        margin="normal"
        value={token}
        onChange={(e) => {
          setToken(e.target.value)
          handleInputChange()
        }}
        required
      />
      <TextField
        label="New Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value)
          handleInputChange()
        }}
        required
      />
      <TextField
        label="Confirm New Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value)
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
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Reset Password'}
      </Button>
    </Box>
  )
}

export default ResetPasswordForm
