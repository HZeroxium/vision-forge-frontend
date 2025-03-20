// src/services/authService.ts
import api from './api'

export interface LoginResponse {
  access_token: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: string
  createdAt: string
}

export const login = async (credentials: {
  email: string
  password: string
}): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const register = async (data: {
  email: string
  password: string
  name?: string
}): Promise<User> => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const forgotPassword = async (
  email: string
): Promise<{ message: string; token: string }> => {
  const response = await api.post('/auth/forgot-password', { email })
  return response.data
}

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ message: string }> => {
  const response = await api.post('/auth/reset-password', {
    token,
    newPassword,
  })
  return response.data
}

export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  const response = await api.post('/auth/change-password', {
    oldPassword,
    newPassword,
  })
  return response.data
}

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/auth/profile')
  return response.data
}
