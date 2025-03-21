// src/components/auth/ChangePasswordForm.tsx
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
import { changePasswordAsync, clearError } from '@store/authSlice'
import { useTranslation } from 'react-i18next'

interface IChangePasswordFormInputs {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ChangePasswordForm() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const { t } = useTranslation('auth')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IChangePasswordFormInputs>()

  const onSubmit: SubmitHandler<IChangePasswordFormInputs> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: t('errors.passwordMismatch'),
      })
      return
    }
    // Dispatch async action to change password
    await dispatch(
      changePasswordAsync({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
    )
    // Optionally: show a toast or success message here
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-4"
    >
      <Typography variant="h5" className="font-bold text-center mb-2">
        {t('changePasswordTitle')}
      </Typography>

      <TextField
        label={t('oldPasswordLabel')}
        type="password"
        variant="outlined"
        fullWidth
        {...register('oldPassword', { required: true })}
        error={!!errors.oldPassword}
        helperText={errors.oldPassword && t('errors.genericError')}
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
          t('changePasswordButton')
        )}
      </Button>
    </Box>
  )
}
