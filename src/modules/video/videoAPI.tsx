// src/modules/video/videoAPI.ts
import api from '@services/api'

export const fetchVideos = async () => {
  const response = await api.get('/videos') // <TODO>: Adjust endpoint
  return response.data
}

export const createVideo = async (data: any) => {
  const response = await api.post('/videos', data) // <TODO>: Adjust endpoint
  return response.data
}

export const updateVideo = async (id: string, data: any) => {
  const response = await api.put(`/videos/${id}`, data) // <TODO>: Adjust endpoint
  return response.data
}
