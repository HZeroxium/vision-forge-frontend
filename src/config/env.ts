// src/config/env.ts
// Simple environment configuration
const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  FASTAPI_URL: process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000',
}

export default env
