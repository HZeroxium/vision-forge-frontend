// src/hooks/useTheme.ts
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { setTheme } from '../store/settingsSlice'
import { useCallback, useEffect } from 'react'

const useTheme = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.settings.theme)

  // Load theme from localStorage on first render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      if (savedTheme !== theme) {
        dispatch(setTheme(savedTheme))
      }
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      const systemTheme = prefersDark ? 'dark' : 'light'
      if (systemTheme !== theme) {
        dispatch(setTheme(systemTheme))
      }
    }
  }, [dispatch])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', newTheme)
    dispatch(setTheme(newTheme))
  }, [dispatch, theme])

  const setMode = useCallback(
    (mode: 'light' | 'dark') => {
      localStorage.setItem('theme', mode)
      dispatch(setTheme(mode))
    },
    [dispatch]
  )

  return { theme, toggleTheme, setMode, isDarkMode: theme === 'dark' }
}

export default useTheme
