import React from 'react'
import {
  Box,
  Avatar,
  Typography,
  Button,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { motion } from 'framer-motion'
import { Badge } from '@mui/icons-material'
import { useAuth } from '@hooks/useAuth'
import { useRouter } from 'next/navigation'
import { fadeIn } from '@/utils/animations'

const MotionPaper = motion(Paper)
const MotionAvatar = motion(Avatar)

interface ProfileHeaderProps {
  user: {
    name?: string
    email: string
    role: string
    createdAt?: string
  }
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const avatarAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.5,
      },
    },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  }

  return (
    <MotionPaper
      variants={fadeIn}
      elevation={1}
      sx={{
        borderRadius: 3,
        mb: 3,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Cover Background with gradient overlay */}
      <Box
        sx={{
          height: { xs: 120, sm: 150 },
          bgcolor: theme.palette.primary.dark,
          backgroundImage: `
            linear-gradient(135deg, 
            ${theme.palette.primary.dark} 0%, 
            ${theme.palette.primary.main} 50%,
            ${theme.palette.primary.light} 100%)
          `,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: `linear-gradient(to top, ${theme.palette.background.paper}20, transparent)`,
          },
        }}
      />

      {/* Avatar and Basic Info */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-end' },
          px: { xs: 2, sm: 4 },
          pb: 3,
          pt: { xs: 0, sm: 0 },
          mt: { xs: -8, sm: -9 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <MotionAvatar
          sx={{
            width: { xs: 110, sm: 130 },
            height: { xs: 110, sm: 130 },
            border: `4px solid ${theme.palette.background.paper}`,
            backgroundColor: theme.palette.secondary.main,
            boxShadow: `0 8px 16px rgba(0,0,0,0.2)`,
            fontSize: { xs: 40, sm: 50 },
            fontWeight: 'bold',
          }}
          {...avatarAnimation}
        >
          {user.name
            ? user.name.charAt(0).toUpperCase()
            : user.email.charAt(0).toUpperCase()}
        </MotionAvatar>

        <Box
          sx={{
            ml: { xs: 0, sm: 3 },
            mt: { xs: 2, sm: 0 },
            flexGrow: 1,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-end' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background: `${theme.palette.secondary.main}`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 0.5,
                textShadow: '0px 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              {user.name || 'User'}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              {user.email}
            </Typography>

            <Chip
              label={user.role}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                mt: 1,
                textTransform: 'capitalize',
                fontWeight: 'medium',
                '& .MuiChip-label': { px: 1 },
              }}
              icon={<Badge fontSize="small" />}
            />
          </Box>

          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  boxShadow: theme.shadows[3],
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }}
              >
                Logout
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </MotionPaper>
  )
}

export default ProfileHeader
