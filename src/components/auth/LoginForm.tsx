// src/components/auth/LoginForm.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@store/store'
import { loginAsync, clearError } from '@store/authSlice'
import { useTranslation } from 'react-i18next'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ILoginFormInputs {
  email: string
  password: string
}

export default function LoginForm() {
  const dispatch = useAppDispatch()
  const { loading, error, user } = useAppSelector((state) => state.auth)
  const { t } = useTranslation('auth')
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>()

  const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
    dispatch(loginAsync({ email: data.email, password: data.password }))
  }

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Typography variant="h5" className="font-bold text-center mb-2">
        {t('loginTitle')}
      </Typography>

      <TextField
        label={t('emailLabel')}
        variant="outlined"
        fullWidth
        {...register('email', { required: true })}
        error={!!errors.email}
        helperText={errors.email && t('errors.genericError')}
        onChange={() => error && dispatch(clearError())}
      />

      <TextField
        label={t('passwordLabel')}
        variant="outlined"
        fullWidth
        type={showPassword ? 'text' : 'password'}
        {...register('password', { required: true })}
        error={!!errors.password}
        helperText={errors.password && t('errors.genericError')}
        onChange={() => error && dispatch(clearError())}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Redux error message */}
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="mt-2 normal-case"
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={20} className="text-white" />
        ) : (
          t('loginButton')
        )}
      </Button>

      <Divider sx={{ my: 1 }}>or</Divider>

      {/* Google Login Button */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => signIn('google')}
        className="normal-case"
      >
        {t('loginWithGoogle')}
      </Button>

      {user && (
        <Typography
          variant="subtitle2"
          className="text-green-600 mt-2 text-center"
        >
          {t('welcomeUser', { name: user.name || user.email })}
        </Typography>
      )}

      {/* Navigation Links */}
      <Box className="mt-4 flex flex-col gap-2 text-center">
        <Typography variant="body2">
          {t('noAccount')}{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            {t('registerNow')}
          </Link>
        </Typography>
        <Typography variant="body2">
          <Link
            href="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            {t('forgotPassword')}
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
