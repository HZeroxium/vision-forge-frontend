// src/modules/tts/ttsAPI.ts
import api from '@services/api'

interface TTSConfig {
  voice: string
  speed: number
  tone: number
  volume: number
}

export const fetchTTSConfig = async () => {
  const response = await api.get('/tts/config') // <TODO>: Adjust endpoint
  return response.data
}

export const updateTTSConfig = async (config: TTSConfig) => {
  const response = await api.put('/tts/config', config) // <TODO>: Adjust endpoint
  return response.data
}
