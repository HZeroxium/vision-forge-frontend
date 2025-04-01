'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Tooltip,
  Avatar,
  Paper,
  Collapse,
  Badge,
  useScrollTrigger,
  ListItemButton,
} from '@mui/material'

// Icons
import HomeIcon from '@mui/icons-material/Home'
import MovieCreationIcon from '@mui/icons-material/MovieCreation'
import ImageIcon from '@mui/icons-material/Image'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SettingsIcon from '@mui/icons-material/Settings'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { useAppSelector } from '@store/store'
import Link from 'next/link'

// Create motion components
const MotionBox = motion(Box)
const MotionIconButton = motion(IconButton)
const MotionListItem = motion(ListItem)
const MotionTypography = motion(Typography)

// Define the route groups for better organization
const routes = [
  {
    title: 'Main',
    items: [
      { path: '/', text: 'Home', icon: <HomeIcon />, protected: false },
      {
        path: '/dashboard',
        text: 'Dashboard',
        icon: <DashboardIcon />,
        protected: true,
      },
    ],
  },
  {
    title: 'Creation',
    items: [
      {
        path: '/flow/generate-video',
        text: 'Generate Video',
        icon: <MovieCreationIcon />,
        protected: true,
      },
      {
        path: '/flow/advanced',
        text: 'Advanced Tools',
        icon: <AutoAwesomeIcon />,
        protected: true,
      },
    ],
  },
  {
    title: 'Media Library',
    items: [
      {
        path: '/media/images',
        text: 'Image Gallery',
        icon: <ImageIcon />,
        protected: true,
      },
      {
        path: '/media/audios',
        text: 'Audio Gallery',
        icon: <AudiotrackIcon />,
        protected: true,
      },
      {
        path: '/media/videos',
        text: 'Video Gallery',
        icon: <VideoLibraryIcon />,
        protected: true,
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        path: '/support/help',
        text: 'Help Center',
        icon: <HelpOutlineIcon />,
        protected: false,
      },
      {
        path: '/support/settings',
        text: 'Settings',
        icon: <SettingsIcon />,
        protected: true,
      },
    ],
  },
]

