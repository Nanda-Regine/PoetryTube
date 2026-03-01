'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Video } from '@/types'
import { formatCount, timeAgo, getMoodColor } from '@/lib/utils'

interface VideoInfoProps {
  video: Video
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(video.like_count)

  const authorName = video.profile?.display_name || video.profile?.username || 'Anonymous'
  const authorUsername = video.profile?.username || 'anonymous'
  const authorInitials = authorName.slice(0, 2).toUpperCase()

  const handleLike = async () => {
    // Optimistic update
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)

    // TODO: Make API call to like/unlike
    // await fetch('/api/videos/${video.id}/like', { method: 'POST' })
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="font-display text-2xl md:text-3xl font-bold text-poetry-text leading-tight">
        {video.title}
      </h1>

      {/* Metadata row */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-poetry-border">
        {/* Author info */}
        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${authorUsername}`}
            className="w-10 h-10 rounded-full bg-burgundy-mid flex items-center justify-center font-display font-bold text-sm text-gold border-2 border-poetry-border-light hover:border-gold transition-colors"
          >
            {authorInitials}
          </Link>
          <div>
            <Link
              href={`/profile/${authorUsername}`}
              className="font-medium text-poetry-text hover:text-gold transition-colors"
            >
              {authorName}
            </Link>
            <p className="text-xs text-poetry-dim">
              {video.profile?.follower_count || 0} followers
            </p>
          </div>
          <button className="ml-2 px-4 py-1.5 rounded-full border border-burgundy-light text-sm font-medium hover:bg-burgundy transition-colors">
            Follow
          </button>
        </div>

        {/* Stats */}
        <div className="text-sm text-poetry-dim">
          {formatCount(video.view_count)} views · {timeAgo(video.created_at)}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm transition-all ${
            isLiked
              ? 'bg-gold/15 border-gold text-gold'
              : 'border-poetry-border-light text-poetry-muted hover:bg-bg-hover'
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          {formatCount(likeCount)}
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-poetry-border-light text-poetry-muted hover:bg-bg-hover font-medium text-sm transition-all">
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {video.comment_count}
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-poetry-border-light text-poetry-muted hover:bg-bg-hover font-medium text-sm transition-all">
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-poetry-border-light text-poetry-muted hover:bg-bg-hover font-medium text-sm transition-all">
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save
        </button>
      </div>

      {/* Mood pills */}
      {video.moods && video.moods.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {video.moods.map((mood) => (
            <Link
              key={mood}
              href={`/?mood=${mood.toLowerCase()}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
              style={{
                backgroundColor: `${getMoodColor(mood)}15`,
                borderColor: `${getMoodColor(mood)}30`,
                color: getMoodColor(mood),
              }}
            >
              {mood}
            </Link>
          ))}
        </div>
      )}

      {/* Description */}
      {video.description && (
        <div className="bg-bg-card border border-poetry-border rounded-lg p-4">
          <h3 className="font-serif font-semibold text-poetry-text mb-2">
            About this performance
          </h3>
          <p className="text-sm text-poetry-muted leading-relaxed whitespace-pre-wrap">
            {video.description}
          </p>
        </div>
      )}
    </div>
  )
}
