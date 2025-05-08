'use client'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme as useMuiTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@/hooks/useTheme'
import Grid from '@mui/material/Grid2'

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
  alpha,
} from '@mui/material'
import LoadingIndicator from '../common/LoadingIndicator'
import { useAppSelector, useAppDispatch } from '@store/store'
import { useRouter } from 'next/navigation'
import { fetchUserProfile, logout } from '@store/authSlice'
import { fadeIn } from '@/utils/animations'

// Create motion components
const MotionBox = motion(Box)
const MotionIconButton = motion(IconButton)
const MotionAppBar = motion(AppBar)
const MotionTypography = motion(Typography)
const MotionContainer = motion(Container)
const MotionButton = motion(Button)
const MotionPaper = motion(Paper)
const MotionDrawer = motion(Drawer)

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
  const theme = useMuiTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

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

  // Enhanced animation variants
  const itemFadeIn = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  // Drawer content for mobile
  const drawer = (
    <MotionBox
      sx={{ width: 280 }}
      onClick={handleDrawerToggle}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MotionBox
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MotionBox
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar
              sx={{
                bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <MovieCreationIcon
                sx={{
                  color: 'white',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                }}
              />
            </Avatar>
          </MotionBox>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            Vision Forge
          </Typography>
        </Box>
        <MotionIconButton
          onClick={handleDrawerToggle}
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <CloseIcon />
        </MotionIconButton>
      </MotionBox>

      <Divider sx={{ opacity: 0.6 }} />

      <List>
        {[
          { icon: <HomeIcon color="primary" />, text: 'Home', href: '/' },
          {
            icon: <MovieCreationIcon color="primary" />,
            text: content.createVideo,
            onClick: handleCreateVideo,
          },
        ].map((item, index) => (
          <MotionBox
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                component={item.href ? Link : 'button'}
                href={item.href}
                onClick={item.onClick}
                sx={{
                  borderRadius: 2,
                  my: 0.5,
                  mx: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </MotionBox>
        ))}
      </List>

      <Divider sx={{ my: 1, opacity: 0.6 }} />

      <List>
        {user ? (
          <>
            {[
              {
                icon: <AccountCircleIcon color="primary" />,
                text: 'Profile',
                onClick: () => router.push('/profile'),
              },
              {
                icon: <SettingsIcon color="primary" />,
                text: 'Settings',
                onClick: () => router.push('/settings'),
              },
              {
                icon: <LogoutIcon color="error" />,
                text: 'Logout',
                onClick: () => dispatch(logout()),
                textColor: 'error.main',
              },
            ].map((item, index) => (
              <MotionBox
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={item.onClick}
                    sx={{
                      borderRadius: 2,
                      my: 0.5,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: item.textColor
                          ? alpha(theme.palette.error.main, 0.08)
                          : alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: item.textColor,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </MotionBox>
            ))}
          </>
        ) : (
          <>
            {[
              {
                icon: <PersonIcon color="primary" />,
                text: content.login,
                href: '/auth/login',
              },
              {
                icon: <PersonIcon color="primary" />,
                text: content.register,
                href: '/auth/register',
              },
            ].map((item, index) => (
              <MotionBox
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    sx={{
                      borderRadius: 2,
                      my: 0.5,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.08
                        ),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              </MotionBox>
            ))}
          </>
        )}
      </List>

      <Divider sx={{ my: 1, opacity: 0.6 }} />

      <List>
        <Typography
          variant="overline"
          sx={{
            pl: 3,
            opacity: 0.7,
            fontSize: '0.7rem',
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          Language
        </Typography>
        {[
          {
            flag: '/images/flags/us.svg',
            text: 'English',
            onClick: () => handleLangMenuClose('en'),
            selected: i18n.language === 'en',
          },
          {
            flag: '/images/flags/vn.svg',
            text: 'Tiếng Việt',
            onClick: () => handleLangMenuClose('vi'),
            selected: i18n.language === 'vi',
          },
        ].map((item, index) => (
          <MotionBox
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={item.onClick}
                sx={{
                  borderRadius: 2,
                  my: 0.5,
                  mx: 1,
                  backgroundColor: item.selected
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    component="img"
                    src={item.flag}
                    alt={item.text}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: item.selected ? 'bold' : 'medium',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </MotionBox>
        ))}
      </List>

      <Box sx={{ p: 2, mt: 2 }}>
        <MotionButton
          fullWidth
          variant="outlined"
          color={isDarkMode ? 'primary' : 'info'}
          startIcon={isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          onClick={toggleTheme}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
          }}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </MotionButton>
      </Box>
    </MotionBox>
  )

  return (
    <>
      <HideOnScroll>
        <MotionAppBar
          position="sticky"
          elevation={0}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          sx={{
            background: isDarkMode
              ? `linear-gradient(90deg, ${alpha(theme.palette.background.paper, 0.85)} 0%, ${alpha('#182848', 0.9)} 100%)`
              : `linear-gradient(90deg, ${alpha(theme.palette.background.paper, 0.85)} 0%, ${alpha('#ffffff', 0.9)} 100%)`,
            color: isDarkMode ? '#fff' : 'inherit',
            borderBottom: `1px solid ${isDarkMode ? alpha('rgba(255,255,255,0.1)', 0.2) : alpha('rgba(0,0,0,0.1)', 0.2)}`,
            backdropFilter: 'blur(10px)',
            boxShadow: isDarkMode
              ? '0 4px 20px rgba(0,0,0,0.2)'
              : '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <MotionContainer
            maxWidth="xl"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Toolbar sx={{ py: { xs: 0.5, md: 0.75 } }}>
              {/* Logo and Brand */}
              <Link href="/" passHref style={{ textDecoration: 'none' }}>
                <MotionBox
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    color: isDarkMode ? 'white' : 'primary.main',
                    flexGrow: { xs: 1, md: 0 },
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <MotionBox
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
                        width: 36,
                        height: 36,
                      }}
                    >
                      <MovieCreationIcon
                        sx={{
                          color: 'white',
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                        }}
                      />
                    </Avatar>
                  </MotionBox>
                  <MotionTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      background: isDarkMode
                        ? `linear-gradient(90deg, #ffffff 0%, ${theme.palette.primary.light} 100%)`
                        : `linear-gradient(90deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      textShadow: isDarkMode
                        ? '0 2px 8px rgba(0,0,0,0.5)'
                        : '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Vision Forge
                  </MotionTypography>
                </MotionBox>
              </Link>

              {/* Desktop Navigation */}
              {!isMobile && (
                <MotionBox
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mx: 4,
                    gap: 1.5,
                  }}
                  variants={fadeIn}
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
                        gap: 0.8,
                        background: alpha(theme.palette.background.paper, 0.4),
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      }}
                      whileHover={{
                        backgroundColor: isDarkMode
                          ? alpha('rgba(255,255,255,0.1)', 0.2)
                          : alpha('rgba(0,0,0,0.04)', 0.4),
                        scale: 1.05,
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <HomeIcon fontSize="small" />
                      <Typography sx={{ fontWeight: 500 }}>Home</Typography>
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
                      px: 2.5,
                      py: 1,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                      border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {content.createVideo}
                  </MotionButton>
                </MotionBox>
              )}

              {/* Right side items */}
              <Box sx={{ flexGrow: 1 }} />

              <MotionBox
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.5, md: 1 },
                }}
                variants={fadeIn}
              >
                {/* Toggle Dark Mode */}
                <Tooltip
                  title={
                    isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
                  }
                >
                  <MotionIconButton
                    color="inherit"
                    onClick={toggleTheme}
                    whileHover={{
                      rotate: 180,
                      backgroundColor: isDarkMode
                        ? alpha('rgba(255,255,255,0.1)', 0.3)
                        : alpha('rgba(0,0,0,0.04)', 0.5),
                      transition: { duration: 0.4 },
                    }}
                    whileTap={{ scale: 0.9 }}
                    sx={{
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.2
                      ),
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                      p: 1,
                    }}
                  >
                    {isDarkMode ? (
                      <LightModeIcon sx={{ fontSize: '1.2rem' }} />
                    ) : (
                      <DarkModeIcon sx={{ fontSize: '1.2rem' }} />
                    )}
                  </MotionIconButton>
                </Tooltip>

                {/* Language Switcher */}
                {!isMobile && (
                  <MotionBox
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={itemFadeIn}
                  >
                    <Tooltip title="Change language">
                      <Button
                        onClick={handleLangMenuOpen}
                        // startIcon={
                        //   <Box
                        //     component="img"
                        //     src={
                        //       i18n.language === 'vi'
                        //         ? '/images/flags/vn.svg'
                        //         : '/images/flags/us.svg'
                        //     }
                        //     alt={
                        //       i18n.language === 'vi' ? 'Tiếng Việt' : 'English'
                        //     }
                        //     sx={{ width: 20, height: 20, borderRadius: '50%' }}
                        //   />
                        // }
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                          mx: 1,
                          color: isDarkMode ? 'white' : 'text.primary',
                          textTransform: 'none',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          background: alpha(
                            theme.palette.background.paper,
                            0.2
                          ),
                          backdropFilter: 'blur(8px)',
                          border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
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
                          mt: 1.5,
                          overflow: 'visible',
                          background: alpha(
                            theme.palette.background.paper,
                            0.9
                          ),
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          boxShadow: theme.shadows[4],
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
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem
                        onClick={() => handleLangMenuClose('en')}
                        selected={i18n.language === 'en'}
                        sx={{
                          borderRadius: 1,
                          mx: 0.5,
                          my: 0.5,
                          '&:hover': {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                          },
                          ...(i18n.language === 'en' && {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                          }),
                        }}
                      >
                        <ListItemIcon>
                          <Box
                            component="img"
                            src="/images/flags/us.svg"
                            alt="English"
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="English"
                          primaryTypographyProps={{
                            fontWeight:
                              i18n.language === 'en' ? 'bold' : 'normal',
                          }}
                        />
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleLangMenuClose('vi')}
                        selected={i18n.language === 'vi'}
                        sx={{
                          borderRadius: 1,
                          mx: 0.5,
                          my: 0.5,
                          '&:hover': {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                          },
                          ...(i18n.language === 'vi' && {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                          }),
                        }}
                      >
                        <ListItemIcon>
                          <Box
                            component="img"
                            src="/images/flags/vn.svg"
                            alt="Tiếng Việt"
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tiếng Việt"
                          primaryTypographyProps={{
                            fontWeight:
                              i18n.language === 'vi' ? 'bold' : 'normal',
                          }}
                        />
                      </MenuItem>
                    </Menu>
                  </MotionBox>
                )}

                {/* Auth Status / User Profile */}
                {authChecking ? (
                  <Box sx={{ px: 2 }}>
                    <LoadingIndicator
                      isLoading={true}
                      size={24}
                      showAfterDelay={0}
                    />
                  </Box>
                ) : user ? (
                  <MotionBox
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={itemFadeIn}
                  >
                    <Tooltip title="Account settings">
                      <Button
                        onClick={handleProfileMenuOpen}
                        sx={{
                          textTransform: 'none',
                          color: isDarkMode ? 'white' : 'text.primary',
                          py: 0.5,
                          px: { xs: 0.5, sm: 1 },
                          borderRadius: 2,
                          background: alpha(
                            theme.palette.background.paper,
                            0.2
                          ),
                          backdropFilter: 'blur(8px)',
                          border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                        }}
                        endIcon={!isSmall && <KeyboardArrowDownIcon />}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: { xs: 0, sm: 1 },
                            bgcolor: theme.palette.primary.main,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            border: `2px solid ${alpha(theme.palette.primary.light, 0.5)}`,
                            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
                          }}
                        >
                          {user.name
                            ? user.name.charAt(0).toUpperCase()
                            : user.email.charAt(0).toUpperCase()}
                        </Avatar>
                        {!isSmall && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              maxWidth: { xs: 80, sm: 120, md: 150 },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
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
                          mt: 1.5,
                          overflow: 'visible',
                          background: alpha(
                            theme.palette.background.paper,
                            0.9
                          ),
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          boxShadow: theme.shadows[4],
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
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MotionBox
                        sx={{ px: 2, py: 1.5 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Grid container spacing={1} alignItems="center">
                          <Grid size={{ xs: 3 }}>
                            <MotionBox
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: theme.palette.primary.main,
                                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                  border: `2px solid ${alpha(theme.palette.primary.light, 0.5)}`,
                                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                                }}
                              >
                                {user.name
                                  ? user.name.charAt(0).toUpperCase()
                                  : user.email.charAt(0).toUpperCase()}
                              </Avatar>
                            </MotionBox>
                          </Grid>
                          <Grid size={{ xs: 9 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              sx={{
                                lineHeight: 1.2,
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {user.name || user.email.split('@')[0]}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: '0.8rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {user.email}
                            </Typography>
                          </Grid>
                        </Grid>
                      </MotionBox>

                      <Divider sx={{ my: 1 }} />

                      {[
                        {
                          icon: (
                            <AccountCircleIcon
                              fontSize="small"
                              color="primary"
                            />
                          ),
                          text: 'My Profile',
                          onClick: handleProfileClick,
                        },
                        {
                          icon: (
                            <SettingsIcon fontSize="small" color="primary" />
                          ),
                          text: 'Settings',
                          onClick: handleSettingsClick,
                        },
                      ].map((item, index) => (
                        <MotionBox
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.2 }}
                        >
                          <MenuItem
                            onClick={item.onClick}
                            sx={{
                              borderRadius: 1,
                              mx: 0.5,
                              my: 0.5,
                              '&:hover': {
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.1
                                ),
                              },
                            }}
                          >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                          </MenuItem>
                        </MotionBox>
                      ))}

                      <Divider sx={{ my: 1 }} />

                      <MotionBox
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.2 }}
                      >
                        <MenuItem
                          onClick={handleLogout}
                          sx={{
                            borderRadius: 1,
                            mx: 0.5,
                            my: 0.5,
                            color: theme.palette.error.main,
                            '&:hover': {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <ListItemIcon>
                            <LogoutIcon fontSize="small" color="error" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Logout"
                            primaryTypographyProps={{ color: 'error' }}
                          />
                        </MenuItem>
                      </MotionBox>
                    </Menu>
                  </MotionBox>
                ) : (
                  !isMobile && (
                    <MotionBox
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                      }}
                      variants={itemFadeIn}
                    >
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
                            borderWidth: 1,
                            textTransform: 'none',
                            px: 2,
                            py: 0.8,
                            fontWeight: 600,
                            borderColor: alpha(theme.palette.primary.main, 0.5),
                            '&:hover': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: 1,
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.05
                              ),
                            },
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
                            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            textTransform: 'none',
                            px: 2,
                            py: 0.8,
                            fontWeight: 600,
                          }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {content.register}
                        </MotionButton>
                      </Link>
                    </MotionBox>
                  )
                )}

                {/* Mobile menu button */}
                {isMobile && (
                  <MotionIconButton
                    color="inherit"
                    edge="end"
                    onClick={handleDrawerToggle}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9, rotate: -10 }}
                    sx={{
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.2
                      ),
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                      ml: 1,
                    }}
                  >
                    <MenuIcon />
                  </MotionIconButton>
                )}
              </MotionBox>
            </Toolbar>
          </MotionContainer>
        </MotionAppBar>
      </HideOnScroll>

      {/* Mobile drawer */}
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
            maxWidth: 320,
            boxSizing: 'border-box',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            backgroundImage:
              theme.palette.mode === 'dark'
                ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
                : `linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(250,250,250,0.95) 100%)`,
            backdropFilter: 'blur(10px)',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default TopNav
