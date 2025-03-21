// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from './authSlice'
import videoReducer from './videoSlice'
import settingsReducer from './settingsSlice'
import ttsReducer from './ttsSlice'
import imagesReducer from './imagesSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    images: imagesReducer,
    video: videoReducer,
    settings: settingsReducer,
    tts: ttsReducer,
  },
  // Optional: middleware, devTools, etc.
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Custom hook to use dispatch with correct type
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
