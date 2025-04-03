'use client'
import React from 'react'
import { Box, Divider } from '@mui/material'
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
  return (
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
      <SidebarHeader
        open={open}
        onToggle={onDrawerToggle}
        isMobile={isMobile}
      />

      <Divider />

      {/* User profile section (if logged in) */}
      {user && (
        <>
          <UserProfile user={user} open={open} />
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
