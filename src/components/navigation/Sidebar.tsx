import React from 'react'
import SidebarLink from './SidebarLink'
// Import your sidebar icons/components as needed

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Vision Forge</h1>
      </div>

      <nav>
        <ul className="space-y-2">
          {/* Public routes - available to everyone */}
          <SidebarLink href="/" text="Home" isProtected={false} />

          {/* Protected routes - only for logged-in users */}
          <SidebarLink href="/flow/generate-video" text="Generate Video" />
          <SidebarLink href="/media/images" text="Image Gallery" />
          <SidebarLink href="/media/audios" text="Audio Gallery" />
          <SidebarLink href="/media/videos" text="Video Gallery" />

          {/* Add other protected routes here */}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
