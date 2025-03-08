// src/modules/tts/ttsAPI.ts
import api from '../../services/api'

export const fetchTTSConfig = async () => {
  const response = await api.get('/tts/config') // <TODO>: Adjust endpoint
  return response.data
}

export const updateTTSConfig = async (config: any) => {
  const response = await api.put('/tts/config', config) // <TODO>: Adjust endpoint
  return response.data
}
