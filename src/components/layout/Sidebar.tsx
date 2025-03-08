// src/components/layout/Sidebar.tsx
import React from 'react'
import Link from 'next/link'

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 p-4 bg-gray-100">
      <nav className="space-y-2">
        <Link href="/dashboard">
          <a className="block p-2 hover:bg-gray-200 rounded">Dashboard</a>
        </Link>
        <Link href="/video-editor">
          <a className="block p-2 hover:bg-gray-200 rounded">Video Editor</a>
        </Link>
        <Link href="/publishing">
          <a className="block p-2 hover:bg-gray-200 rounded">Publishing</a>
        </Link>
        {/* Additional links */}
      </nav>
    </aside>
  )
}

export default Sidebar
