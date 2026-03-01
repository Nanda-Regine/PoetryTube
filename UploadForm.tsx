'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MOOD_TAGS, Profile } from '@/types'
import { getMoodColor } from '@/lib/utils'

interface UploadFormProps {
  userId: string
  profile: Profile | null
}

export default function UploadForm({ userId, profile }: UploadFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // AI states
  const [generatingTitles, setGeneratingTitles] = useState(false)
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([])
  const [taggingMoods, setTaggingMoods] = useState(false)

  const handleGenerateTitles = async () => {
    if (!description.trim()) {
      alert('Please add a description first')
      return
    }

    setGeneratingTitles(true)
    setTitleSuggestions([])

    try {
      const response = await fetch('/api/ai/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate titles')
      }

      const data = await response.json()
      setTitleSuggestions(data.titles)
    } catch (err) {
      alert('Failed to generate titles. Please try again.')
    } finally {
      setGeneratingTitles(false)
    }
  }

  const handleAutoTagMoods = async () => {
    if (!description.trim()) {
      alert('Please add a description first')
      return
    }

    setTaggingMoods(true)

    try {
      const response = await fetch('/api/ai/tag-moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) {
        throw new Error('Failed to tag moods')
      }

      const data = await response.json()
      setSelectedMoods(data.moods)
    } catch (err) {
      alert('Failed to auto-tag moods. Please try again.')
    } finally {
      setTaggingMoods(false)
    }
  }

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!videoFile) {
      setError('Please select a video file')
      return
    }

    if (!title || !category) {
      setError('Please fill in all required fields')
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()

      // Upload video file
      const fileExt = videoFile.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName)

      // Create video record
      const { error: dbError } = await supabase.from('videos').insert({
        user_id: userId,
        title,
        description: description || null,
        video_url: publicUrl,
        category,
        moods: selectedMoods,
        is_published: true,
      })

      if (dbError) throw dbError

      // Success
      router.push(`/profile/${profile?.username}`)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload video. Please try again.')
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Video upload */}
      <div className="bg-bg-card border border-poetry-border-light rounded-2xl p-8">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          className="hidden"
          id="video-file"
        />
        <label
          htmlFor="video-file"
          className="block border-2 border-dashed border-poetry-border-light rounded-xl p-12 text-center cursor-pointer hover:border-gold-dim hover:bg-bg-hover transition-colors"
        >
          <div className="text-5xl mb-4">🎬</div>
          <h3 className="font-serif text-lg text-poetry-text mb-2">
            {videoFile ? videoFile.name : 'Drag & drop your video here'}
          </h3>
          <p className="text-sm text-poetry-dim">
            MP4, MOV, WebM · Up to 4GB
          </p>
        </label>
      </div>

      {/* Basic info */}
      <div className="bg-bg-card border border-poetry-border rounded-2xl p-6 space-y-5">
        <h2 className="font-serif text-xl font-semibold text-gold flex items-center gap-2">
          <span>✦</span> Performance Details
        </h2>

        <div>
          <label className="block text-sm font-medium text-poetry-muted mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-bg border border-poetry-border-light rounded-lg px-4 py-2.5 text-poetry-text outline-none focus:border-burgundy-light transition-colors"
            placeholder="Give your piece a name…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-poetry-muted mb-2">
            Poem / Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full bg-bg border border-poetry-border-light rounded-lg px-4 py-3 text-poetry-text font-serif italic leading-relaxed resize-y outline-none focus:border-burgundy-light transition-colors"
            placeholder="Paste your poem or describe your performance…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-poetry-muted mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full bg-bg border border-poetry-border-light rounded-lg px-4 py-2.5 text-poetry-text outline-none focus:border-burgundy-light transition-colors cursor-pointer"
          >
            <option value="">Select a category…</option>
            <option>Spoken Word</option>
            <option>Slam Poetry</option>
            <option>Storytelling</option>
            <option>Theatre & Monologue</option>
            <option>Music Poetry</option>
            <option>Visual Art Performances</option>
            <option>New Voices</option>
          </select>
        </div>
      </div>

      {/* AI Title Generator */}
      <div className="bg-gradient-to-br from-burgundy/30 to-gold/5 border border-gold/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-burgundy rounded-full text-xs font-semibold text-gold uppercase tracking-wide">
            ✨ AI
          </span>
          <h3 className="font-serif text-lg font-semibold text-poetry-text">
            Generate Title Ideas
          </h3>
        </div>
        <p className="text-sm text-poetry-muted font-serif italic">
          Let AI suggest 5 powerful titles across different styles
        </p>
        <button
          type="button"
          onClick={handleGenerateTitles}
          disabled={generatingTitles}
          className="px-5 py-2.5 bg-gradient-to-r from-burgundy to-burgundy-light text-white rounded-lg font-medium transition-all disabled:opacity-50"
        >
          {generatingTitles ? 'Generating...' : '✨ Get AI Title Ideas'}
        </button>

        {titleSuggestions.length > 0 && (
          <div className="grid gap-2 animate-fade-in">
            {titleSuggestions.map((suggestion, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTitle(suggestion)}
                className="text-left p-3 bg-bg-hover border border-poetry-border rounded-lg hover:border-gold-dim transition-colors"
              >
                <div className="text-xs text-gold-dim mb-1">Option {i + 1}</div>
                <div className="font-serif italic text-poetry-text">{suggestion}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* AI Mood Tagger */}
      <div className="bg-gradient-to-br from-burgundy/30 to-gold/5 border border-gold/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-burgundy rounded-full text-xs font-semibold text-gold uppercase tracking-wide">
            🏷️ AI
          </span>
          <h3 className="font-serif text-lg font-semibold text-poetry-text">
            Auto-Tag Your Mood
          </h3>
        </div>
        <p className="text-sm text-poetry-muted font-serif italic">
          Let AI read your poem and suggest mood tags
        </p>
        <button
          type="button"
          onClick={handleAutoTagMoods}
          disabled={taggingMoods}
          className="px-5 py-2.5 bg-gradient-to-r from-burgundy to-burgundy-light text-white rounded-lg font-medium transition-all disabled:opacity-50"
        >
          {taggingMoods ? 'Analyzing...' : '🏷️ Auto-Tag Mood'}
        </button>

        <div className="flex flex-wrap gap-2">
          {MOOD_TAGS.map((mood) => {
            const isSelected = selectedMoods.includes(mood)
            const color = getMoodColor(mood)
            return (
              <button
                key={mood}
                type="button"
                onClick={() => toggleMood(mood)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  isSelected
                    ? 'text-white'
                    : 'bg-bg border-poetry-border-light text-poetry-muted hover:bg-bg-hover'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: color,
                        borderColor: color,
                      }
                    : undefined
                }
              >
                {mood}
              </button>
            )
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="text-center py-4">
        <button
          type="submit"
          disabled={uploading}
          className="px-8 py-3 bg-gradient-to-r from-gold-dim to-gold hover:from-gold hover:to-gold-light text-bg font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Publish My Performance 🌹'}
        </button>
      </div>
    </form>
  )
}
