// src/components/LoginButton.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import Link from 'next/link'
import PersonIcon from '@mui/icons-material/Person'

export default function LoginButton() {
  // Use state to prevent hydration mismatch
  const [loginText, setLoginText] = useState('Login')

  // Update text after component mounts on client
  useEffect(() => {
    // You can implement actual translation logic here
    // For now, just ensuring consistent rendering
    setLoginText('Đăng nhập')
  }, [])

  return (
    <Link href="/login" className="flex items-center gap-1 no-underline">
      <PersonIcon />
      <Typography variant="body1">{loginText}</Typography>
    </Link>
  )
}
