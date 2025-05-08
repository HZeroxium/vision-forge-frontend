'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  List,
  alpha,
  useTheme,
} from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
      x: 5,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
    },
  }

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
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
            px: 2.5,
            py: 1,
            cursor: 'pointer',
            borderRadius: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.action.hover, 0.7),
            },
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
              textTransform: 'uppercase',
              color: alpha(theme.palette.text.primary, 0.7),
            }}
          >
            {title}
          </Typography>
          <IconButton
            size="small"
            sx={{
              transition: 'transform 0.2s ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Links */}
      <Collapse
        in={open ? expanded || expanded === null : true}
        timeout="auto"
        unmountOnExit={false}
      >
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            listStyleType: 'none',
            padding: 0,
            margin: 0,
          }}
        >
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
                    margin: '2px 0',
                    backgroundColor: 'transparent',
                    borderRadius: 8,
                    position: 'relative',
                    overflow: 'hidden',
                    listStyle: 'none',
                  }}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {/* Active indicator */}
                  {isActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '4px',
                        height: '60%',
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: theme.palette.primary.main,
                        boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: 42,
                      px: 2.5,
                      py: 0.7,
                      borderRadius: 2,
                      backgroundColor: isActive
                        ? alpha(
                            theme.palette.primary.main,
                            theme.palette.mode === 'dark' ? 0.15 : 0.08
                          )
                        : 'transparent',
                      color: isActive ? 'primary.main' : 'text.primary',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isActive
                          ? alpha(
                              theme.palette.primary.main,
                              theme.palette.mode === 'dark' ? 0.2 : 0.12
                            )
                          : alpha(theme.palette.action.hover, 0.8),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        color: isActive
                          ? theme.palette.primary.main
                          : alpha(theme.palette.text.primary, 0.7),
                      }}
                    >
                      {React.cloneElement(item.icon as React.ReactElement, {
                        fontSize: 'small',
                        sx: {
                          fontSize: '1.25rem',
                          filter: isActive
                            ? `drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.4)})`
                            : 'none',
                        },
                      })}
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
                              fontWeight: isActive ? 600 : 400,
                              whiteSpace: 'nowrap',
                              color: isActive
                                ? theme.palette.primary.main
                                : theme.palette.text.primary,
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
        </motion.ul>
      </Collapse>
    </Box>
  )
}

export default RouteGroup
