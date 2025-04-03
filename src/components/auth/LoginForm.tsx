// src/components/auth/LoginForm.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Typography, Alert, useTheme } from '@mui/material'
import { Email, Lock, ArrowForward } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@store/store'
import { loginAsync, clearError } from '@store/authSlice'
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
const MotionTypography = motion(Typography)

interface ILoginFormInputs {
  email: string
  password: string
}

export default function LoginForm() {
  const dispatch = useAppDispatch()
  const { loading, error, user } = useAppSelector((state) => state.auth)
  const { t } = useTranslation('auth')
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const theme = useTheme()

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>()

  const onSubmit = async (data: ILoginFormInputs) => {
    dispatch(loginAsync({ email: data.email, password: data.password }))
      .unwrap()
      .then(() => setSuccess(true))
      .catch(() => {})
  }

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

  // Redirect to home if already logged in
  useEffect(() => {
    if (user && success) {
      // Delay redirect for a nicer animation
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
        title={t('loginTitle')}
        subtitle="Enter your credentials to access your account"
      />

      {success && user && (
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {t('welcomeUser', { name: user.name || user.email.split('@')[0] })}
          </Alert>
        </MotionBox>
      )}

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
          onChange={() => error && dispatch(clearError())}
        />
      </MotionBox>

      {/* Forgot password link */}
      <MotionBox variants={itemVariants} sx={{ textAlign: 'right', mt: -1 }}>
        <Link href="/auth/forgot-password" style={{ textDecoration: 'none' }}>
          <Typography
            component={motion.p}
            whileHover={{ x: 3 }}
            variant="body2"
            color="primary"
            sx={{ display: 'inline-flex', alignItems: 'center' }}
          >
            {t('forgotPassword')}
          </Typography>
        </Link>
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

      {/* Login button */}
      <MotionBox variants={itemVariants}>
        <AuthButton
          type="submit"
          text={t('loginButton')}
          loading={loading}
          endIcon={<ArrowForward />}
        />
      </MotionBox>

      {/* Social buttons */}
      <SocialButtons />

      {/* Register link */}
      <MotionBox
        variants={itemVariants}
        sx={{
          mt: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('noAccount')}{' '}
          <Link href="/auth/register" style={{ textDecoration: 'none' }}>
            <Typography
              component={motion.span}
              whileHover={{ y: -1 }}
              color="primary"
              fontWeight="medium"
              display="inline"
            >
              {t('registerNow')}
            </Typography>
          </Link>
        </Typography>
      </MotionBox>
    </MotionBox>
  )
}
