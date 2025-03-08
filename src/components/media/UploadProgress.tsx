// src/components/media/UploadProgress.tsx
import React from 'react'

interface UploadProgressProps {
  progress: number // percentage
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-300 rounded h-4">
      <div
        className="bg-blue-600 h-4 rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default UploadProgress
