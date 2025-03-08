// src/hooks/useTheme.ts
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { setTheme } from '../store/settingsSlice'
import { useCallback } from 'react'

const useTheme = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.settings.theme)

  const toggleTheme = useCallback(() => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }, [dispatch, theme])

  return { theme, toggleTheme }
}

export default useTheme
