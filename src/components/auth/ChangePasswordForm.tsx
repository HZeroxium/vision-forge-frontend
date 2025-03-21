// src/components/auth/ChangePasswordForm.tsx
'use client'
import React, { useState, FormEvent } from 'react'
import { Box, TextField, Typography, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@store/store'
import { changePasswordAsync, clearError } from '@store/authSlice'

const ChangePasswordForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [oldPassword, setOldPassword] = useState('')
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
    // Dispatch change password async action
    const resultAction = await dispatch(
      changePasswordAsync({ oldPassword, newPassword })
    )
    if (changePasswordAsync.fulfilled.match(resultAction)) {
      setMessage('Password changed successfully.')
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
        Change Password
      </Typography>
      <TextField
        label="Old Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={oldPassword}
        onChange={(e) => {
          setOldPassword(e.target.value)
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
        {loading ? 'Processing...' : 'Change Password'}
      </Button>
    </Box>
  )
}

export default ChangePasswordForm
