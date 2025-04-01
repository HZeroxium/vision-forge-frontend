'use client'
// src/components/layout/Header.tsx

import React from 'react'
import Button from '../common/Button'
import { useRouter } from 'next/navigation'

const Header: React.FC = () => {
  const router = useRouter()
  return (
    <></>
    // <header className="flex justify-between items-center p-4 text-white">
    //   <h1
    //     className="text-xl font-bold cursor-pointer"
    //     onClick={() => router.push('/')}
    //   >
    //     {/* Vision Forge */}
    //   </h1>
    // </header>
  )
}

export default Header
