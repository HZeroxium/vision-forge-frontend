// src/components/auth/RegisterForm.tsx
'use client'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@store/store'
import { registerAsync, clearError } from '@store/authSlice'
import { useTranslation } from 'react-i18next'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

interface IRegisterFormInputs {
  name: string
  email: string
  password: string
}

export default function RegisterForm() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const { t } = useTranslation('auth')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFormInputs>()

  const onSubmit: SubmitHandler<IRegisterFormInputs> = (data) => {
    dispatch(
      registerAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      })
    )
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Typography variant="h5" className="font-bold text-center mb-2">
        {t('registerTitle')}
      </Typography>

      <TextField
        label={t('nameLabel')}
        variant="outlined"
        fullWidth
        {...register('name', { required: true })}
        error={!!errors.name}
        helperText={errors.name && t('errors.genericError')}
        onChange={() => error && dispatch(clearError())}
      />

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
        type="password"
        {...register('password', { required: true })}
        error={!!errors.password}
        helperText={errors.password && t('errors.genericError')}
        onChange={() => error && dispatch(clearError())}
      />

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={20} className="text-white" />
        ) : (
          t('registerButton')
        )}
      </Button>

      <Divider sx={{ my: 1 }}>or</Divider>

      {/* Google Register Button */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => signIn('google')}
        className="normal-case"
      >
        {t('loginWithGoogle')}
      </Button>

      {/* Navigation Link */}
      <Box className="mt-4 text-center">
        <Typography variant="body2">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            {t('loginHere')}
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
