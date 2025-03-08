// src/modules/video/VideoCreator.tsx
import React, { useState } from 'react'
import DashboardLayout from '@layouts/DashboardLayout'
import TextEditor from '@components/forms/TextEditor'
import Button from '@components/common/Button'
import VideoPreview from '@components/video/VideoPreview'

export default function VideoCreator() {
  const [script, setScript] = useState('')
  const [videoUrl] = useState('<TODO: Video URL>')

  const handleGenerateVideo = async () => {
    // <TODO>: Call API to generate video from script
    console.log('Generating video for script:', script)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Scientific Video Creator</h2>
        <TextEditor value={script} onChange={setScript} />
        <Button onClick={handleGenerateVideo} className="mt-4">
          Generate Video
        </Button>
        <div className="mt-8">
          <VideoPreview videoUrl={videoUrl} />
        </div>
      </div>
    </DashboardLayout>
  )
}
