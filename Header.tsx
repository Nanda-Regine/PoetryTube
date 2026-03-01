'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-[var(--header-height)] bg-[rgba(15,10,10,0.95)] backdrop-blur-xl border-b border-poetry-border z-50">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => {
              const sidebar = document.querySelector('[data-sidebar]')
              sidebar?.classList.toggle('sidebar-open')
              document.body.classList.toggle('overflow-hidden')
            }}
            className="lg:hidden flex flex-col gap-1 p-2 rounded hover:bg-bg-hover transition-colors min-w-[44px] min-h-[44px] justify-center items-center"
            aria-label="Toggle menu"
          >
            <span className="w-5 h-0.5 bg-poetry-text rounded transition-transform" />
            <span className="w-5 h-0.5 bg-poetry-text rounded transition-opacity" />
            <span className="w-5 h-0.5 bg-poetry-text rounded transition-transform" />
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl filter drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]">
              🌹
            </span>
            <span className="font-display text-xl md:text-2xl font-black tracking-tight text-gradient-gold">
              PoetryTube
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl hidden md:flex">
          <form onSubmit={handleSearch} className="flex w-full h-9">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spoken word, poets, themes…"
              className="flex-1 bg-bg-card border border-poetry-border-light border-r-0 rounded-l-full px-5 text-sm outline-none focus:border-burgundy-light transition-colors"
              aria-label="Search"
            />
            <button
              type="submit"
              className="w-14 bg-bg-card border border-poetry-border-light rounded-r-full flex items-center justify-center hover:bg-burgundy hover:text-white transition-colors"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Upload button */}
          <Link
            href="/upload"
            className="flex items-center gap-2 px-4 h-9 rounded-full bg-burgundy hover:bg-burgundy-light transition-all text-sm font-medium"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="hidden sm:inline">Upload</span>
          </Link>

          {/* Notifications - hidden on mobile */}
          <button
            className="hidden sm:flex w-11 h-11 rounded-full items-center justify-center hover:bg-bg-hover transition-colors"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* User avatar */}
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-burgundy-mid border-2 border-gold-dim flex items-center justify-center font-display font-bold text-sm text-gold hover:border-gold transition-colors"
          >
            NR
          </Link>
        </div>
      </div>

      {/* Mobile search (below header on small screens) */}
      <div className="md:hidden px-4 py-2 border-t border-poetry-border bg-bg-sidebar">
        <form onSubmit={handleSearch} className="flex w-full h-9">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search…"
            className="flex-1 bg-bg-card border border-poetry-border-light border-r-0 rounded-l-full px-4 text-sm outline-none focus:border-burgundy-light"
          />
          <button
            type="submit"
            className="w-12 bg-bg-card border border-poetry-border-light rounded-r-full flex items-center justify-center hover:bg-burgundy"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>
      </div>
    </header>
  )
}
