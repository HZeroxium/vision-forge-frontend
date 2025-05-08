import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Alert,
  Paper,
  useTheme,
  InputAdornment,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { motion } from 'framer-motion'
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from '@mui/icons-material'
import { useAuth } from '@hooks/useAuth'

interface SecurityTabProps {
  showNotification: (message: string) => void
}

const MotionButton = motion(Button)

const SecurityTab: React.FC<SecurityTabProps> = ({ showNotification }) => {
  const theme = useTheme()
  const { changePassword } = useAuth()

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
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      setPasswordChangeError(null)
      await changePassword(currentPassword, newPassword)
      setPasswordChangeSuccess(true)

      // Reset form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Show success notification
      showNotification('Password changed successfully')

      // Reset success message after a delay
      setTimeout(() => setPasswordChangeSuccess(false), 3000)
    } catch (error: any) {
      setPasswordChangeError(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
  const buttonAnimation = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LockIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
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
          Change Password
        </Typography>
      </Box>

      {/* Success and error alerts */}
      {passwordChangeSuccess && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': { alignItems: 'center' },
          }}
          onClose={() => setPasswordChangeSuccess(false)}
        >
          Password changed successfully!
        </Alert>
      )}

      {passwordChangeError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': { alignItems: 'center' },
          }}
          onClose={() => setPasswordChangeError(null)}
        >
          {passwordChangeError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type={showCurrentPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            margin="normal"
            required
            error={confirmPassword !== newPassword && confirmPassword !== ''}
            helperText={
              confirmPassword !== newPassword && confirmPassword !== ''
                ? "Passwords don't match"
                : ' '
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <MotionButton
              {...buttonAnimation}
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
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              }}
            >
              {loading ? 'Processing...' : 'Change Password'}
            </MotionButton>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 3, borderRadius: 2, bgcolor: 'action.hover' }}>
        <Typography
          variant="subtitle2"
          color="primary"
          gutterBottom
          fontWeight="medium"
        >
          Password Security Tips
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Use a combination of letters, numbers, and special characters
          <br />
          • Don't reuse passwords across multiple sites
          <br />
          • Consider using a password manager for secure storage
          <br />• Change your password regularly for better security
        </Typography>
      </Box>
    </Paper>
  )
}

export default SecurityTab
