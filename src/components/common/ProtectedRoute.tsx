import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@store/store'
import { toast } from 'react-hot-toast' // Assuming you're using react-hot-toast for notifications

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      // Show notification
      toast.error('Please log in to access this page')
      // Redirect to login page
      router.push('/auth/login')
    }
  }, [user, router])

  // If user is authenticated, render the children
  // Otherwise, return null (component will redirect during useEffect)
  return user ? <>{children}</> : null
}

export default ProtectedRoute
