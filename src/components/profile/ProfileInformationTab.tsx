import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  Paper,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { motion } from 'framer-motion'
import {
  Edit,
  Save,
  Cancel,
  MovieCreation,
  Image as ImageIcon,
  Code,
  Audiotrack,
} from '@mui/icons-material'
import { useAuth } from '@hooks/useAuth'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fadeIn } from '@/utils/animations'

const MotionButton = motion(Button)
const MotionCard = motion(Paper)

interface ProfileInformationTabProps {
  user: {
    name?: string
    email: string
    role: string
    description?: string
    createdAt?: string
    updatedAt?: string
  }
  showNotification: (message: string) => void
}

const ProfileInformationTab: React.FC<ProfileInformationTabProps> = ({
  user,
  showNotification,
}) => {
  const theme = useTheme()
  const router = useRouter()
  const { updateProfile } = useAuth()

  // State for user profile editing
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false)
  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(
    null
  )

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setDescription(user.description || '')
    }
  }, [user])

  // Handle profile edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form if cancelling
      setName(user?.name || '')
      setDescription(user?.description || '')
    }
    setIsEditing(!isEditing)
    setProfileUpdateError(null)
  }

  // Handle profile update submission
  const handleProfileUpdate = async () => {
    try {
      setLoading(true)
      setProfileUpdateError(null)
      await updateProfile({ name, description })
      setProfileUpdateSuccess(true)
      setIsEditing(false)

      // Show success notification
      showNotification('Profile updated successfully')

      // Reset success message after a delay
      setTimeout(() => setProfileUpdateSuccess(false), 3000)
    } catch (error: any) {
      setProfileUpdateError(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'PPP')
  }

  // Navigate to content pages
  const navigateToContent = (path: string) => () => {
    router.push(path)
  }

  // Animation variants
  const buttonAnimation = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  }

  const cardAnimation = {
    whileHover: { y: -5, boxShadow: theme.shadows[4] },
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  }

  return (
    <Paper
      sx={{
        borderRadius: 2,
        mb: 3,
        overflow: 'hidden',
        p: 3,
      }}
      elevation={1}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 'medium',
            background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Profile Information
        </Typography>

        <MotionButton
          {...buttonAnimation}
          startIcon={isEditing ? <Cancel /> : <Edit />}
          variant={isEditing ? 'outlined' : 'contained'}
          color={isEditing ? 'inherit' : 'primary'}
          onClick={handleEditToggle}
          sx={{
            borderRadius: 2,
            px: 2,
            textTransform: 'none',
          }}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </MotionButton>
      </Box>

      {/* Success and error alerts */}
      {profileUpdateSuccess && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': { alignItems: 'center' },
          }}
        >
          Profile updated successfully!
        </Alert>
      )}

      {profileUpdateError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': { alignItems: 'center' },
          }}
          onClose={() => setProfileUpdateError(null)}
        >
          {profileUpdateError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          {isEditing ? (
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          ) : (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontSize: '0.85rem', mb: 0.5 }}
              >
                Name
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.name || 'Not set'}
              </Typography>
            </Box>
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          {isEditing ? (
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              placeholder="Tell us a bit about yourself"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          ) : (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontSize: '0.85rem', mb: 0.5 }}
              >
                Bio / Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontStyle: user.description ? 'normal' : 'italic',
                  color: user.description ? 'text.primary' : 'text.secondary',
                }}
              >
                {user.description || 'No description provided'}
              </Typography>
            </Box>
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ fontSize: '0.85rem', mb: 0.5 }}
            >
              Email
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {user.email}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ fontSize: '0.85rem', mb: 0.5 }}
            >
              Role
            </Typography>
            <Typography
              variant="body1"
              sx={{ textTransform: 'capitalize', fontWeight: 'medium' }}
            >
              {user.role}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ fontSize: '0.85rem', mb: 0.5 }}
            >
              Member Since
            </Typography>
            <Typography variant="body1">
              {formatDate(user.createdAt)}
            </Typography>
          </Box>
        </Grid>

        {isEditing && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <MotionButton
                {...buttonAnimation}
                variant="contained"
                color="primary"
                onClick={handleProfileUpdate}
                startIcon={<Save />}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </MotionButton>
            </Box>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Content Statistics Section */}
      <motion.div variants={fadeIn}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            fontWeight: 'medium',
            background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Your Content
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <MotionCard
              {...cardAnimation}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%',
                borderRadius: 2,
                background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
              }}
              elevation={2}
              onClick={navigateToContent('/media/videos')}
            >
              <MovieCreation
                sx={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  mb: 1,
                  filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                Videos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your video library
              </Typography>
            </MotionCard>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <MotionCard
              {...cardAnimation}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%',
                borderRadius: 2,
                background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
              }}
              elevation={2}
              onClick={navigateToContent('/media/images')}
            >
              <ImageIcon
                sx={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  mb: 1,
                  filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                Images
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your image gallery
              </Typography>
            </MotionCard>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <MotionCard
              {...cardAnimation}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%',
                borderRadius: 2,
                background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
              }}
              elevation={2}
              onClick={navigateToContent('/media/audios')}
            >
              <Audiotrack
                sx={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  mb: 1,
                  filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                Audio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your audio files
              </Typography>
            </MotionCard>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <MotionCard
              {...cardAnimation}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%',
                borderRadius: 2,
                background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
              }}
              elevation={2}
              onClick={navigateToContent('/scripts')}
            >
              <Code
                sx={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  mb: 1,
                  filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                Scripts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your scripts
              </Typography>
            </MotionCard>
          </Grid>
        </Grid>
      </motion.div>
    </Paper>
  )
}

export default ProfileInformationTab
