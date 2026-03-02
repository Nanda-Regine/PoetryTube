'use client'

import { useCallback, useState } from 'react'

const MOODS = [
  { key: 'all',        label: 'All 🌍' },
  { key: 'defiant',    label: 'Defiant 🔥' },
  { key: 'tender',     label: 'Tender 🌸' },
  { key: 'grief',      label: 'Grief 💙' },
  { key: 'joy',        label: 'Joy ✨' },
  { key: 'resistance', label: 'Resistance ✊' },
  { key: 'love',       label: 'Love 🌹' },
  { key: 'identity',   label: 'Identity 🌍' },
  { key: 'hope',       label: 'Hope 🌱' },
]

export default function MoodFilter() {
  const [active, setActive] = useState('all')

  const filter = useCallback((mood: string) => {
    setActive(mood)

    // Filter video sections and cards
    const sections = document.querySelectorAll<HTMLElement>('.video-section[data-moods]')
    const allCards = document.querySelectorAll<HTMLElement>('.video-card')

    if (mood === 'all') {
      sections.forEach(s => s.classList.remove('hidden'))
      allCards.forEach(c => { c.style.display = '' })
      return
    }

    sections.forEach(section => {
      const cards = section.querySelectorAll<HTMLElement>('.video-card')
      let anyVisible = false
      cards.forEach(card => {
        const cardMoods = (card.dataset.moods ?? '').split(',').map(m => m.trim().toLowerCase())
        const match = cardMoods.includes(mood.toLowerCase())
        card.style.display = match ? '' : 'none'
        if (match) anyVisible = true
      })
      section.classList.toggle('hidden', !anyVisible)
    })
  }, [])

  return (
    <div className="mood-filter-bar" role="toolbar" aria-label="Filter by mood">
      {MOODS.map(({ key, label }) => (
        <button
          key={key}
          className={`mood-filter-btn${key === 'all' ? ' filter-all-btn' : ''}${active === key ? ' active' : ''}${key !== 'all' ? ` mood-${key}` : ''}`}
          data-mood={key}
          onClick={() => filter(key)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
