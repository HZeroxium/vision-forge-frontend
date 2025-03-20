// src/components/auth/ResetPasswordForm.tsx
import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useAuth } from '@hooks/useAuth'

const ResetPasswordForm: React.FC = () => {
  const { resetPassword, loading, error } = useAuth()
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu không trùng khớp.')
      return
    }
    const res = await resetPassword(token, newPassword)
    if (res && res.message) {
      setMessage(res.message)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} noValidate>
      <Typography variant="h5" gutterBottom>
        Đặt lại mật khẩu
      </Typography>
      <TextField
        label="Reset Token"
        variant="outlined"
        fullWidth
        margin="normal"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
      />
      <TextField
        label="Mật khẩu mới"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <TextField
        label="Xác nhận mật khẩu mới"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="primary">{message}</Typography>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
      </Button>
    </Box>
  )
}

export default ResetPasswordForm
