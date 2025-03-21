// src/components/media/MediaPlayer.tsx
import React from 'react'

interface MediaPlayerProps {
  mediaUrl: string
  type: 'video' | 'audio'
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ mediaUrl, type }) => {
  return (
    <div className="w-full h-64 bg-black">
      {type === 'video' ? (
        <video src={mediaUrl} controls className="w-full h-full" />
      ) : (
        <audio src={mediaUrl} controls className="w-full" />
      )}
    </div>
  )
}

export default MediaPlayer
