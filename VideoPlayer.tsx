'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Video } from '@/types'

interface VideoPlayerProps {
  video: Video
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    // In production, this would initialize the actual video player
    // For now, we'll show a placeholder
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {!isPlaying ? (
        <>
          {/* Thumbnail */}
          {video.thumbnail_url && (
            <Image
              src={video.thumbnail_url}
              alt={video.title}
              fill
              className="object-cover"
              priority
            />
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <button
              onClick={handlePlay}
              className="w-20 h-20 rounded-full bg-gold/90 hover:bg-gold flex items-center justify-center transition-all hover:scale-110 shadow-2xl"
              aria-label="Play video"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 fill-bg ml-1"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        // Video player placeholder
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-poetry-muted font-serif italic">
              Video player integration coming soon
            </p>
            <p className="text-sm text-poetry-dim mt-2">
              Connect to your video hosting service
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
