// src/utils/authHelper.ts
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  exp: number
  [key: string]: string | number | boolean | object | null
}

export function getTokenExpiration(token: string): number {
  const decoded: JwtPayload = jwtDecode<JwtPayload>(token)
  return decoded.exp
}

export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token)
  const now = Date.now() / 1000
  return expiration < now
}
