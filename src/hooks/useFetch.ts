// src/hooks/useFetch.ts
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

// Generic hook for fetching data
const useFetch = <T>(key: string, url: string) => {
  return useQuery<T>({
    queryKey: [key],
    queryFn: async () => {
      const response = await axios.get(url)
      return response.data
    },
  })
}

export default useFetch
