// src/app/profile/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Box,
  Avatar,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  TextField,
  Divider,
  IconButton,
  Alert,
  Paper,
  Snackbar,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  Person,
  Lock,
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  MovieCreation,
  Image as ImageIcon,
  Code,
  Audiotrack,
  Badge,
} from '@mui/icons-material'
import { useAuth } from '@hooks/useAuth'
import { useAppSelector, useAppDispatch } from '@store/store'
import { logout } from '@store/authSlice'
import { updateProfileAsync } from '@store/authSlice'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fadeIn } from '@/utils/animations'

// Motion components
const MotionBox = motion(Box)
const MotionPaper = motion(Paper)
const MotionCard = motion(Card)
const MotionAvatar = motion(Avatar)

// Interface for tab panel props
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

// Tab Panel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  }
}

export default function UserProfilePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const {
    user,
    loading,
    error: authError,
  } = useAppSelector((state) => state.auth)
  const { updateProfile, changePassword, logout: authLogout } = useAuth()
  const dispatch = useAppDispatch()
  const router = useRouter()

  // State for tab navigation
  const [tabValue, setTabValue] = useState(0)

  // State for user profile editing
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false)
  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(
    null
  )

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(
    null
  )

  // General notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setDescription(user.description || '')
    }
  }, [user])

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

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
      setProfileUpdateError(null)
      await updateProfile({ name, description })
      setProfileUpdateSuccess(true)
      setIsEditing(false)

      // Show success notification
      setSnackbarMessage('Profile updated successfully')
      setSnackbarOpen(true)

      // Reset success message after a delay
      setTimeout(() => setProfileUpdateSuccess(false), 3000)
    } catch (error: any) {
      setProfileUpdateError(error.message || 'Failed to update profile')
    }
  }

  // Handle password change submission
  const handlePasswordChange = async () => {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordChangeError("New passwords don't match")
      return
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setPasswordChangeError('Password must be at least 8 characters')
      return
    }

    try {
      setPasswordChangeError(null)
      await changePassword(currentPassword, newPassword)
      setPasswordChangeSuccess(true)

      // Reset form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Show success notification
      setSnackbarMessage('Password changed successfully')
      setSnackbarOpen(true)

      // Reset success message after a delay
      setTimeout(() => setPasswordChangeSuccess(false), 3000)
    } catch (error: any) {
      setPasswordChangeError(error.message || 'Failed to change password')
    }
  }

  const handleLogout = () => {
    authLogout()
    router.push('/')
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
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

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={2}
          sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}
        >
          <Typography variant="h6" mb={2}>
            You are not logged in
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/auth/login')}
            sx={{ mr: 2 }}
          >
            Log In
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/auth/register')}
          >
            Sign Up
          </Button>
        </MotionPaper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {/* Profile Header */}
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
          {/* Cover Background */}
          <Box
            sx={{
              height: 150,
              bgcolor: theme.palette.primary.dark,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
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
              mt: { xs: -6, sm: -7 },
              position: 'relative',
              zIndex: 1,
            }}
          >
            <MotionAvatar
              sx={{
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 },
                border: `4px solid ${theme.palette.background.paper}`,
                backgroundColor: theme.palette.secondary.main,
                boxShadow: theme.shadows[3],
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
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
              }}
            >
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h4" fontWeight="bold">
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
                  sx={{ mt: 1 }}
                  icon={<Badge fontSize="small" />}
                />
              </Box>

              <Box sx={{ mt: { xs: 2, sm: 0 } }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                  sx={{ mr: 1 }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Box>
        </MotionPaper>

        {/* Tabs Navigation */}
        <MotionPaper variants={fadeIn} sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              icon={<Person />}
              label="Profile"
              iconPosition="start"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Lock />}
              label="Security"
              iconPosition="start"
              {...a11yProps(1)}
            />
          </Tabs>
        </MotionPaper>

        {/* Tab Content Panels */}
        <MotionPaper variants={fadeIn} sx={{ borderRadius: 2, mb: 3 }}>
          {/* Profile Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 3,
              }}
            >
              <Typography variant="h5" component="h2">
                Profile Information
              </Typography>

              <Button
                startIcon={isEditing ? <Cancel /> : <Edit />}
                variant={isEditing ? 'outlined' : 'contained'}
                color={isEditing ? 'inherit' : 'primary'}
                onClick={handleEditToggle}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            {/* Success and error alerts */}
            {profileUpdateSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Profile updated successfully!
              </Alert>
            )}

            {profileUpdateError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {profileUpdateError}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                {isEditing ? (
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {user.name || 'Not set'}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
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
                  />
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Bio / Description
                    </Typography>
                    <Typography variant="body1">
                      {user.description || 'No description provided'}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {user.role}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(user.createdAt)}
                  </Typography>
                </Box>
              </Grid>

              {isEditing && (
                <Grid item xs={12}>
                  <Box
                    sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleProfileUpdate}
                      startIcon={<Save />}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Content Statistics Section */}
            <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
              Your Content
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <MotionCard
                  whileHover={{ y: -5, boxShadow: theme.shadows[4] }}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    height: '100%',
                  }}
                  onClick={navigateToContent('/media/videos')}
                >
                  <MovieCreation
                    sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                  />
                  <Typography variant="h6">Videos</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your video library
                  </Typography>
                </MotionCard>
              </Grid>

              <Grid item xs={6} md={3}>
                <MotionCard
                  whileHover={{ y: -5, boxShadow: theme.shadows[4] }}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    height: '100%',
                  }}
                  onClick={navigateToContent('/media/images')}
                >
                  <ImageIcon
                    sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                  />
                  <Typography variant="h6">Images</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your image gallery
                  </Typography>
                </MotionCard>
              </Grid>

              <Grid item xs={6} md={3}>
                <MotionCard
                  whileHover={{ y: -5, boxShadow: theme.shadows[4] }}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    height: '100%',
                  }}
                  onClick={navigateToContent('/media/audios')}
                >
                  <Audiotrack
                    sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                  />
                  <Typography variant="h6">Audio</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your audio files
                  </Typography>
                </MotionCard>
              </Grid>

              <Grid item xs={6} md={3}>
                <MotionCard
                  whileHover={{ y: -5, boxShadow: theme.shadows[4] }}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    height: '100%',
                  }}
                  onClick={navigateToContent('/scripts')}
                >
                  <Code sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">Scripts</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your scripts
                  </Typography>
                </MotionCard>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
              Change Password
            </Typography>

            {/* Success and error alerts */}
            {passwordChangeSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Password changed successfully!
              </Alert>
            )}

            {passwordChangeError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {passwordChangeError}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type={showCurrentPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        edge="end"
                      >
                        {showCurrentPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showNewPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  required
                  helperText="Password must be at least 8 characters"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showNewPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  required
                  error={
                    confirmPassword !== newPassword && confirmPassword !== ''
                  }
                  helperText={
                    confirmPassword !== newPassword && confirmPassword !== ''
                      ? "Passwords don't match"
                      : ' '
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePasswordChange}
                    disabled={
                      loading ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword
                    }
                  >
                    Change Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </MotionPaper>
      </MotionBox>

      {/* Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  )
}
