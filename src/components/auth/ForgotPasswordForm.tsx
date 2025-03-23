// src/components/auth/ForgotPasswordForm.tsx
'use client'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@store/store'
import { forgotPasswordAsync, clearError } from '@store/authSlice'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

interface IForgotPasswordFormInputs {
  email: string
}

export default function ForgotPasswordForm() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const { t } = useTranslation('auth')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordFormInputs>()

  const onSubmit: SubmitHandler<IForgotPasswordFormInputs> = async (data) => {
    dispatch(forgotPasswordAsync({ email: data.email }))
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Typography variant="h5" className="font-bold text-center mb-2">
        {t('forgotPasswordTitle')}
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

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={20} className="text-white" />
        ) : (
          t('forgotPasswordButton')
        )}
      </Button>

      {/* Navigation Link */}
      <Box className="mt-4 text-center">
        <Typography variant="body2">
          {t('rememberPassword')}{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            {t('backToLogin')}
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
