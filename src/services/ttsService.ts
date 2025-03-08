// src/services/ttsService.ts
import api from './api'

export interface TTSConfig {
  voice: string
  speed: number
  tone: number
  volume: number
}

export const getTTSConfig = async (): Promise<TTSConfig> => {
  const response = await api.get('/tts/config') // <TODO>: Adjust endpoint
  return response.data
}

export const updateTTSConfig = async (
  config: Partial<TTSConfig>
): Promise<TTSConfig> => {
  const response = await api.put('/tts/config', config) // <TODO>: Adjust endpoint
  return response.data
}
