// src/components/navigation/TopNav.tsx
'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import LanguageIcon from '@mui/icons-material/Language'
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
} from '@mui/material'
import { useAppSelector } from '@store/store'
import { useRouter } from 'next/navigation'

export default function TopNav() {
  const { i18n, t } = useTranslation('auth')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { user } = useAppSelector((state) => state.auth) // Get user from auth slice
  const router = useRouter()

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

  return (
    <AppBar position="static" color="inherit" className="shadow-md">
      <Toolbar className="flex justify-between">
        {/* Left side: brand or home link */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <HomeIcon fontSize="medium" />
          <Typography variant="h6" className="text-inherit no-underline">
            Vision Forge
          </Typography>
        </Link>

        {/* Right side: Conditional rendering based on auth state */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Typography variant="body1">
                {t('welcomeUser', { name: user.name || user.email })}
              </Typography>
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
                <Typography variant="body1">{t('loginTitle')}</Typography>
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1 no-underline"
              >
                <Typography variant="body1">{t('registerTitle')}</Typography>
              </Link>
            </>
          )}

          {/* Language Switcher */}
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
