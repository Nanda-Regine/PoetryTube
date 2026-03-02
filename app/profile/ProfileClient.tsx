'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-client'
import { LANGUAGE_LABELS, type Language } from '@/lib/language'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  username: string | null
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  language: Language | null
  location: string | null
  website: string | null
  video_count: number
  book_count: number
  follower_count: number
  following_count: number
  created_at: string
}

function getInitials(name: string) {
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function coverHue(username: string | null) {
  const h = (username ?? '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return `linear-gradient(135deg, hsl(${h},40%,18%) 0%, #0A0A1A 100%)`
}

export default function ProfileClient() {
  const [user, setUser]       = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'videos' | 'books' | 'about'>('videos')
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        const { data: p } = await supabase
          .from('profiles').select('*').eq('id', u.id).single()
        setProfile(p as Profile | null)
      }
      setLoading(false)
    })
  }, [supabase])

  function openAuth() { window.dispatchEvent(new CustomEvent('pt-open-auth')) }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null); setProfile(null)
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-skeleton-cover" />
        <div className="profile-skeleton-body">
          <div className="skeleton-circle" />
          <div className="skeleton-lines">
            <div className="skeleton-line w-40" />
            <div className="skeleton-line w-24" />
            <div className="skeleton-line w-60" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="profile-signin-prompt">
        <div className="prompt-icon">🌹</div>
        <h2>Your Voice Matters</h2>
        <p>Sign in to create your profile, upload performances, and connect with African poets worldwide.</p>
        <button className="prompt-cta-btn" onClick={openAuth}>Sign In / Create Account</button>
        <button className="prompt-secondary-btn" onClick={() => window.history.back()}>Go Back</button>
      </div>
    )
  }

  const displayName = profile?.display_name ?? user.email ?? '?'
  const initials    = getInitials(displayName)
  const handle      = profile?.username ? `@${profile.username}` : user.email ?? ''

  return (
    <div id="profile-content">
      {/* ── Hero ── */}
      <div className="profile-hero">
        <div
          className="profile-cover"
          style={{ background: coverHue(profile?.username ?? null) }}
        />
        <div className="profile-hero-inner">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar" id="profile-avatar">
              {profile?.avatar_url
                ? <Image src={profile.avatar_url} alt={displayName} fill style={{ objectFit: 'cover' }} sizes="100px" />
                : initials}
            </div>
            <label className="avatar-upload-label" title="Change avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <input type="file" accept="image/*" style={{ display: 'none' }} />
            </label>
          </div>

          <div className="profile-meta">
            <h1 className="profile-display-name">{displayName}</h1>
            <p className="profile-handle">{handle}</p>
            {profile?.bio && <p className="profile-bio">{profile.bio}</p>}

            <div className="profile-badges">
              {profile?.language && profile.language !== 'en' && (
                <span className="profile-badge">🌍 {LANGUAGE_LABELS[profile.language]}</span>
              )}
              {profile?.location && (
                <span className="profile-badge">📍 {profile.location}</span>
              )}
            </div>

            <div className="profile-stats">
              {[
                { label: 'Videos',    val: profile?.video_count    ?? 0 },
                { label: 'Books',     val: profile?.book_count     ?? 0 },
                { label: 'Followers', val: profile?.follower_count  ?? 0 },
                { label: 'Following', val: profile?.following_count ?? 0 },
              ].map(({ label, val }) => (
                <div key={label} className="stat-item">
                  <span className="stat-num">{val}</span>
                  <span className="stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="profile-actions">
        <button className="edit-profile-btn">Edit Profile</button>
        <button className="signout-link" onClick={signOut}>Sign out</button>
      </div>

      {/* ── Tabs ── */}
      <div className="profile-tabs">
        {(['videos', 'books', 'about'] as const).map(tab => (
          <button
            key={tab}
            className={`profile-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Tab panels ── */}
      {activeTab === 'videos' && (
        <div className="profile-tab-panel">
          <p className="empty-tab-msg">No performances uploaded yet. <a href="/upload" style={{ color: 'var(--gold)' }}>Upload your first →</a></p>
        </div>
      )}
      {activeTab === 'books' && (
        <div className="profile-tab-panel">
          <p className="empty-tab-msg">No books shared yet. <a href="/books" style={{ color: 'var(--gold)' }}>Visit Book Shelf →</a></p>
        </div>
      )}
      {activeTab === 'about' && (
        <div className="profile-tab-panel">
          <div className="about-card">
            {profile?.bio && (
              <div className="about-row">
                <span className="about-icon">✍️</span>
                <p className="about-value">{profile.bio}</p>
              </div>
            )}
            <div className="about-row">
              <span className="about-icon">🌍</span>
              <p className="about-value">{LANGUAGE_LABELS[profile?.language ?? 'en']}</p>
            </div>
            {profile?.location && (
              <div className="about-row">
                <span className="about-icon">📍</span>
                <p className="about-value">{profile.location}</p>
              </div>
            )}
            {profile?.website && (
              <div className="about-row">
                <span className="about-icon">🔗</span>
                <a className="about-value about-link" href={profile.website} target="_blank" rel="noopener noreferrer">
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {profile?.created_at && (
              <div className="about-row">
                <span className="about-icon">📅</span>
                <p className="about-value">
                  Joined {new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
