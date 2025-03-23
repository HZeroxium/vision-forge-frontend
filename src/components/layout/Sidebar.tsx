// src/components/layout/Sidebar.tsx
import React from 'react'
import Link from 'next/link'

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 p-4 bg-gray-100">
      <nav className="space-y-2">
        <Link
          href="/media/images"
          className="block p-2 hover:bg-gray-200 rounded"
        >
          Image Gallery
        </Link>
        <Link
          href="/media/videos"
          className="block p-2 hover:bg-gray-200 rounded"
        >
          Videos Library
        </Link>
        <Link
          href="/media/audios"
          className="block p-2 hover:bg-gray-200 rounded"
        >
          Audio Library
        </Link>
        {/* Additional links */}
      </nav>
    </aside>
  )
}

export default Sidebar
