// src/services/api.ts
import axios from 'axios'
import env from '@/config/env'

const api = axios.create({
  baseURL: env.API_URL, // Base URL from env
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') // Or get from Redux store
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out')
    } else if (!error.response) {
      console.error('Network error: Backend unreachable') // 🌐
    } else {
      console.error('API Error:', error.response.data)
    }
    return Promise.reject(error)
  }
)

export default api
