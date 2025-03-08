// src/modules/tts/ttsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TTSState {
  config: {
    voice: string
    speed: number
    tone: number
    volume: number
  }
}

const initialState: TTSState = {
  config: {
    voice: 'default',
    speed: 1,
    tone: 1,
    volume: 1,
  },
}

const ttsSlice = createSlice({
  name: 'tts',
  initialState,
  reducers: {
    setTTSConfig(state, action: PayloadAction<TTSState['config']>) {
      state.config = action.payload
    },
  },
})

export const { setTTSConfig } = ttsSlice.actions
export default ttsSlice.reducer
