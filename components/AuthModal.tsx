'use client'

import { useEffect, useRef, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-client'

type Tab = 'signin' | 'signup'

export default function AuthModal() {
  const [open, setOpen]     = useState(false)
  const [tab, setTab]       = useState<Tab>('signin')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseBrowser()

  // Sign-in fields
  const siEmailRef = useRef<HTMLInputElement>(null)
  const siPassRef  = useRef<HTMLInputElement>(null)

  // Sign-up fields
  const suNameRef  = useRef<HTMLInputElement>(null)
  const suEmailRef = useRef<HTMLInputElement>(null)
  const suPassRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onOpen() { setOpen(true); setError(''); setTab('signin') }
    window.addEventListener('pt-open-auth', onOpen)
    return () => window.removeEventListener('pt-open-auth', onOpen)
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  async function handleSignIn() {
    const email    = siEmailRef.current?.value.trim() ?? ''
    const password = siPassRef.current?.value ?? ''
    if (!email || !password) return

    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setOpen(false)
  }

  async function handleSignUp() {
    const displayName = suNameRef.current?.value.trim() ?? ''
    const email       = suEmailRef.current?.value.trim() ?? ''
    const password    = suPassRef.current?.value ?? ''
    if (!email || !password) return

    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setError('')
    setTab('signin')
  }

  if (!open) return null

  return (
    <div className="auth-modal open" role="dialog" aria-modal="true" aria-label="Sign in to PoetryTube">
      <div className="auth-backdrop" onClick={() => setOpen(false)} />
      <div className="auth-card">
        <button className="auth-close" aria-label="Close" onClick={() => setOpen(false)}>&times;</button>

        <div className="auth-header">
          <span className="auth-logo-icon">🌹</span>
          <h2 className="auth-title">Welcome to PoetryTube</h2>
          <p className="auth-subtitle">Where African Voices Live Forever</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'signin' ? ' active' : ''}`} onClick={() => { setTab('signin'); setError('') }}>Sign In</button>
          <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => { setTab('signup'); setError('') }}>Create Account</button>
        </div>

        {tab === 'signin' && (
          <div className="auth-form-panel active">
            <input ref={siEmailRef} className="auth-input" type="email" placeholder="Email address" required autoComplete="email" />
            <input ref={siPassRef}  className="auth-input" type="password" placeholder="Password" required autoComplete="current-password" />
            <button className="auth-submit-btn" disabled={loading} onClick={handleSignIn}>
              {loading ? <><span className="loading-dots"><span/><span/><span/></span> Signing in…</> : 'Sign In'}
            </button>
            {error && <p className="auth-error">{error}</p>}
          </div>
        )}

        {tab === 'signup' && (
          <div className="auth-form-panel active">
            <input ref={suNameRef}  className="auth-input" type="text"     placeholder="Your name or stage name" autoComplete="name" />
            <input ref={suEmailRef} className="auth-input" type="email"    placeholder="Email address" required autoComplete="email" />
            <input ref={suPassRef}  className="auth-input" type="password" placeholder="Password (min 6 characters)" required minLength={6} autoComplete="new-password" />
            <button className="auth-submit-btn" disabled={loading} onClick={handleSignUp}>
              {loading ? <><span className="loading-dots"><span/><span/><span/></span> Creating…</> : 'Create Account'}
            </button>
            {error && <p className="auth-error">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
