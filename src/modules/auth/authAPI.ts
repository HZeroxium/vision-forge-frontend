// src/modules/auth/authAPI.ts
import api from '@services/api'

export const loginAPI = async (credentials: {
  email: string
  password: string
}) => {
  const response = await api.post('/auth/login', credentials) // <TODO>: Adjust endpoint
  return response.data
}

export interface RegisterCredentials {
  email: string
  password: string
  name?: string
  // Add other fields your registration requires
}

export const registerAPI = async (data: RegisterCredentials) => {
  const response = await api.post('/auth/register', data) // <TODO>: Adjust endpoint
  return response.data
}
