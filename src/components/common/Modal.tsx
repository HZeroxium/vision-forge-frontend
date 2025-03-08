// src/components/common/Modal.tsx
import React from 'react'
import { Modal as MuiModal, Box } from '@mui/material'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Box sx={style}>{children}</Box>
    </MuiModal>
  )
}

export default Modal
