// src/modules/auth/authAPI.ts
// src/modules/auth/authAPI.ts
import api from '@services/api'

export const loginAPI = async (credentials: {
  email: string
  password: string
}) => {
  const response = await api.post('/auth/login', credentials) // <TODO>: Adjust endpoint
  return response.data
}

export const registerAPI = async (data: any) => {
  const response = await api.post('/auth/register', data) // <TODO>: Adjust endpoint
  return response.data
}
