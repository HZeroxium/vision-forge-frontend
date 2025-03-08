// src/utils/authHelper.ts
import { jwtDecode } from 'jwt-decode'

export function getTokenExpiration(token: string): number {
  const decoded: any = jwtDecode(token)
  return decoded.exp
}

export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token)
  const now = Date.now() / 1000
  return expiration < now
}
