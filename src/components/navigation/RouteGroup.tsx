'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { Box, Typography, IconButton, Collapse, List } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@mui/material/styles'

// Define route item type
export interface RouteItem {
  path: string
  text: string
  icon: React.ReactNode
  protected: boolean
}

interface RouteGroupProps {
  title: string
  items: RouteItem[]
  open: boolean
  expanded: boolean
  onToggle: () => void
  user: any
}

// Create a motion component
const MotionListItem = motion.li

const RouteGroup: React.FC<RouteGroupProps> = ({
  title,
  items,
  open,
  expanded,
  onToggle,
  user,
}) => {
  const pathname = usePathname()
  const theme = useTheme()

  // Check if route is active
  const isActiveRoute = (path: string) => pathname === path

  // Item animation variants
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
    <Box sx={{ my: 1 }}>
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
          onClick={onToggle}
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
            {title}
          </Typography>
          <IconButton size="small">
            {expanded ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      )}

      {/* Links */}
      <Collapse
        in={open ? expanded || expanded === null : true}
        timeout="auto"
        unmountOnExit={false}
      >
        <List disablePadding>
          {items.map((item) => {
            // Skip protected routes if user is not logged in
            if (item.protected && !user) {
              return null
            }

            const isActive = isActiveRoute(item.path)

            return (
              <Link
                href={item.path}
                style={{ textDecoration: 'none' }}
                key={item.path}
              >
                <MotionListItem
                  style={{
                    display: 'block',
                    padding: 0,
                    backgroundColor: isActive
                      ? theme.palette.action.selected
                      : 'transparent',
                    borderLeft: isActive
                      ? `4px solid ${theme.palette.primary.main}`
                      : '4px solid transparent',
                    listStyle: 'none',
                  }}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: 48,
                      px: 2.5,
                      py: 1,
                      color: isActive ? 'primary.main' : 'text.primary',
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        color: isActive ? 'primary.main' : 'text.primary',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.9rem',
                              fontWeight: isActive ? 'bold' : 'normal',
                            }}
                          >
                            {item.text}
                          </Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </MotionListItem>
              </Link>
            )
          })}
        </List>
      </Collapse>
    </Box>
  )
}

export default RouteGroup
