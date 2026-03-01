import Link from 'next/link'
import { Poem } from '@/types'
import { formatCount, timeAgo, getMoodColor } from '@/lib/utils'

interface PoemCardProps {
  poem: Poem
}

export default function PoemCard({ poem }: PoemCardProps) {
  const excerpt = poem.excerpt || poem.content.slice(0, 150) + '…'

  return (
    <Link
      href={`/poem/${poem.id}`}
      className="group block bg-bg-card border border-poetry-border hover:border-poetry-border-light rounded-lg p-5 transition-all hover:shadow-card"
    >
      {/* Title */}
      <h3 className="font-serif font-semibold text-poetry-text text-lg mb-2 line-clamp-2 group-hover:text-gold transition-colors">
        {poem.title}
      </h3>

      {/* Excerpt */}
      <p className="font-serif italic text-sm text-poetry-muted leading-relaxed mb-4 line-clamp-3">
        {excerpt}
      </p>

      {/* Mood pills */}
      {poem.moods && poem.moods.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {poem.moods.slice(0, 2).map((mood) => (
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

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-poetry-dim">
        <span>{formatCount(poem.view_count)} views</span>
        <span>{formatCount(poem.like_count)} likes</span>
        <span>{timeAgo(poem.created_at)}</span>
      </div>
    </Link>
  )
}
