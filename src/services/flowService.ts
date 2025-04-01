// src/services/flowService.ts
import api from './api'
import { Video } from './videoService'

export interface AudioConfig {
  speed: number
  voice: string
  instructions: string
}

export interface ImagesScripts {
  image_urls: string[]
  scripts: string[]
}

export interface AudioPreview {
  id: string
  description: string
}

// Fetch preview URL for a specific voice
export const getPreviewVoiceUrl = async (voiceId: string): Promise<string> => {
  const response = await api.get(`/flow/preview-voice?voice_id=${voiceId}`)
  return response.data.url
}

export const generateImages = async (data: {
  content: string
  style: string
}): Promise<ImagesScripts> => {
  const response = await api.post('/flow/generate-images', data)
  return response.data
}

export const generateVideoFlow = async (data: {
  scriptId: string
  imageUrls: string[]
  scripts: string[]
}): Promise<Video> => {
  const response = await api.post('/flow/generate-video', data)
  return response.data
}
