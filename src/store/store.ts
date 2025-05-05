// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from './authSlice'
import videoReducer from './videoSlice'
import settingsReducer from './settingsSlice'
import imagesReducer from './imagesSlice'
import audiosReducer from './audiosSlice'
import scriptsReducer from './scriptsSlice'
import publisherReducer from './publisherSlice'
import youtubeReducer from './youtubeSlice'
import storageReducer from './storageSlice'
import pineconeReducer from './pineconeSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    images: imagesReducer,
    audios: audiosReducer,
    video: videoReducer,
    settings: settingsReducer,
    scripts: scriptsReducer,
    publisher: publisherReducer,
    youtube: youtubeReducer,
    storage: storageReducer,
    pinecone: pineconeReducer,
  },
  // Optional: middleware, devTools, etc.
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Custom hook to use dispatch with correct type
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
