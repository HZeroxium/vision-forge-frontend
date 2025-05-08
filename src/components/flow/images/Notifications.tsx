// src/components/flow/Notifications.tsx
'use client'
import React from 'react'
import { Alert, Snackbar } from '@mui/material'

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
      {/* Save notification */}
      <Snackbar
        open={showSaveNotification}
        autoHideDuration={3000}
        onClose={onCloseSaveNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={onCloseSaveNotification}
          severity="success"
          variant="filled"
        >
          Changes saved successfully
        </Alert>
      </Snackbar>

      {/* Incomplete alert */}
      <Snackbar
        open={showIncompleteAlert}
        autoHideDuration={3000}
        onClose={onCloseIncompleteAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={onCloseIncompleteAlert}
          severity="warning"
          variant="filled"
        >
          Please wait for image generation to complete before proceeding
        </Alert>
      </Snackbar>

      {/* Save error */}
      <Snackbar
        open={!!saveError}
        autoHideDuration={5000}
        onClose={onCloseSaveError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={onCloseSaveError} severity="error" variant="filled">
          {saveError}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Notifications
