// src/services/api.ts
import axios from 'axios'
import env from '@/config/env'

const api = axios.create({
  baseURL: env.API_URL, // Base URL from env
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // Always check for token on each request
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // If we're not already on the login page, redirect there
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/auth/login')
      ) {
        window.location.href = '/auth/login'
      }
    } else if (error.code === 'ECONNABORTED') {
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
