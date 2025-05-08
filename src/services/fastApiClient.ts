// /src/services/fastApiClient.ts

import axios from 'axios'
import env from '@/config/env'

// Create a dedicated client for the FastAPI server
const fastApiClient = axios.create({
  baseURL: env.FASTAPI_URL || 'http://localhost:8000',
  timeout: 30000,
  withCredentials: false, // Important for CORS
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor to attach JWT token
fastApiClient.interceptors.request.use(
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
fastApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CORS errors specifically
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.error(
        'CORS error or network issue: Unable to connect to FastAPI server'
      )
    }
    // Handle 401 Unauthorized errors (token expired or invalid)
    else if (error.response && error.response.status === 401) {
      console.error('Unauthorized access to FastAPI service')
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request to FastAPI timed out')
    } else if (!error.response) {
      console.error('Network error: FastAPI server unreachable')
    } else {
      console.error('FastAPI Error:', error.response.data)
    }
    return Promise.reject(error)
  }
)

export default fastApiClient
