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
        <Link href="/media" className="block p-2 hover:bg-gray-200 rounded">
          Media
        </Link>
        <Link
          href="/video-editor"
          className="block p-2 hover:bg-gray-200 rounded"
        >
          Video Editor
        </Link>
        <Link
          href="/publishing"
          className="block p-2 hover:bg-gray-200 rounded"
        >
          Publishing
        </Link>
        {/* Additional links */}
      </nav>
    </aside>
  )
}

export default Sidebar
