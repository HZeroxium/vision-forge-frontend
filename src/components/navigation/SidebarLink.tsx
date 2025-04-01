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
} from '@mui/material'
import Link from 'next/link'

interface SidebarLinkProps {
  href: string
  icon?: React.ReactNode
  text: string
  isProtected?: boolean
  isCollapsed?: boolean
}

// Create a motion component
const MotionListItem = motion(ListItem)

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
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <Tooltip title={isCollapsed ? text : ''} placement="right" arrow={true}>
      <MotionListItem
        disablePadding
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        sx={{
          mb: 0.5,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <ListItemButton
          component={Link}
          href={href}
          onClick={handleClick}
          selected={isActive}
          sx={{
            minHeight: 48,
            borderRadius: 1,
            px: 2.5,
            ...(isActive && {
              bgcolor: 'action.selected',
              color: 'primary.main',
              borderLeft: 3,
              borderColor: 'primary.main',
              fontWeight: 'bold',
            }),
          }}
        >
          {icon && (
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 2,
                justifyContent: 'center',
                color: isActive ? 'primary.main' : 'inherit',
              }}
            >
              {icon}
            </ListItemIcon>
          )}

          {!isCollapsed && (
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: isActive ? 'bold' : 'normal',
              }}
            />
          )}
        </ListItemButton>
      </MotionListItem>
    </Tooltip>
  )
}

export default SidebarLink
