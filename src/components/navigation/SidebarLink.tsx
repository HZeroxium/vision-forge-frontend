import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector } from '@store/store'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  alpha,
  useTheme,
} from '@mui/material'
import Link from 'next/link'

interface SidebarLinkProps {
  href: string
  icon?: React.ReactNode
  text: string
  isProtected?: boolean
  isCollapsed?: boolean
}

// Create motion components
const MotionListItem = motion(ListItem)
const MotionBox = motion(Box)

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  text,
  isProtected = true,
  isCollapsed = false,
}) => {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()
  const isActive = pathname === href

  const handleClick = (e: React.MouseEvent) => {
    if (isProtected && !user) {
      e.preventDefault()
      toast.error('Please log in to access this feature')
      router.push('/auth/login')
    }
  }

  // Animation variants
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
      x: 5,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
    },
  }

  return (
    <Tooltip
      title={isCollapsed ? text : ''}
      placement="right"
      arrow={true}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: alpha(theme.palette.primary.main, 0.9),
            backdropFilter: 'blur(8px)',
            '& .MuiTooltip-arrow': {
              color: alpha(theme.palette.primary.main, 0.9),
            },
            boxShadow: theme.shadows[3],
            borderRadius: 1.5,
            px: 1.5,
            py: 0.8,
          },
        },
      }}
    >
      <MotionListItem
        disablePadding
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        sx={{
          mb: 0.8,
          borderRadius: 2,
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        <ListItemButton
          component={Link}
          href={href}
          onClick={handleClick}
          sx={{
            minHeight: 46,
            borderRadius: 2,
            px: isCollapsed ? 2.5 : 3,
            py: 0.5,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            background: isActive
              ? `linear-gradient(90deg, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.08)}, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.05 : 0.03)})`
              : 'transparent',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            ...(!isCollapsed &&
              isActive && {
                pl: 3, // Adjust padding to account for the indicator
              }),
            '&:hover': {
              backgroundColor: isActive
                ? alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === 'dark' ? 0.18 : 0.12
                  )
                : alpha(theme.palette.action.hover, 0.8),
            },
          }}
        >
          {/* Active indicator */}
          {isActive && !isCollapsed && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '60%',
                borderRadius: '0 4px 4px 0',
                background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
              }}
            />
          )}

          {/* Active background glow effect for collapsed view */}
          {isActive && isCollapsed && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                filter: 'blur(10px)',
                zIndex: 0,
              }}
            />
          )}

          {/* Icon */}
          {icon && (
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 2.5,
                justifyContent: 'center',
                color: isActive
                  ? theme.palette.primary.main
                  : alpha(theme.palette.text.primary, 0.7),
                position: 'relative',
                zIndex: 1,
              }}
            >
              <MotionBox
                whileHover={{ scale: isCollapsed ? 1.2 : 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {React.cloneElement(icon as React.ReactElement, {
                  fontSize: 'small',
                  sx: {
                    fontSize: '1.25rem',
                    filter: isActive
                      ? `drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.4)})`
                      : 'none',
                    transition: 'filter 0.3s ease',
                  },
                })}
              </MotionBox>
            </ListItemIcon>
          )}

          {/* Text label */}
          {!isCollapsed && (
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                sx: {
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  zIndex: 1,
                  letterSpacing: isActive ? '0.02em' : 'normal',
                },
              }}
            />
          )}

          {/* Active indicator circle for collapsed mode */}
          {isActive && isCollapsed && (
            <Box
              sx={{
                position: 'absolute',
                width: 5,
                height: 5,
                borderRadius: '50%',
                bottom: 4,
                left: '50%',
                transform: 'translateX(-50%)',
                background: theme.palette.primary.main,
                boxShadow: `0 0 6px ${alpha(theme.palette.primary.main, 0.8)}`,
              }}
            />
          )}
        </ListItemButton>
      </MotionListItem>
    </Tooltip>
  )
}

export default SidebarLink
