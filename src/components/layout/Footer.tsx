// src/components/layout/Footer.tsx
import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-gray-200 text-center text-sm">
      &copy; {new Date().getFullYear()} Vision Forge Project. All rights
      reserved.
    </footer>
  )
}

export default Footer
