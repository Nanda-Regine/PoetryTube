'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { LANGUAGES, LANGUAGE_LABELS, type Language } from '@/lib/language'
import { getSupabaseBrowser } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'

function getInitials(nameOrEmail: string): string {
  const parts = nameOrEmail.split(/[\s@]+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return nameOrEmail.slice(0, 2).toUpperCase()
}

export default function Header() {
  const [lang, setLang]     = useState<Language>('en')
  const [open, setOpen]     = useState(false)
  const [user, setUser]     = useState<User | null>(null)
  const selectorRef         = useRef<HTMLDivElement>(null)
  const supabase            = getSupabaseBrowser()

  // Restore language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pt-lang') as Language | null
    if (saved && LANGUAGE_LABELS[saved]) setLang(saved)
  }, [])

  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  function changeLang(code: Language) {
    setLang(code)
    setOpen(false)
    localStorage.setItem('pt-lang', code)
    // Persist to Supabase if signed in
    if (user) {
      supabase.from('profiles').update({ language: code }).eq('id', user.id).then(() => {})
    }
    // Broadcast so other components can react
    window.dispatchEvent(new CustomEvent('pt-lang-change', { detail: code }))
  }

  function openAuth() {
    window.dispatchEvent(new CustomEvent('pt-open-auth'))
  }

  function toggleSidebar() {
    window.dispatchEvent(new CustomEvent('pt-toggle-sidebar'))
  }

  const currentLang = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0]

  return (
    <header className="site-header">
      <div className="header-left">
        <button className="hamburger-btn" aria-label="Toggle sidebar" onClick={toggleSidebar}>
          <span /><span /><span />
        </button>
        <Link href="/" className="logo-link">
          <span className="logo-icon">🌹</span>
          <span className="logo-text">PoetryTube</span>
        </Link>
      </div>

      <div className="header-center">
        <form className="search-form" role="search" onSubmit={e => e.preventDefault()}>
          <input
            type="search"
            className="search-input"
            placeholder="Search spoken word, poets, themes…"
            aria-label="Search"
          />
          <button className="search-btn" aria-label="Submit search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </form>
      </div>

      <div className="header-right">
        {/* Language selector */}
        <div
          className={`header-lang-selector${open ? ' open' : ''}`}
          ref={selectorRef}
        >
          <button
            className="header-lang-btn"
            aria-label="Select language"
            onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
          >
            <span className="lang-flag">{currentLang.flag}</span>
            <span className="lang-name" id="header-lang-name">{currentLang.label}</span>
            <svg className="lang-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <ul className="header-lang-dropdown" role="listbox">
            {LANGUAGES.map(l => (
              <li key={l.code}>
                <button
                  className={`header-lang-option${lang === l.code ? ' active' : ''}`}
                  role="option"
                  aria-selected={lang === l.code}
                  onClick={() => changeLang(l.code)}
                >
                  <span className="opt-flag">{l.flag}</span> {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Notifications */}
        <button className="header-action-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>

        {/* Upload */}
        <Link href="/upload" className="header-action-btn upload-btn" aria-label="Upload poem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span className="btn-label">Upload</span>
        </Link>

        {/* Avatar / sign in */}
        <div
          className="avatar-btn"
          role="button"
          tabIndex={0}
          aria-label={user ? 'Profile' : 'Sign in'}
          onClick={user ? () => window.location.href = '/profile' : openAuth}
          onKeyDown={e => e.key === 'Enter' && (user ? window.location.href = '/profile' : openAuth())}
          title={user?.user_metadata?.display_name ?? user?.email ?? 'Sign in'}
        >
          {user
            ? getInitials(user.user_metadata?.display_name ?? user.email ?? '?')
            : '?'}
        </div>
      </div>
    </header>
  )
}