const Sidebar = () => {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const { user } = useAppSelector((state) => state.auth)
  const theme = useTheme()
  const pathname = usePathname()

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  const scrollTrigger = useScrollTrigger()

  // Set initial state based on screen size
  useEffect(() => {
    if (isTablet) {
      setOpen(false)
    }
  }, [isTablet])

  // Auto-collapse sidebar when scrolling on mobile/tablet
  useEffect(() => {
    if (scrollTrigger && (isMobile || isTablet)) {
      setOpen(false)
    }
  }, [scrollTrigger, isMobile, isTablet])

  // Handle toggling the sidebar
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setOpen(!open)
    }
  }

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Check if route is active
  const isActiveRoute = (path: string) => pathname === path

  // Animations for sidebar items
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  }

  // Animations for the drawer
  const drawerVariants = {
    open: {
      width: 240,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
    closed: {
      width: 72,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
  }

  // Render sidebar content
  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'background.paper',
        boxShadow: '0 0 20px rgba(0,0,0,0.05)',
        position: 'relative',
        zIndex: (theme) => theme.zIndex.drawer,
        overflowX: 'hidden',
      }}
    >
      {/* Logo section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 2,
          justifyContent: open ? 'space-between' : 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MotionBox
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              <MovieCreationIcon />
            </Avatar>
          </MotionBox>
          <AnimatePresence>
            {open && (
              <MotionTypography
                variant="h6"
                sx={{ ml: 2, fontWeight: 'bold', userSelect: 'none' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                Vision Forge
              </MotionTypography>
            )}
          </AnimatePresence>
        </Box>
        <MotionIconButton
          onClick={handleDrawerToggle}
          edge="end"
          sx={{ display: { xs: 'none', md: 'flex' } }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </MotionIconButton>
      </Box>

      <Divider />

      {/* User profile section (if logged in) */}
      {user && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              justifyContent: open ? 'flex-start' : 'center',
            }}
          >
            <Avatar
              src={user.avatar || undefined}
              alt={user.name || 'User'}
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'secondary.main',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '2px solid',
                borderColor: 'secondary.light',
              }}
            >
              {user.name?.charAt(0) || user.email?.charAt(0)}
            </Avatar>
            <AnimatePresence>
              {open && (
                <MotionBox
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  sx={{ ml: 2, overflow: 'hidden' }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    noWrap
                    sx={{ maxWidth: 140 }}
                  >
                    {user.name || user.email.split('@')[0]}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{ maxWidth: 140 }}
                  >
                    {user.email}
                  </Typography>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>
          <Divider />
        </>
      )}

      {/* Navigation links */}
      <Box
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          flexGrow: 1,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: (theme) => theme.palette.divider,
            borderRadius: '4px',
          },
        }}
      >
        {routes.map((group) => (
          <Box key={group.title} sx={{ my: 1 }}>
            {/* Section heading */}
            {open && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 3,
                  py: 1,
                  cursor: 'pointer',
                }}
                onClick={() => toggleSection(group.title)}
              >
                <Typography
                  variant="overline"
                  component="h3"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    letterSpacing: 1,
                  }}
                >
                  {group.title}
                </Typography>
                <IconButton size="small">
                  {expandedSection === group.title ? (
                    <KeyboardArrowUpIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowDownIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
            )}

            {/* Links */}
            <Collapse
              in={
                open
                  ? expandedSection === group.title || expandedSection === null
                  : true
              }
              timeout="auto"
              unmountOnExit={false}
            >
              <List disablePadding>
                {group.items.map((item) => {
                  // Skip protected routes if user is not logged in
                  if (item.protected && !user) {
                    return null
                  }

                  const isActive = isActiveRoute(item.path)

                  return (
                    <Tooltip
                      key={item.path}
                      title={open ? '' : item.text}
                      placement="right"
                      arrow
                    >
                      {/* Fix: Wrap the Link component around MotionListItem instead of using component prop */}
                      <Link href={item.path} style={{ textDecoration: 'none' }}>
                        <MotionListItem
                          disablePadding
                          sx={{
                            display: 'block',
                            backgroundColor: isActive
                              ? 'action.selected'
                              : 'transparent',
                            borderLeft: isActive
                              ? `4px solid ${theme.palette.primary.main}`
                              : '4px solid transparent',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <ListItem
                            disablePadding
                            sx={{
                              minHeight: 48,
                              px: 2.5,
                              py: 1,
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 2 : 'auto',
                                justifyContent: 'center',
                                color: isActive
                                  ? 'primary.main'
                                  : 'text.primary',
                              }}
                            >
                              {item.icon}
                            </ListItemIcon>
                            <AnimatePresence>
                              {open && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ListItemText
                                    primary={item.text}
                                    sx={{
                                      color: isActive
                                        ? 'primary.main'
                                        : 'text.primary',
                                      fontWeight: isActive ? 'bold' : 'normal',
                                    }}
                                    primaryTypographyProps={{
                                      fontSize: '0.9rem',
                                    }}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </ListItem>
                        </MotionListItem>
                      </Link>
                    </Tooltip>
                  )
                })}
              </List>
            </Collapse>
          </Box>
        ))}
      </Box>

      {/* Mobile toggle button (visible only on mobile) */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          display: { xs: 'block', md: 'none' },
        }}
      >
        <MotionIconButton
          color="primary"
          onClick={handleDrawerToggle}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            boxShadow: 3,
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MenuIcon />
        </MotionIconButton>
      </Box>
    </Box>
  )

  return (
    <>
      {/* Desktop drawer - permanent but can be collapsed */}
      {!isMobile && (
        <MotionBox
          component="aside"
          initial={false}
          animate={open ? 'open' : 'closed'}
          variants={drawerVariants}
          sx={{
            width: open ? 240 : 72,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            height: '100%',
            display: { xs: 'none', md: 'block' },
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          {sidebarContent}
        </MotionBox>
      )}

      {/* Mobile drawer - temporary and full screen */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}
    </>
  )
}

export default Sidebar
