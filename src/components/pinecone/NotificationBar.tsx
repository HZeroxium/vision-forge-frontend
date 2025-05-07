import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { NotificationBarProps } from './types'

const MotionAlert = motion(Alert)

const NotificationBar: React.FC<NotificationBarProps> = ({
  notification,
  handleCloseNotification,
}) => {
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={handleCloseNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ mb: 2 }}
    >
      <AnimatePresence>
        {notification.open && (
          <MotionAlert
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            sx={{
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            {notification.message}
          </MotionAlert>
        )}
      </AnimatePresence>
    </Snackbar>
  )
}

export default NotificationBar
