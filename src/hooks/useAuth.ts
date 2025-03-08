// src/hooks/useAuth.ts
import { useSelector } from 'react-redux'
import type { RootState } from '@store/store'
import { useCallback } from 'react'
import { useAppDispatch } from '@store/store'
import { setCredentials, logout } from '@store/authSlice'
// Import authService for API calls
import { loginAPI } from '@modules/auth/authAPI'

const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useSelector((state: RootState) => state.auth)

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      // Call API (placeholder)
      const data = await loginAPI(credentials) // <TODO: Implement actual API call
      dispatch(setCredentials({ user: data.user, token: data.token }))
    },
    [dispatch]
  )

  const signOut = useCallback(() => {
    // Clear token and user info
    dispatch(logout())
    // Additional cleanup if needed
  }, [dispatch])

  return { auth, login, signOut }
}

export default useAuth
