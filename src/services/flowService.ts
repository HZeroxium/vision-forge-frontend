// src/services/flowService.ts
import { JobProgress } from '@/utils/sse'
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
  prompts: string[]
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

// Original synchronous method with improved error handling
export const generateVideoFlow = async (data: {
  scriptId: string
  imageUrls: string[]
  scripts: string[]
}): Promise<Video> => {
  try {
    console.log('Requesting video generation with data:', {
      scriptId: data.scriptId,
      imagesCount: data.imageUrls.length,
      scriptsCount: data.scripts.length,
    })

    const response = await api.post('/flow/generate-video', data)

    if (!response.data || !response.data.url) {
      console.error('Invalid video generation response:', response.data)
      throw new Error('Invalid response from video generation API')
    }

    console.log('Video generation successful:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Video generation failed:', error)
    throw new Error(
      `Failed to generate video: ${error.message || 'Unknown error'}`
    )
  }
}

// New asynchronous job-based method with progress tracking
export const startVideoGenerationJob = async (data: {
  scriptId: string
  imageUrls: string[]
  scripts: string[]
}): Promise<VideoJobResponse> => {
  try {
    console.log('Starting video generation job with data:', {
      scriptId: data.scriptId,
      imagesCount: data.imageUrls.length,
      scriptsCount: data.scripts.length,
    })

    const response = await api.post('/flow/generate-video-job', data)

    if (!response.data || !response.data.jobId) {
      throw new Error('Invalid response from job creation API')
    }

    console.log('Video generation job started:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Failed to start video generation job:', error)
    throw new Error(
      `Failed to start video job: ${error.message || 'Unknown error'}`
    )
  }
}

// Improved job status function that includes potential result data
export const getJobStatus = async (
  jobId: string
): Promise<JobProgress & { result?: any }> => {
  try {
    const response = await api.get(`/flow/job/${jobId}/status`)
    console.log(`Job status for ${jobId}:`, response.data)
    return response.data
  } catch (error: any) {
    console.error(`Error fetching status for job ${jobId}:`, error)
    throw new Error(
      `Failed to get job status: ${error.message || 'Unknown error'}`
    )
  }
}

// Get the final video once the job is complete
export const getVideoById = async (videoId: string): Promise<Video> => {
  const response = await api.get(`/videos/${videoId}`)
  return response.data
}

// Get video by scriptId - add this new function
export const getVideoByScriptId = async (scriptId: string): Promise<Video> => {
  try {
    const response = await api.get(`/flow/video-by-script/${scriptId}`)
    console.log(`Retrieved video for script ${scriptId}:`, response.data)
    return response.data
  } catch (error: any) {
    console.error(`Error fetching video for script ${scriptId}:`, error)
    throw new Error(
      `Failed to get video by script ID: ${error.message || 'Unknown error'}`
    )
  }
}
