// /src/components/navigation/Sidebar.tsx

'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Box, Drawer, useScrollTrigger, alpha } from '@mui/material'
import { useAppSelector } from '@store/store'

// Icons
import HomeIcon from '@mui/icons-material/Home'
import MovieCreationIcon from '@mui/icons-material/MovieCreation'
import ImageIcon from '@mui/icons-material/Image'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SettingsIcon from '@mui/icons-material/Settings'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Analytics } from '@mui/icons-material'

// Custom components
import SidebarContent, { RouteGroup } from './SidebarContent'

// Create motion components
const MotionBox = motion.create(Box)

// Define the route groups for better organization
const routes: RouteGroup[] = [
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
      {
        path: '/media/videos/uploadYoutube',
        text: 'Youtube Analytics',
        icon: <Analytics />,
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
        path: '/dev/tools',
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
  // State
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Redux
  const { user } = useAppSelector((state) => state.auth)

  // Theme and responsive helpers
  const theme = useTheme()
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

  return (
    <>
      {/* Desktop drawer - permanent but can be collapsed */}
      {!isMobile && (
        <MotionBox
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
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: '0 0 20px rgba(0,0,0,0.05)',
            position: 'relative',
            zIndex: theme.zIndex.drawer,
          }}
        >
          <SidebarContent
            open={open}
            mobileOpen={mobileOpen}
            expandedSection={expandedSection}
            user={user}
            routes={routes}
            isMobile={isMobile}
            onDrawerToggle={handleDrawerToggle}
            onSectionToggle={toggleSection}
          />
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
              borderRadius: '0 16px 16px 0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              background:
                theme.palette.mode === 'dark'
                  ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.95)})`
                  : `linear-gradient(145deg, rgba(255,255,255,0.98), rgba(255,255,255,0.9))`,
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <SidebarContent
            open={true} // Always open on mobile
            mobileOpen={mobileOpen}
            expandedSection={expandedSection}
            user={user}
            routes={routes}
            isMobile={isMobile}
            onDrawerToggle={handleDrawerToggle}
            onSectionToggle={toggleSection}
          />
        </Drawer>
      )}
    </>
  )
}

export default Sidebar
