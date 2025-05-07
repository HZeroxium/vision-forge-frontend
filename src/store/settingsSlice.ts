// src/store/settingsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SettingsState {
  theme: 'light' | 'dark'
  language: string
}

// Helper function to determine initial theme
const getInitialTheme = (): 'light' | 'dark' => {
  // This will run only on the client after hydration
  if (typeof window !== 'undefined') {
    // Try to get from localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    // If no localStorage value, check system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark'
    }
  }

  // Default to light theme
  return 'light'
}

const initialState: SettingsState = {
  theme: 'light', // Will be updated after hydration
  language: 'en',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload
    },
    initializeSettings(state) {
      state.theme = getInitialTheme()
    },
  },
})

export const { setTheme, setLanguage, initializeSettings } =
  settingsSlice.actions
export default settingsSlice.reducer
