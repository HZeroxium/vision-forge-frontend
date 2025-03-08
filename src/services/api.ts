// src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // Placeholder: adjust accordingly
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for JWT
api.interceptors.request.use((config) => {
  // TODO: Retrieve token from store or localStorage
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
