// src/components/flow/Notifications.tsx
'use client'
import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface NotificationsProps {
  showSaveNotification: boolean
  showIncompleteAlert: boolean
  onCloseSaveNotification: () => void
  onCloseIncompleteAlert: () => void
}

const Notifications: React.FC<NotificationsProps> = ({
  showSaveNotification,
  showIncompleteAlert,
  onCloseSaveNotification,
  onCloseIncompleteAlert,
}) => {
  return (
    <>
      <Snackbar
        open={showSaveNotification}
        autoHideDuration={3000}
        onClose={onCloseSaveNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          icon={<CheckCircleIcon />}
          onClose={onCloseSaveNotification}
          sx={{ width: '100%' }}
        >
          Your script changes have been saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showIncompleteAlert}
        autoHideDuration={4000}
        onClose={onCloseIncompleteAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={onCloseIncompleteAlert}>
          Please wait for image generation to complete before proceeding.
        </Alert>
      </Snackbar>
    </>
  )
}

export default Notifications
