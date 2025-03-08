// src/app/video-editor/page.tsx
'use client'
import React, { useState } from 'react'
import DashboardLayout from '@layouts/DashboardLayout'
import VideoPreview from '@components/video/VideoPreview'
import VideoEditor from '@components/video/VideoEditor'
import Timeline from '@components/video/Timeline'

export default function VideoEditorPage() {
  const [videoUrl] = useState('<TODO: Video URL>')

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Video Editor</h2>
      <div className="mb-4">
        <VideoPreview videoUrl={videoUrl} />
      </div>
      <VideoEditor />
      <div className="mt-8">
        <Timeline />
      </div>
    </DashboardLayout>
  )
}
