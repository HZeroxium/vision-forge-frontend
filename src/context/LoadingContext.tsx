import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingContextType {
  isLoading: boolean
  startLoading: (message?: string) => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const startLoading = (newMessage?: string) => {
    setIsLoading(true)
    setMessage(newMessage)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setMessage(undefined)
  }

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              padding: 3,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 3,
            }}
          >
            <CircularProgress size={60} thickness={4} />
            {message && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </LoadingContext.Provider>
  )
}
