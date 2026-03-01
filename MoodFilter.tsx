'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { MOOD_TAGS, getMoodColor } from '@/lib/utils'

interface MoodFilterProps {
  selectedMood?: string
}

export default function MoodFilter({ selectedMood }: MoodFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleMoodClick = (mood: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (mood) {
      params.set('mood', mood.toLowerCase())
    } else {
      params.delete('mood')
    }

    // Preserve other params like category
    const queryString = params.toString()
    router.push(queryString ? `/?${queryString}` : '/')
  }

  const moodEmojis: Record<string, string> = {
    all: '🌍',
    defiant: '🔥',
    tender: '🌸',
    grief: '💙',
    joy: '✨',
    resistance: '✊',
    love: '🌹',
    identity: '🌍',
    hope: '🌱',
  }

  return (
    <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max pb-2">
        {/* All button */}
        <button
          onClick={() => handleMoodClick(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
            !selectedMood
              ? 'bg-gold text-bg shadow-gold'
              : 'bg-bg-card border border-poetry-border-light text-poetry-muted hover:bg-bg-hover hover:text-poetry-text'
          }`}
        >
          <span>{moodEmojis.all}</span>
          <span>All</span>
        </button>

        {/* Mood buttons */}
        {MOOD_TAGS.map((mood) => {
          const isActive = selectedMood?.toLowerCase() === mood.toLowerCase()
          const color = getMoodColor(mood)

          return (
            <button
              key={mood}
              onClick={() => handleMoodClick(mood)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'bg-bg-card border border-poetry-border-light text-poetry-muted hover:bg-bg-hover hover:text-poetry-text'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: color,
                      borderColor: color,
                    }
                  : undefined
              }
            >
              <span>{moodEmojis[mood.toLowerCase()] || '•'}</span>
              <span>{mood}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
