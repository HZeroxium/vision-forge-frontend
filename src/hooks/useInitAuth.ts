import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/store'
import { fetchUserProfile } from '@store/authSlice'

export const useInitAuth = () => {
  const dispatch = useAppDispatch()
  const { user, loading } = useAppSelector((state) => state.auth)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')

      if (token && !user) {
        try {
          await dispatch(fetchUserProfile())
        } catch (error) {
          console.error('Failed to initialize authentication:', error)
        }
      }

      setIsInitialized(true)
    }

    initAuth()
  }, [dispatch, user])

  return {
    isAuthenticated: !!user,
    isInitialized,
    isLoading: loading && !isInitialized,
    user,
  }
}
