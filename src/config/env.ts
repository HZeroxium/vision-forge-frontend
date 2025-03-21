// src/config/env.ts
const env = {
  API_URL: process.env.NEST_API_URL || 'http://localhost:5000/api',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here',
}
// Add another environment variable
export default env
