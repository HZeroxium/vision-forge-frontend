'use client'
import React, { useState } from 'react'
import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { motion } from 'framer-motion'

// Create motion components
const MotionTextField = motion(TextField)

interface AuthFormFieldProps {
  name: string
  label: string
  type?: string
  required?: boolean
  register: any
  error?: any
  icon?: React.ReactNode
  onChange?: () => void
  validation?: Record<string, any>
  placeholder?: string
  helperText?: string
}

const AuthFormField: React.FC<AuthFormFieldProps> = ({
  name,
  label,
  type = 'text',
  required = false,
  register,
  error,
  icon,
  onChange,
  validation = {},
  placeholder,
  helperText,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  // Determine the actual type to use
  const inputType = isPassword 
    ? (showPassword ? 'text' : 'password') 
    : type

  return (
    <MotionTextField
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      label={label}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      type={inputType}
      {...register(name, {
        required: required && 'This field is required',
        ...validation,
      })}
      error={!!error}
      helperText={error?.message || helperText || ''}
      onChange={onChange}
      InputProps={{
        startAdornment: icon && (
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        ),
        endAdornment: isPassword && (
          <InputAdornment position="end">
            <Tooltip
              title={showPassword ? 'Hide password' : 'Show password'}
              arrow
            >
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          transition: 'all 0.3s',
          '&:hover, &.Mui-focused': {
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}40`,
          },
        },
      }}
    />
  )
}

export default AuthFormField
