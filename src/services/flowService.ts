// src/services/flowService.ts
import api from './api'
import { Video } from './videoService'

export interface AudioConfig {
  speed: number
  voice: string
  instructions: string
}

// Mocked preview audio function – simulates generating a sample audio preview based on configuration.
export const previewAudio = async (
  config: AudioConfig
): Promise<{ url: string }> => {
  // Simulate a delay and return a mocked audio preview URL
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          url: 'https://vision-forge.sgp1.cdn.digitaloceanspaces.com/audio/ffbca4e3617249949181fd96eb5c6a02.mp3',
        }),
      1000
    )
  })
}

export const generateVideoFlow = async (data: {
  scriptId: string
}): Promise<Video> => {
  const response = await api.post('/flow/generate-video', data)
  return response.data
}
