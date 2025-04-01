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

export interface VideoJobResponse {
  message: string
  scriptId: string
  jobId: string
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

// Original synchronous method (will be kept for compatibility)
export const generateVideoFlow = async (data: {
  scriptId: string
  imageUrls: string[]
  scripts: string[]
}): Promise<Video> => {
  const response = await api.post('/flow/generate-video', data)
  return response.data
}

// New asynchronous job-based method with progress tracking
export const startVideoGenerationJob = async (data: {
  scriptId: string
  imageUrls: string[]
  scripts: string[]
}): Promise<VideoJobResponse> => {
  const response = await api.post('/flow/generate-video-job', data)
  return response.data
}

// Get status for a specific job
export const getJobStatus = async (jobId: string): Promise<any> => {
  const response = await api.get(`/flow/job/${jobId}/status`)
  return response.data
}

// Get the final video once the job is complete
export const getVideoById = async (videoId: string): Promise<Video> => {
  const response = await api.get(`/videos/${videoId}`)
  return response.data
}
