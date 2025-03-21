// src/components/video/VideoEditor.tsx
import React, { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

const VideoEditor: React.FC = () => {
  const [title, setTitle] = useState('')

  const handleSave = () => {
    // <TODO>: Implement save logic
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Video Details</h2>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter video title"
        fullWidth
      />
      <Button onClick={handleSave} className="mt-4">
        Save Changes
      </Button>
    </div>
  )
}

export default VideoEditor
