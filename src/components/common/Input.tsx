// src/components/common/Input.tsx
'use client'
import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'

const Input: React.FC<TextFieldProps> = (props) => {
  return <TextField variant="outlined" {...props} />
}

export default Input
