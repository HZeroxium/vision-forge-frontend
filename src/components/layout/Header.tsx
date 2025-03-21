'use client'
// src/components/layout/Header.tsx

import React from 'react'
import Button from '../common/Button'
import { useRouter } from 'next/navigation'

const Header: React.FC = () => {
  const router = useRouter()
  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push('/')}
      >
        Vision Forge
      </h1>
      <Button
        onClick={() => router.push('/dashboard')}
        className="bg-white text-blue-600"
      >
        Dashboard
      </Button>
    </header>
  )
}

export default Header
