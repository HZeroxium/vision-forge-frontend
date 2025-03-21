// src/components/layout/Sidebar.tsx
import React from 'react'
import Link from 'next/link'

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 p-4 bg-gray-100">
      <nav className="space-y-2">
        <Link href="/dashboard" className="block p-2 hover:bg-gray-200 rounded">
          Dashboard
        </Link>
        <Link href="/images" className="block p-2 hover:bg-gray-200 rounded">
          Image Gallery
        </Link>
        <Link href="/videos" className="block p-2 hover:bg-gray-200 rounded">
          Videos Library
        </Link>
        <Link href="/audios" className="block p-2 hover:bg-gray-200 rounded">
          Audio Library
        </Link>
        {/* Additional links */}
      </nav>
    </aside>
  )
}

export default Sidebar
