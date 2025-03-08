// src/services/authService.ts
import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: any // Replace with actual user type
  token: string
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials) // <TODO>: Update endpoint if needed
  return response.data
}

export const register = async (data: any): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data) // <TODO>: Update endpoint if needed
  return response.data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout') // <TODO>: Update endpoint if needed
}
