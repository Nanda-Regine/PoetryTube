'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Profile } from '@/types'
import { formatCount } from '@/lib/utils'

interface ProfileHeaderProps {
  profile: Profile
  isOwnProfile: boolean
}

export default function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const displayName = profile.display_name || profile.username
  const initials = displayName.slice(0, 2).toUpperCase()

  const socialLinks = profile.social_links || {}
  const socialPlatforms = [
    { key: 'instagram', icon: '📷', label: 'Instagram' },
    { key: 'twitter', icon: '🐦', label: 'Twitter' },
    { key: 'tiktok', icon: '🎵', label: 'TikTok' },
    { key: 'youtube', icon: '📺', label: 'YouTube' },
    { key: 'spotify', icon: '🎧', label: 'Spotify' },
    { key: 'soundcloud', icon: '🎵', label: 'SoundCloud' },
  ]

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // TODO: API call
  }

  return (
    <div className="bg-bg-card border border-poetry-border rounded-2xl overflow-hidden mb-8">
      {/* Banner */}
      <div className="h-32 md:h-48 bg-gradient-to-br from-burgundy via-burgundy-mid to-gold relative">
        {profile.banner_url && (
          <Image
            src={profile.banner_url}
            alt="Profile banner"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Profile info */}
      <div className="px-6 py-5">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-burgundy-mid border-4 border-bg-card flex items-center justify-center font-display font-bold text-3xl md:text-4xl text-gold">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={displayName}
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                initials
              )}
            </div>
          </div>

          {/* Name and stats */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-poetry-text mb-1">
              {displayName}
            </h1>
            <p className="text-poetry-muted mb-3">@{profile.username}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm mb-4">
              <div>
                <span className="font-semibold text-poetry-text">
                  {formatCount(profile.follower_count)}
                </span>{' '}
                <span className="text-poetry-dim">followers</span>
              </div>
              <div>
                <span className="font-semibold text-poetry-text">
                  {formatCount(profile.following_count)}
                </span>{' '}
                <span className="text-poetry-dim">following</span>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-poetry-muted text-sm leading-relaxed mb-4 max-w-2xl">
                {profile.bio}
              </p>
            )}

            {/* Location and website */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-poetry-dim mb-4">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-gold transition-colors"
                >
                  <span>🔗</span>
                  <span>{new URL(profile.website).hostname}</span>
                </a>
              )}
            </div>

            {/* Social links */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {socialPlatforms.map(
                  (platform) =>
                    socialLinks[platform.key as keyof typeof socialLinks] && (
                      <a
                        key={platform.key}
                        href={socialLinks[platform.key as keyof typeof socialLinks]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-bg-hover border border-poetry-border-light rounded-full text-xs hover:border-gold-dim transition-colors"
                        title={platform.label}
                      >
                        <span>{platform.icon}</span>
                        <span>{platform.label}</span>
                      </a>
                    )
                )}
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="flex-shrink-0">
            {isOwnProfile ? (
              <a
                href="/profile/edit"
                className="px-6 py-2 border border-poetry-border-light rounded-full text-sm font-medium hover:bg-bg-hover transition-colors"
              >
                Edit Profile
              </a>
            ) : (
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  isFollowing
                    ? 'border border-poetry-border-light hover:bg-bg-hover'
                    : 'bg-burgundy hover:bg-burgundy-light text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
