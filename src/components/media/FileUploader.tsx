// src/components/media/FileUploader.tsx
import React, { useRef } from 'react'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0])
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Choose File
      </button>
    </div>
  )
}

export default FileUploader
