// src/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Customize default query settings (e.g., staleTime, cacheTime)
      staleTime: 60000, // 1 minute
      retry: 1,
    },
  },
})

export default queryClient
