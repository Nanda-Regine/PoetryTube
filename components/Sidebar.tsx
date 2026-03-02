'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { href: '/',        label: 'Home',                    icon: <svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { href: '#',        label: 'Featured',                icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> },
  { href: '#',        label: 'Spoken Word',             icon: <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
  { href: '#',        label: 'Slam Poetry',             icon: <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { href: '#',        label: 'Storytelling',            icon: <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { href: '#',        label: 'Theatre & Monologue',     icon: <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg> },
  { href: '#',        label: 'Music Poetry',            icon: <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
  { href: '#',        label: 'Visual Art Performances', icon: <svg viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg> },
  { href: '#',        label: 'New Voices',              icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
]

const MOODS = [
  { mood: 'defiant',    label: 'Defiant 🔥' },
  { mood: 'tender',     label: 'Tender 🌸' },
  { mood: 'grief',      label: 'Grief 💙' },
  { mood: 'joy',        label: 'Joy ✨' },
  { mood: 'resistance', label: 'Resistance ✊' },
  { mood: 'love',       label: 'Love 🌹' },
  { mood: 'identity',   label: 'Identity 🌍' },
  { mood: 'hope',       label: 'Hope 🌱' },
]

export default function Sidebar() {
  const pathname          = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Listen for hamburger toggle from Header
  useEffect(() => {
    function onToggle() { setIsOpen(o => !o) }
    window.addEventListener('pt-toggle-sidebar', onToggle)
    return () => window.removeEventListener('pt-toggle-sidebar', onToggle)
  }, [])

  function close() { setIsOpen(false) }

  // Close on route change
  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay${isOpen ? ' active' : ''}`}
        onClick={close}
        aria-hidden
      />

      <nav className={`sidebar${isOpen ? ' open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-section">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`sidebar-item${pathname === item.href ? ' active' : ''}`}
              onClick={close}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="sidebar-section">
          <span className="sidebar-section-title">Browse by Mood</span>
          {MOODS.map(({ mood, label }) => (
            <div key={mood} className={`sidebar-mood-item mood-${mood}`} data-mood={mood}>
              <span className="mood-dot" style={{ background: `var(--mood-color)` }} />
              <span className="sidebar-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-section">
          <Link href="/books"   className={`sidebar-item${pathname === '/books'   ? ' active' : ''}`} onClick={close}>
            <span className="sidebar-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span>
            <span className="sidebar-label">Book Shelf</span>
          </Link>
          <Link href="/profile" className={`sidebar-item${pathname === '/profile' ? ' active' : ''}`} onClick={close}>
            <span className="sidebar-icon"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="sidebar-label">My Profile</span>
          </Link>
          <Link href="/upload"  className={`sidebar-item${pathname === '/upload'  ? ' active' : ''}`} onClick={close}>
            <span className="sidebar-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></span>
            <span className="sidebar-label">Upload Your Work</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
