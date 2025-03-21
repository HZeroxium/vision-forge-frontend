// src/components/auth/RegisterForm.tsx
'use client'
import React, { useState, FormEvent } from 'react'
import { Box, TextField, Typography, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@store/store'
import { registerAsync, clearError } from '@store/authSlice'

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(registerAsync({ email, password, name }))
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
        Register
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          handleInputChange()
        }}
      />
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
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </Box>
  )
}

export default RegisterForm
