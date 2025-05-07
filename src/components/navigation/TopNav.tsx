'use client'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme as useMuiTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@/hooks/useTheme'

// Icons
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import LanguageIcon from '@mui/icons-material/Language'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import FlagIcon from '@mui/icons-material/Flag'
import MovieCreationIcon from '@mui/icons-material/MovieCreation'

// Components
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Toolbar,
  Avatar,
  Button,
  Box,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Container,
  useScrollTrigger,
  Slide,
  Fade,
  Paper,
} from '@mui/material'
import LoadingIndicator from '../common/LoadingIndicator'
import { useAppSelector, useAppDispatch } from '@store/store'
import { useRouter } from 'next/navigation'
import { fetchUserProfile, logout } from '@store/authSlice'

// Create motion components
const MotionBox = motion(Box)
const MotionIconButton = motion(IconButton)
const MotionAppBar = motion(AppBar)
const MotionTypography = motion(Typography)
const MotionContainer = motion(Container)
const MotionButton = motion(Button)

interface HideOnScrollProps {
  children: React.ReactElement
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children } = props
  const trigger = useScrollTrigger()

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

function TopNav() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))

  // Menu anchors
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null)
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  )

  // IMPORTANT: Always call useTranslation unconditionally
  const { t, i18n } = useTranslation('auth')

  // Show component after client-side rendering
  useEffect(() => {
    setVisible(true)
  }, [])

  // Check auth after component has mounted on client
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
    setLangAnchorEl(event.currentTarget)
  }

  const handleLangMenuClose = (lng?: string) => {
    if (lng) {
      i18n.changeLanguage(lng)
      localStorage.setItem('language', lng)
    }
    setLangAnchorEl(null)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null)
  }

  const handleProfileClick = () => {
    handleProfileMenuClose()
    router.push('/profile')
  }

  const handleSettingsClick = () => {
    handleProfileMenuClose()
    router.push('/settings')
  }

  const handleLogout = () => {
    handleProfileMenuClose()
    dispatch(logout())
    router.push('/')
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleCreateVideo = () => {
    router.push('/flow/generate-video')
  }

  // Static fallback content
  const staticContent = {
    login: 'Login',
    register: 'Register',
    welcome: user ? `Welcome, ${user.name || user.email}` : 'Welcome',
    createVideo: 'Create Video',
  }

  // Use translations only after mounted
  const content = {
    login: mounted ? t('loginTitle') : staticContent.login,
    register: mounted ? t('registerTitle') : staticContent.register,
    welcome:
      mounted && user
        ? t('welcomeUser', { name: user.name || user.email.split('@')[0] })
        : staticContent.welcome,
    createVideo: mounted
      ? t('createVideo', 'Create Video')
      : staticContent.createVideo,
  }

  // Don't render anything server-side
  if (!visible) {
    return null
  }

  // Drawer content for mobile
  const drawer = (
    <Box sx={{ width: 280 }} onClick={handleDrawerToggle}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MovieCreationIcon color="primary" />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Vision Forge
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/">
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={handleCreateVideo}>
            <ListItemIcon>
              <MovieCreationIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={content.createVideo} />
          </ListItemButton>
        </ListItem>

        {user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => router.push('/profile')}>
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => router.push('/settings')}>
                <ListItemIcon>
                  <SettingsIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => dispatch(logout())}>
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/auth/login">
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={content.login} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/auth/register">
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={content.register} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleLangMenuClose('en')}>
            <ListItemIcon>
              <FlagIcon />
            </ListItemIcon>
            <ListItemText primary="English" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleLangMenuClose('vi')}>
            <ListItemIcon>
              <FlagIcon />
            </ListItemIcon>
            <ListItemText primary="Tiếng Việt" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <HideOnScroll>
        <MotionAppBar
          position="sticky"
          elevation={0}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{
            background: isDarkMode
              ? 'linear-gradient(90deg, #0a1929 0%, #182848 100%)'
              : 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)',
            color: isDarkMode ? '#fff' : 'inherit',
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <MotionContainer
            maxWidth="xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Toolbar sx={{ py: 0.5 }}>
              {/* Logo and Brand */}
              <Link href="/" passHref style={{ textDecoration: 'none' }}>
                <MotionBox
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: isDarkMode ? 'white' : 'primary.main',
                    flexGrow: { xs: 1, md: 0 },
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <MovieCreationIcon sx={{ fontSize: 30 }} />
                  <MotionTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      background: isDarkMode
                        ? 'linear-gradient(90deg, #64B5F6 0%, #42A5F5 100%)'
                        : 'linear-gradient(90deg, #1976d2 30%, #2196f3 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Vision Forge
                  </MotionTypography>
                </MotionBox>
              </Link>

              {/* Desktop Navigation */}
              {!isMobile && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mx: 4,
                    gap: 1,
                  }}
                >
                  {/* Home Link */}
                  <Link href="/" passHref style={{ textDecoration: 'none' }}>
                    <MotionBox
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        color: isDarkMode ? 'white' : 'text.primary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                      whileHover={{
                        backgroundColor: isDarkMode
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(0,0,0,0.04)',
                        scale: 1.05,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <HomeIcon fontSize="small" />
                      <Typography>Home</Typography>
                    </MotionBox>
                  </Link>

                  {/* Create Video Button */}
                  <MotionButton
                    onClick={handleCreateVideo}
                    variant="contained"
                    startIcon={<MovieCreationIcon />}
                    sx={{
                      ml: 1,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 6px 20px rgba(0,118,255,0.45)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {content.createVideo}
                  </MotionButton>
                </Box>
              )}

              {/* Right side items */}
              <Box sx={{ flexGrow: 1 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {/* Toggle Dark Mode */}
                <MotionIconButton
                  color="inherit"
                  onClick={toggleTheme}
                  whileHover={{ rotate: 180, transition: { duration: 0.3 } }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </MotionIconButton>

                {/* Language Switcher */}
                {!isMobile && (
                  <MotionBox
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Tooltip title="Change language">
                      <Button
                        onClick={handleLangMenuOpen}
                        startIcon={<LanguageIcon />}
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                          mx: 1,
                          color: isDarkMode ? 'white' : 'text.primary',
                          textTransform: 'none',
                        }}
                      >
                        {i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}
                      </Button>
                    </Tooltip>
                    <Menu
                      anchorEl={langAnchorEl}
                      open={Boolean(langAnchorEl)}
                      onClose={() => handleLangMenuClose()}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          borderRadius: 2,
                          minWidth: 180,
                          mt: 1,
                          overflow: 'visible',
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem
                        onClick={() => handleLangMenuClose('en')}
                        selected={i18n.language === 'en'}
                      >
                        <ListItemIcon>
                          <Box
                            component="img"
                            src="/images/flags/us.svg"
                            alt="English"
                            sx={{ width: 24, height: 24, borderRadius: '50%' }}
                          />
                        </ListItemIcon>
                        <ListItemText primary="English" />
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleLangMenuClose('vi')}
                        selected={i18n.language === 'vi'}
                      >
                        <ListItemIcon>
                          <Box
                            component="img"
                            src="/images/flags/vn.svg"
                            alt="Tiếng Việt"
                            sx={{ width: 24, height: 24, borderRadius: '50%' }}
                          />
                        </ListItemIcon>
                        <ListItemText primary="Tiếng Việt" />
                      </MenuItem>
                    </Menu>
                  </MotionBox>
                )}

                {/* Auth Status / User Profile */}
                {authChecking ? (
                  <LoadingIndicator
                    isLoading={true}
                    size={24}
                    showAfterDelay={0}
                  />
                ) : user ? (
                  <MotionBox
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Tooltip title="Account settings">
                      <Button
                        onClick={handleProfileMenuOpen}
                        sx={{
                          textTransform: 'none',
                          color: isDarkMode ? 'white' : 'text.primary',
                        }}
                        endIcon={<KeyboardArrowDownIcon />}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 1,
                            bgcolor: 'primary.main',
                            border: '2px solid',
                            borderColor: 'primary.light',
                          }}
                        >
                          {user.name
                            ? user.name.charAt(0).toUpperCase()
                            : user.email.charAt(0).toUpperCase()}
                        </Avatar>
                        {!isMobile && (
                          <Typography variant="body2">
                            {user.name || user.email.split('@')[0]}
                          </Typography>
                        )}
                      </Button>
                    </Tooltip>
                    <Menu
                      anchorEl={profileAnchorEl}
                      open={Boolean(profileAnchorEl)}
                      onClose={handleProfileMenuClose}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          borderRadius: 2,
                          minWidth: 220,
                          mt: 1,
                          overflow: 'visible',
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {user.name || user.email.split('@')[0]}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem onClick={handleProfileClick}>
                        <ListItemIcon>
                          <AccountCircleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="My Profile" />
                      </MenuItem>
                      <MenuItem onClick={handleSettingsClick}>
                        <ListItemIcon>
                          <SettingsIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Logout"
                          primaryTypographyProps={{ color: 'error' }}
                        />
                      </MenuItem>
                    </Menu>
                  </MotionBox>
                ) : (
                  !isMobile && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* Login Button */}
                      <Link
                        href="/auth/login"
                        passHref
                        style={{ textDecoration: 'none' }}
                      >
                        <MotionButton
                          variant="outlined"
                          startIcon={<PersonIcon />}
                          sx={{
                            borderRadius: 2,
                            borderWidth: 2,
                            '&:hover': { borderWidth: 2 },
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {content.login}
                        </MotionButton>
                      </Link>

                      {/* Register Button */}
                      <Link
                        href="/auth/register"
                        passHref
                        style={{ textDecoration: 'none' }}
                      >
                        <MotionButton
                          variant="contained"
                          sx={{
                            borderRadius: 2,
                            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {content.register}
                        </MotionButton>
                      </Link>
                    </Box>
                  )
                )}

                {/* Mobile menu button */}
                {isMobile && (
                  <MotionIconButton
                    color="inherit"
                    edge="end"
                    onClick={handleDrawerToggle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MenuIcon />
                  </MotionIconButton>
                )}
              </Box>
            </Toolbar>
          </MotionContainer>
        </MotionAppBar>
      </HideOnScroll>

      {/* Mobile drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better performance on mobile
          }}
          PaperProps={{
            sx: {
              width: '80%',
              maxWidth: 300,
              boxSizing: 'border-box',
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  )
}

export default TopNav
