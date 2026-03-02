'use client'

import { useRef, useState } from 'react'
import { callOpenAI } from '@/lib/ai'

const TITLE_PROMPT = `Generate 5 compelling titles for a spoken word performance based on the content provided. Each title must be different in style:
1. Provocative and political
2. Poetic and abstract
3. Deeply personal and intimate
4. Universal and philosophical
5. Short and punchy (under 4 words)

Return ONLY a numbered list of titles. No explanations.`

const MOOD_PROMPT = `You are a poetry curator. Read the following poem or description and return ONLY a JSON array of 1-3 mood tags from this exact list: ['Defiant', 'Tender', 'Grief', 'Joy', 'Resistance', 'Love', 'Identity', 'Hope']

Example: ["Love", "Tender"]

Return ONLY the JSON array. Nothing else.`

const STYLE_LABELS = ['Provocative', 'Poetic', 'Intimate', 'Philosophical', 'Punchy']

const MOOD_TAGS = [
  { key: 'defiant',    label: 'Defiant 🔥' },
  { key: 'tender',     label: 'Tender 🌸' },
  { key: 'grief',      label: 'Grief 💙' },
  { key: 'joy',        label: 'Joy ✨' },
  { key: 'resistance', label: 'Resistance ✊' },
  { key: 'love',       label: 'Love 🌹' },
  { key: 'identity',   label: 'Identity 🌍' },
  { key: 'hope',       label: 'Hope 🌱' },
]

export default function UploadClient() {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const descRef       = useRef<HTMLTextAreaElement>(null)

  const [titles, setTitles]     = useState<string[]>([])
  const [titlesLoading, setTL]  = useState(false)

  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [moodLoading, setML]              = useState(false)

  async function generateTitles() {
    const desc = descRef.current?.value.trim() ?? ''
    if (!desc) { descRef.current?.focus(); return }
    setTL(true); setTitles([])
    try {
      const result = await callOpenAI(TITLE_PROMPT, desc)
      const lines  = result.split('\n').filter(l => l.trim())
      const parsed = lines.map(l => l.replace(/^\d+[\.)]\s*/, '').trim()).filter(Boolean)
      setTitles(parsed)
    } catch (e) {
      setTitles([`⚠️ ${(e as Error).message}`])
    } finally {
      setTL(false)
    }
  }

  async function autoTagMood() {
    const desc = descRef.current?.value.trim() ?? ''
    if (!desc) { descRef.current?.focus(); return }
    setML(true)
    try {
      const result  = await callOpenAI(MOOD_PROMPT, desc)
      const cleaned = result.replace(/```json|```/g, '').trim()
      let moods: string[] = JSON.parse(cleaned)
      if (!Array.isArray(moods)) moods = [moods as unknown as string]
      setSelectedMoods(moods.map(m => m.toLowerCase()))
    } catch {
      // Fail silently
    } finally {
      setML(false)
    }
  }

  function toggleMood(key: string) {
    setSelectedMoods(prev => prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key])
  }

  function selectTitle(title: string) {
    if (titleInputRef.current) { titleInputRef.current.value = title; titleInputRef.current.focus() }
  }

  return (
    <div className="upload-page">
      <h1 className="upload-page-title">Share Your Voice 🌹</h1>
      <p className="upload-page-subtitle">Upload your performance. Let your words live forever.</p>

      <div className="upload-dropzone" role="button" tabIndex={0} aria-label="Upload video file">
        <div className="dz-icon">🎬</div>
        <h3>Drag &amp; drop your video here</h3>
        <p>MP4, MOV, WebM · Up to 4GB</p>
        <p style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--gold-dim)' }}>or click to browse files</p>
      </div>

      <div className="form-card">
        <div className="form-card-title">✦ Performance Details</div>

        <div className="form-group">
          <label className="form-label" htmlFor="video-title-input">Title</label>
          <input ref={titleInputRef} type="text" id="video-title-input" className="form-input" placeholder="Give your piece a name…" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="poem-description">Poem / Description</label>
          <textarea ref={descRef} id="poem-description" className="form-textarea" placeholder="Paste your poem or describe your performance… (Used for AI title & mood suggestions)" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="performer-name">Performer Name</label>
          <input type="text" id="performer-name" className="form-input" placeholder="Your name or stage name" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category-select">Category</label>
          <select id="category-select" className="form-input" style={{ cursor: 'pointer' }}>
            <option value="">Select a category…</option>
            <option>Spoken Word</option>
            <option>Slam Poetry</option>
            <option>Storytelling</option>
            <option>Theatre &amp; Monologue</option>
            <option>Music Poetry</option>
            <option>Visual Art Performances</option>
            <option>New Voices</option>
          </select>
        </div>
      </div>

      {/* Title Generator */}
      <div className="ai-feature-card">
        <div className="ai-feature-header">
          <span className="ai-badge">✨ AI</span>
          <span className="ai-feature-title">Generate Title Ideas</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
          Paste your poem in the description above, then let AI suggest 5 powerful titles.
        </p>
        <button className="ai-action-btn" onClick={generateTitles} disabled={titlesLoading}>
          {titlesLoading ? <><span className="loading-dots"><span/><span/><span/></span> Generating…</> : '✨ Get AI Title Ideas'}
        </button>

        {titles.length > 0 && (
          <div className={`title-chips visible`} id="title-chips">
            {titles.map((title, i) => (
              <button key={i} className="title-chip" onClick={() => selectTitle(title)}>
                <span className="chip-num">{STYLE_LABELS[i] ?? `Option ${i + 1}`}</span>
                {title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mood Auto-Tagger */}
      <div className="ai-feature-card">
        <div className="ai-feature-header">
          <span className="ai-badge">🏷️ AI</span>
          <span className="ai-feature-title">Auto-Tag Your Mood</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
          Let AI read your poem and auto-select the matching emotional mood tags.
        </p>
        <button className="ai-action-btn" onClick={autoTagMood} disabled={moodLoading} style={{ marginBottom: 16 }}>
          {moodLoading ? <span className="loading-dots"><span/><span/><span/></span> : '🏷️ Auto-Tag Mood'}
        </button>

        <div className="mood-tag-selector" role="group" aria-label="Mood tags">
          {MOOD_TAGS.map(({ key, label }) => (
            <button
              key={key}
              className={`mood-tag-chip mood-${key}${selectedMoods.includes(key) ? ' selected' : ''}`}
              data-mood={key}
              onClick={() => toggleMood(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '12px 0 40px' }}>
        <button className="submit-btn" onClick={() => alert('Upload complete! (Demo — connect backend to publish)')}>
          Publish My Performance 🌹
        </button>
      </div>
    </div>
  )
}
