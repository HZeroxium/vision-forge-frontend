// src/middleware/errorHandler.ts
import { NextApiRequest, NextApiResponse } from 'next'
import Error from 'next/error'

export default function errorHandler(
  err: Error,
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.error(err)
  res.status(500).json({ message: 'Internal Server Error' })
}
