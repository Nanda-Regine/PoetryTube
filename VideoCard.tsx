'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Video } from '@/types'
import { formatCount, formatDuration, timeAgo, getMoodColor } from '@/lib/utils'

interface VideoCardProps {
  video: Video
}

export default function VideoCard({ video }: VideoCardProps) {
  const thumbnailUrl = video.thumbnail_url || '/placeholder-thumbnail.jpg'
  const authorName = video.profile?.display_name || video.profile?.username || 'Anonymous'
  const authorAvatar = video.profile?.avatar_url

  return (
    <Link
      href={`/watch/${video.id}`}
      className="group block bg-bg-card rounded-lg overflow-hidden border border-poetry-border hover:border-poetry-border-light transition-all hover:shadow-card hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-bg-hover overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Duration badge */}
        {video.duration_seconds && (
          <div className="absolute bottom-2 right-2 bg-black/85 text-poetry-text text-xs font-medium px-2 py-0.5 rounded">
            {formatDuration(video.duration_seconds)}
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/30 transition-colors flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-gold/0 group-hover:bg-gold/90 transition-all flex items-center justify-center scale-75 group-hover:scale-100">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-bg ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <h3 className="font-serif font-semibold text-poetry-text text-base leading-snug line-clamp-2 group-hover:text-gold transition-colors">
          {video.title}
        </h3>

        {/* Author & stats */}
        <div className="flex items-center justify-between gap-2 text-xs text-poetry-muted">
          <span className="truncate">{authorName}</span>
          <span className="flex-shrink-0">{formatCount(video.view_count)} views</span>
        </div>

        {/* Mood pills */}
        {video.moods && video.moods.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {video.moods.slice(0, 2).map((mood) => (
              <span
                key={mood}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
                style={{
                  backgroundColor: `${getMoodColor(mood)}15`,
                  borderColor: `${getMoodColor(mood)}30`,
                  color: getMoodColor(mood),
                }}
              >
                {mood}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
