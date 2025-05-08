'use client'
import {
  createTheme,
  ThemeProvider,
  Theme,
  PaletteMode,
} from '@mui/material/styles'
import { ReactNode, useMemo, useEffect, useState } from 'react'
import { CssBaseline } from '@mui/material'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

// Define theme settings for both light and dark modes
const getThemeSettings = (mode: PaletteMode) => {
  return {
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode palette
            primary: {
              main: '#1976d2',
              light: '#42a5f5',
              dark: '#1565c0',
            },
            secondary: {
              main: '#dc004e',
              light: '#ff4081',
              dark: '#c51162',
            },
            background: {
              default: '#f8f9fa',
              paper: '#ffffff',
            },
            text: {
              primary: '#171717',
              secondary: '#757575',
            },
            divider: 'rgba(0, 0, 0, 0.08)',
          }
        : {
            // Dark mode palette
            primary: {
              main: '#2196f3',
              light: '#4dabf5',
              dark: '#1769aa',
            },
            secondary: {
              main: '#f50057',
              light: '#ff4081',
              dark: '#c51162',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: '#b0b0b0',
            },
            divider: 'rgba(255, 255, 255, 0.12)',
          }),
    },
    typography: {
      fontFamily: ['"Roboto"', 'sans-serif'].join(','),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
            scrollBehavior: 'smooth',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
  }
}

export default function MUIThemeProvider({
  children,
}: {
  children: ReactNode
}) {
  // Get theme preference from Redux store
  const themeMode = useSelector((state: RootState) => state.settings.theme)

  // Add client-side protection with a state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)

  // Create the theme based on the mode
  const theme = useMemo(
    () => createTheme(getThemeSettings(themeMode as PaletteMode)),
    [themeMode]
  )

  // After hydration, we can safely show the UI
  useEffect(() => {
    setMounted(true)

    // Sync theme with system preferences if needed
    const syncThemeWithSystem = () => {
      // You can add logic here to sync with system preferences if needed
      // This is just a placeholder for future enhancements
    }

    syncThemeWithSystem()
  }, [])

  if (!mounted) {
    // Return a minimal theme provider during SSR to prevent hydration mismatch
    return (
      <ThemeProvider theme={createTheme(getThemeSettings('light'))}>
        {children}
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

// Export a helper function to access specific theme colors based on current mode
export const getThemeColors = (theme: Theme) => {
  return {
    gradient: {
      primary:
        theme.palette.mode === 'light'
          ? 'linear-gradient(90deg, #1976d2 30%, #2196f3 90%)'
          : 'linear-gradient(90deg, #2196f3 30%, #42a5f5 90%)',
      secondary:
        theme.palette.mode === 'light'
          ? 'linear-gradient(90deg, #dc004e 30%, #ff4081 90%)'
          : 'linear-gradient(90deg, #f50057 30%, #ff4081 90%)',
    },
    // Add more custom color helpers as needed
  }
}
