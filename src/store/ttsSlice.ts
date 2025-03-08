// src/store/ttsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TTSState {
  voice: string
  speed: number
  tone: number
  volume: number
}

const initialState: TTSState = {
  voice: 'default',
  speed: 1,
  tone: 1,
  volume: 1,
}

const ttsSlice = createSlice({
  name: 'tts',
  initialState,
  reducers: {
    setTTSConfig(state, action: PayloadAction<Partial<TTSState>>) {
      Object.assign(state, action.payload)
    },
  },
})

export const { setTTSConfig } = ttsSlice.actions
export default ttsSlice.reducer
