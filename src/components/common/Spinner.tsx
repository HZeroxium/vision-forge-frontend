// src/components/common/Spinner.tsx
'use client'
import React from 'react'
import { CircularProgress } from '@mui/material'

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <CircularProgress />
    </div>
  )
}

export default Spinner
