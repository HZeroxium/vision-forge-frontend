// src/services/analyticsService.ts
import api from './api'

export interface AnalyticsData {
  views: number
  likes: number
  comments: number
  // Other metrics as needed
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get('/analytics') // <TODO>: Adjust endpoint
  return response.data
}
