// src/components/layout/Sidebar.tsx
import React from 'react'
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add'
import ImageIcon from '@mui/icons-material/Image' // Icon cho Image Gallery
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary' // Icon cho Videos Library
import AudiotrackIcon from '@mui/icons-material/Audiotrack' // Icon cho Audio Library

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 p-4 bg-gray-100">
      <nav className="space-y-2">
        <Link
          href="/flow/generate-video"
          className="flex items-center gap-2 px-3 py-2 text-white font-bold
                     rounded-full bg-gradient-to-r from-blue-500 to-blue-700
                     shadow-md hover:shadow-lg transition w-50 h-15  justify-center"
        >
          <AddIcon fontSize="medium" />
          Generate Video
        </Link>
        <Link
          href="/media/images"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
        >
          <ImageIcon fontSize="small" className="text-gray-600" />
          Image Gallery
        </Link>
        <Link
          href="/media/videos"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
        >
          <VideoLibraryIcon fontSize="small" className="text-gray-600" />
          Videos Library
        </Link>
        <Link
          href="/media/audios"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
        >
          <AudiotrackIcon fontSize="small" className="text-gray-600" />
          Audio Library
        </Link>
        {/* Additional links */}
      </nav>
    </aside>
  )
}

export default Sidebar
