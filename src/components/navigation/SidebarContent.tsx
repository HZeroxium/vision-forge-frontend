'use client'
import React from 'react'
import { Box, Divider, alpha, useTheme } from '@mui/material'
import SidebarHeader from './SidebarHeader'
import UserProfile from './UserProfile'
import RouteGroup, { RouteItem } from './RouteGroup'
import MobileToggleButton from './MobileToggleButton'

export interface RouteGroup {
  title: string
  items: RouteItem[]
}

interface SidebarContentProps {
  open: boolean
  mobileOpen: boolean
  expandedSection: string | null
  user: any
  routes: RouteGroup[]
  isMobile: boolean
  onDrawerToggle: () => void
  onSectionToggle: (section: string) => void
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  open,
  mobileOpen,
  expandedSection,
  user,
  routes,
  isMobile,
  onDrawerToggle,
  onSectionToggle,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
            : `linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(250,250,250,0.95) 100%)`,
        borderRadius: isMobile ? '0 16px 16px 0' : 0,
        boxShadow: isMobile
          ? 'none'
          : `inset -1px 0 0 ${alpha(theme.palette.divider, 0.1)}`,
        backdropFilter: 'blur(8px)',
        position: 'relative',
        zIndex: (theme) => theme.zIndex.drawer,
        overflowX: 'hidden',
      }}
    >
      {/* Logo section */}
      <SidebarHeader
        open={open}
        onToggle={onDrawerToggle}
        isMobile={isMobile}
      />

      <Divider
        sx={{
          opacity: 0.6,
          borderColor: alpha(theme.palette.divider, 0.1),
          my: 0.5,
        }}
      />

      {/* User profile section (if logged in) */}
      {user && (
        <>
          <UserProfile user={user} open={open} />
          <Divider
            sx={{
              opacity: 0.6,
              borderColor: alpha(theme.palette.divider, 0.1),
              my: 0.5,
            }}
          />
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
            background: alpha(theme.palette.primary.main, 0.2),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: alpha(theme.palette.primary.main, 0.3),
          },
          px: 0.5,
          py: 1,
        }}
      >
        {routes.map((group) => (
          <RouteGroup
            key={group.title}
            title={group.title}
            items={group.items}
            open={open}
            expanded={expandedSection === group.title}
            onToggle={() => onSectionToggle(group.title)}
            user={user}
          />
        ))}
      </Box>

      {/* Mobile toggle button (visible only on mobile) */}
      <MobileToggleButton onClick={onDrawerToggle} />
    </Box>
  )
}

export default SidebarContent
