// src/styles/theme.ts'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ReactNode } from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: ['"Roboto"', 'sans-serif'].join(','),
  },
})

export default function MUIThemeProvider({
  children,
}: {
  children: ReactNode
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
