// src/modules/dashboard/dashboardAPI.ts
import api from '../../services/api'

export const fetchDashboardData = async () => {
  const response = await api.get('/dashboard') // <TODO>: Adjust endpoint if needed
  return response.data
}
