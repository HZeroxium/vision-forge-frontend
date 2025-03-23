// src/services/flowService.ts
import api from './api'
import { Video } from './videoService'

export const generateVideoFlow = async (data: {
  scriptId: string
}): Promise<Video> => {
  const response = await api.post('/flow/generate-video', data)
  return response.data
}
