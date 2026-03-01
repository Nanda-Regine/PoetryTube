'use client'

import { useState } from 'react'
import { Profile, Video, Poem } from '@/types'
import VideoGrid from '@/components/video/VideoGrid'
import PoemCard from '@/components/poem/PoemCard'

interface ProfileTabsProps {
  profile: Profile
  videos: Video[]
  poems: Poem[]
  isOwnProfile: boolean
}

export default function ProfileTabs({ profile, videos, poems, isOwnProfile }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'poems'>('videos')

  const tabs = [
    { id: 'videos' as const, label: 'Videos', count: videos.length, icon: '🎬' },
    { id: 'poems' as const, label: 'Poems', count: poems.length, icon: '📜' },
  ]

  return (
    <div>
      {/* Tab buttons */}
      <div className="border-b border-poetry-border mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gold text-gold'
                  : 'border-transparent text-poetry-muted hover:text-poetry-text'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
              <span className="text-sm">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'videos' && (
          <div>
            {videos.length > 0 ? (
              <VideoGrid videos={videos} />
            ) : (
              <EmptyState
                icon="🎬"
                title="No videos yet"
                description={
                  isOwnProfile
                    ? 'Share your first performance with the world!'
                    : `${profile.display_name || profile.username} hasn't uploaded any videos yet.`
                }
                actionLabel={isOwnProfile ? 'Upload Video' : undefined}
                actionHref="/upload"
              />
            )}
          </div>
        )}

        {activeTab === 'poems' && (
          <div>
            {poems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {poems.map((poem) => (
                  <PoemCard key={poem.id} poem={poem} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="📜"
                title="No poems yet"
                description={
                  isOwnProfile
                    ? 'Share your words and let them live forever!'
                    : `${profile.display_name || profile.username} hasn't posted any poems yet.`
                }
                actionLabel={isOwnProfile ? 'Post Poem' : undefined}
                actionHref="/upload"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="font-serif text-xl text-poetry-text mb-2">{title}</h3>
      <p className="text-poetry-muted mb-6">{description}</p>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="inline-block px-6 py-3 bg-burgundy hover:bg-burgundy-light rounded-lg font-medium transition-colors"
        >
          {actionLabel}
        </a>
      )}
    </div>
  )
}
