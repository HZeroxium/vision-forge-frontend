// src/components/auth/ResetPasswordForm.tsx
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
import { resetPasswordAsync, clearError } from '@store/authSlice'
import { useTranslation } from 'react-i18next'

interface IResetPasswordFormInputs {
  token: string
  newPassword: string
  confirmPassword: string
}

export default function ResetPasswordForm() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const { t } = useTranslation('auth')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IResetPasswordFormInputs>()

  const onSubmit: SubmitHandler<IResetPasswordFormInputs> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: t('errors.passwordMismatch'),
      })
      return
    }
    await dispatch(
      resetPasswordAsync({ token: data.token, newPassword: data.newPassword })
    )
    // Optionally: trigger a success notification or redirect
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-4"
    >
      <Typography variant="h5" className="font-bold text-center mb-2">
        {t('resetPasswordTitle')}
      </Typography>

      <TextField
        label={t('resetTokenLabel')}
        variant="outlined"
        fullWidth
        {...register('token', { required: true })}
        error={!!errors.token}
        helperText={errors.token && t('errors.genericError')}
        onChange={() => error && dispatch(clearError())}
      />

      <TextField
        label={t('newPasswordLabel')}
        type="password"
        variant="outlined"
        fullWidth
        {...register('newPassword', { required: true })}
        error={!!errors.newPassword}
        helperText={errors.newPassword && t('errors.genericError')}
        onChange={() => error && dispatch(clearError())}
      />

      <TextField
        label={t('confirmNewPasswordLabel')}
        type="password"
        variant="outlined"
        fullWidth
        {...register('confirmPassword', { required: true })}
        error={!!errors.confirmPassword}
        helperText={
          errors.confirmPassword
            ? errors.confirmPassword.message || t('errors.genericError')
            : ''
        }
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
        fullWidth
        disabled={loading}
        className="mt-2"
      >
        {loading ? (
          <CircularProgress size={20} className="text-white" />
        ) : (
          t('resetButton')
        )}
      </Button>
    </Box>
  )
}
