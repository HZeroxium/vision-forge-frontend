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
import LoadingIndicator from '../common/LoadingIndicator'
import { useAppSelector, useAppDispatch } from '@store/store'
import { useRouter } from 'next/navigation'
import { fetchUserProfile } from '@store/authSlice'

function TopNav() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const dispatch = useAppDispatch()

  // IMPORTANT: Always call useTranslation unconditionally
  const { t, i18n } = useTranslation('auth')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Hiển thị component sau khi client-side rendering
  useEffect(() => {
    setVisible(true)
  }, [])

  // Chỉ kiểm tra auth sau khi component đã được mount ở client
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        if (!user) {
          try {
            await dispatch(fetchUserProfile())
          } catch (error) {
            console.error('Error loading user profile:', error)
          }
        }
      }

      setAuthChecking(false)
      setMounted(true)
    }

    checkAuth()
  }, [dispatch, user])

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

  // Static fallback content
  const staticContent = {
    login: 'Login',
    register: 'Register',
    welcome: user ? `Welcome, ${user.name || user.email}` : 'Welcome',
  }

  // Use translations only after mounted
  const content = {
    login: mounted ? t('loginTitle') : staticContent.login,
    register: mounted ? t('registerTitle') : staticContent.register,
    welcome:
      mounted && user
        ? t('welcomeUser', { name: user.name || user.email })
        : staticContent.welcome,
  }

  // Không render gì khi ở server-side
  if (!visible) {
    return null
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
          {authChecking ? (
            <LoadingIndicator isLoading={true} size={24} showAfterDelay={0} />
          ) : user ? (
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
