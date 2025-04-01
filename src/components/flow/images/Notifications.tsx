// src/components/flow/Notifications.tsx
'use client'
import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface NotificationsProps {
  showSaveNotification: boolean
  showIncompleteAlert: boolean
  saveError: string | null
  onCloseSaveNotification: () => void
  onCloseIncompleteAlert: () => void
  onCloseSaveError: () => void
}

const Notifications: React.FC<NotificationsProps> = ({
  showSaveNotification,
  showIncompleteAlert,
  saveError,
  onCloseSaveNotification,
  onCloseIncompleteAlert,
  onCloseSaveError,
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

      <Snackbar
        open={!!saveError}
        autoHideDuration={5000}
        onClose={onCloseSaveError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          variant="filled"
          icon={<ErrorOutlineIcon />}
          onClose={onCloseSaveError}
          sx={{ width: '100%' }}
        >
          {saveError || 'Failed to save changes'}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Notifications
