// src/components/auth/RegisterForm.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Typography, Alert, useTheme } from '@mui/material'
import { Person, Email, Lock, HowToReg } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@store/store'
import { registerAsync, clearError } from '@store/authSlice'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Import reusable components
import AuthFormField from './AuthFormField'
import AuthButton from './AuthButton'
import AuthHeader from './AuthHeader'
import SocialButtons from './SocialButtons'

// Create motion components
const MotionBox = motion(Box)

interface IRegisterFormInputs {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterForm() {
  const dispatch = useAppDispatch()
  const { loading, error, user } = useAppSelector((state) => state.auth)
  const { t } = useTranslation('auth')
  const router = useRouter()
  const theme = useTheme()
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<IRegisterFormInputs>()

  // Watch password for confirmation validation
  const password = watch('password', '')

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  }

  const onSubmit = (data: IRegisterFormInputs) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: t('errors.passwordMismatch'),
      })
      return
    }

    dispatch(
      registerAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      })
    )
      .unwrap()
      .then(() => setSuccess(true))
      .catch(() => {})
  }

  // Redirect to home if successfully registered
  useEffect(() => {
    if (user && success) {
      const timer = setTimeout(() => {
        router.push('/')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [user, router, success])

  return (
    <MotionBox
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      initial="hidden"
      animate="visible"
      variants={formVariants}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <AuthHeader
        title={t('registerTitle')}
        subtitle="Create your account to start your journey"
      />

      {success && user && (
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            Account created successfully. Redirecting...
          </Alert>
        </MotionBox>
      )}

      {/* Name field */}
      <MotionBox variants={itemVariants}>
        <AuthFormField
          name="name"
          label={t('nameLabel')}
          icon={<Person color="action" />}
          required
          register={register}
          error={errors.name}
          validation={{
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          }}
          onChange={() => error && dispatch(clearError())}
        />
      </MotionBox>

      {/* Email field */}
      <MotionBox variants={itemVariants}>
        <AuthFormField
          name="email"
          label={t('emailLabel')}
          icon={<Email color="action" />}
          required
          register={register}
          error={errors.email}
          validation={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          onChange={() => error && dispatch(clearError())}
        />
      </MotionBox>

      {/* Password field */}
      <MotionBox variants={itemVariants}>
        <AuthFormField
          name="password"
          label={t('passwordLabel')}
          type="password"
          icon={<Lock color="action" />}
          required
          register={register}
          error={errors.password}
          validation={{
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          onChange={() => error && dispatch(clearError())}
        />
      </MotionBox>

      {/* Confirm Password field */}
      <MotionBox variants={itemVariants}>
        <AuthFormField
          name="confirmPassword"
          label={t('confirmPasswordLabel')}
          type="password"
          icon={<Lock color="action" />}
          required
          register={register}
          error={errors.confirmPassword}
          validation={{
            validate: (value) => value === password || 'Passwords do not match',
          }}
          onChange={() => error && dispatch(clearError())}
        />
      </MotionBox>

      {/* Error message */}
      {error && (
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        </MotionBox>
      )}

      {/* Register button */}
      <MotionBox variants={itemVariants}>
        <AuthButton
          type="submit"
          text={t('registerButton')}
          loading={loading}
          endIcon={<HowToReg />}
        />
      </MotionBox>

      {/* Social buttons */}
      <SocialButtons />

      {/* Login link */}
      <MotionBox variants={itemVariants} sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/auth/login" style={{ textDecoration: 'none' }}>
            <Typography
              component={motion.span}
              whileHover={{ y: -1 }}
              color="primary"
              fontWeight="medium"
              display="inline"
            >
              {t('loginHere')}
            </Typography>
          </Link>
        </Typography>
      </MotionBox>
    </MotionBox>
  )
}
