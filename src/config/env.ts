// src/config/env.ts
const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here',
}
// Add another environment variable
export default env
