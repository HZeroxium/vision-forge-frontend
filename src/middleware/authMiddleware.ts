// src/middleware/authMiddleware.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import jwt from 'jsonwebtoken'

export function authMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header missing' })
      return
    }
    const token = authHeader.split(' ')[1]
    try {
      // <TODO>: Replace with your actual secret or public key
      jwt.verify(token, process.env.JWT_SECRET as string)
      return handler(req, res)
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token' })
    }
  }
}
