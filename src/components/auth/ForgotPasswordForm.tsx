// src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import { TextField, Button, Typography, Box } from '@mui/material'

const ForgotPasswordForm: React.FC = () => {
  const { forgotPassword, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await forgotPassword(email)
    if (res) {
      setMessage('Password reset token generated. Please check your email.')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} noValidate>
      <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="success.main">{message}</Typography>}
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Processing...' : 'Reset Password'}
      </Button>
    </Box>
  )
}

export default ForgotPasswordForm
