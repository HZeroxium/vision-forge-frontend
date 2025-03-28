// app/components/navigation/TopNav.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import LanguageIcon from '@mui/icons-material/Language'
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Toolbar,
} from '@mui/material'
import { useAppSelector } from '@store/store'
import { useRouter } from 'next/navigation'

function TopNav() {
  // Always call hooks at the top level in the same order
  const [mounted, setMounted] = useState(false)
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  // IMPORTANT: Always call useTranslation unconditionally
  const { t, i18n } = useTranslation('auth')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLangMenuClose = (lng?: string) => {
    if (lng) {
      i18n.changeLanguage(lng)
    }
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  // Define static fallback content
  const staticContent = {
    login: 'Login',
    register: 'Register',
    welcome: user ? `Welcome, ${user.name || user.email}` : 'Welcome',
  }

  // Use translations only after mounted, but don't conditionally call hooks
  const content = {
    login: mounted ? t('loginTitle') : staticContent.login,
    register: mounted ? t('registerTitle') : staticContent.register,
    welcome:
      mounted && user
        ? t('welcomeUser', { name: user.name || user.email })
        : staticContent.welcome,
  }

  return (
    <AppBar position="static" color="inherit" className="shadow-md">
      <Toolbar className="flex justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <HomeIcon fontSize="medium" />
          <Typography variant="h6" className="text-inherit no-underline">
            Vision Forge
          </Typography>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Typography variant="body1">{content.welcome}</Typography>
              <IconButton onClick={handleProfileClick} color="inherit">
                <PersonIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="flex items-center gap-1 no-underline"
              >
                <PersonIcon fontSize="small" />
                <Typography variant="body1">{content.login}</Typography>
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1 no-underline"
              >
                <Typography variant="body1">{content.register}</Typography>
              </Link>
            </>
          )}
          <IconButton
            onClick={handleLangMenuOpen}
            color="primary"
            aria-label="language switcher"
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleLangMenuClose()}
          >
            <MenuItem onClick={() => handleLangMenuClose('en')}>
              English
            </MenuItem>
            <MenuItem onClick={() => handleLangMenuClose('vi')}>
              Tiếng Việt
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default TopNav
