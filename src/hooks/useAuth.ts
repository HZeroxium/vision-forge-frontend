// src/hooks/useAuth.ts
import { useEffect, useState } from 'react'
import * as authService from '../services/authService'
import { User } from '../services/authService'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.login({ email, password })
      // Save token in localStorage
      localStorage.setItem('token', data.access_token)
      // Fetch user profile
      const profile = await authService.getProfile()
      setUser(profile)
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    setLoading(true)
    setError(null)
    try {
      const newUser = await authService.register({ email, password, name })
      setUser(newUser)
    } catch (err) {
      setError('Registration failed. Email might already be registered.')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const forgotPassword = async (email: string) => {
    setLoading(true)
    try {
      const response = await authService.forgotPassword(email)
      return response // Return the response
    } catch (err) {
      setError('Forgot password request failed.')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true)
    try {
      const response = await authService.resetPassword(token, newPassword)
      return response
    } catch (err) {
      setError('Reset password failed.')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    setLoading(true)
    try {
      const response = await authService.changePassword(
        oldPassword,
        newPassword
      )
      return response
    } catch (err) {
      setError('Change password failed.')
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async () => {
    setLoading(true)
    try {
      const profile = await authService.getProfile()
      setUser(profile)
    } catch (err) {
      setError('Failed to load profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadProfile()
    }
  }, [])

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    loadProfile,
  }
}
