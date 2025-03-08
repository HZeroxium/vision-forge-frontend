// src/middleware/errorHandler.ts
import { NextApiRequest, NextApiResponse } from 'next'

interface Error {
  statusCode?: number
  message?: string
}

export default function errorHandler(
  err: Error,
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.error('Error:', err)
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || 'Internal Server Error' })
}
