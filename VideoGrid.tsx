'use client'

import { useMemo } from 'react'
import { Video, MoodTag } from '@/types'
import VideoCard from './VideoCard'

interface VideoGridProps {
  videos: Video[]
  filterMood?: MoodTag
}

export default function VideoGrid({ videos, filterMood }: VideoGridProps) {
  // Filter videos by mood if specified
  const filteredVideos = useMemo(() => {
    if (!filterMood) return videos
    
    return videos.filter((video) =>
      video.moods?.some(
        (mood) => mood.toLowerCase() === filterMood.toLowerCase()
      )
    )
  }, [videos, filterMood])

  if (filteredVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🔍</div>
        <p className="font-serif text-lg text-poetry-muted italic">
          No performances found
          {filterMood && ` with "${filterMood}" mood`}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
      {filteredVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
