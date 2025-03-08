// src/services/videoService.ts
import api from './api'

export interface Video {
  id: string
  title: string
  status: string
  // Other fields as needed
}

export const fetchVideos = async (): Promise<Video[]> => {
  const response = await api.get('/videos') // <TODO>: Adjust endpoint
  return response.data
}

export const uploadVideo = async (videoData: FormData): Promise<Video> => {
  const response = await api.post('/videos/upload', videoData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) // <TODO>: Adjust endpoint
  return response.data
}

export const updateVideo = async (id: string, data: any): Promise<Video> => {
  const response = await api.put(`/videos/${id}`, data) // <TODO>: Adjust endpoint
  return response.data
}
