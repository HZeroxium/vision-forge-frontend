// src/modules/analytics/analyticsAPI.ts
import api from '@services/api'

export const fetchAnalyticsData = async () => {
  const response = await api.get('/analytics') // <TODO>: Adjust endpoint
  return response.data
}
