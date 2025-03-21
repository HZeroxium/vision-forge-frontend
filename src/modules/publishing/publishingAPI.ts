// src/modules/publishing/publishingAPI.ts
import api from '../../services/api'

export const fetchPublishingData = async () => {
  const response = await api.get('/publishing') // <TODO>: Adjust endpoint
  return response.data
}

export const publishVideo = async (videoId: string, data: unknown) => {
  const response = await api.post(`/publishing/${videoId}`, data) // <TODO>: Adjust endpoint
  return response.data
}
