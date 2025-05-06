// src/hooks/useAuth.ts
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@store/store'
import {
  loginAsync,
  registerAsync,
  logout as logoutAction,
  forgotPasswordAsync,
  resetPasswordAsync,
  changePasswordAsync,
  fetchUserProfile,
  updateProfileAsync,
  clearError as clearErrorAction,
} from '@store/authSlice'
import type { UpdateProfileDto } from '@services/userService'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, loading, error } = useAppSelector((state) => state.auth)

  const login = async (email: string, password: string) => {
    try {
      await dispatch(loginAsync({ email, password })).unwrap()
      return true
    } catch (err) {
      return false
    }
  }

  const register = async (
    email: string,
    password: string,
    name?: string,
    description?: string
  ) => {
    try {
      await dispatch(registerAsync({ email, password, name })).unwrap()
      return true
    } catch (err) {
      return false
    }
  }

  const logout = () => {
    dispatch(logoutAction())
  }

  const forgotPassword = async (email: string) => {
    try {
      await dispatch(forgotPasswordAsync({ email })).unwrap()
      return true
    } catch (err) {
      return false
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await dispatch(resetPasswordAsync({ token, newPassword })).unwrap()
      return true
    } catch (err) {
      return false
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await dispatch(changePasswordAsync({ oldPassword, newPassword })).unwrap()
      return true
    } catch (err) {
      return false
    }
  }

  const updateProfile = async (profileData: UpdateProfileDto) => {
    try {
      await dispatch(updateProfileAsync(profileData)).unwrap()
      return true
    } catch (err) {
      return false
    }
  }

  const loadProfile = async () => {
    try {
      await dispatch(fetchUserProfile()).unwrap()
      return true
    } catch (err) {
      return false
    }
  }

  const clearError = () => {
    dispatch(clearErrorAction())
  }

  // Initialize auth state when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !user) {
      loadProfile()
    }
  }, [])

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    loadProfile,
    clearError,
  }
}
