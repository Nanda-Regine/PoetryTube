'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // Success - show message
      alert('Check your email to confirm your account!')
      router.push('/auth/login')
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-poetry-muted mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full bg-bg border border-poetry-border-light rounded-lg px-4 py-2.5 text-poetry-text outline-none focus:border-burgundy-light transition-colors"
          placeholder="Amara Kenyatta"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-poetry-muted mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-bg border border-poetry-border-light rounded-lg px-4 py-2.5 text-poetry-text outline-none focus:border-burgundy-light transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-poetry-muted mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full bg-bg border border-poetry-border-light rounded-lg px-4 py-2.5 text-poetry-text outline-none focus:border-burgundy-light transition-colors"
          placeholder="••••••••"
        />
        <p className="text-xs text-poetry-dim mt-1">At least 8 characters</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-poetry-muted mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full bg-bg border border-poetry-border-light rounded-lg px-4 py-2.5 text-poetry-text outline-none focus:border-burgundy-light transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-gold-dim to-gold hover:from-gold hover:to-gold-light text-bg font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="loading-dot !bg-bg" />
            <span className="loading-dot !bg-bg" />
            <span className="loading-dot !bg-bg" />
          </span>
        ) : (
          'Create Account'
        )}
      </button>

      <p className="text-xs text-center text-poetry-dim">
        By signing up, you agree to our{' '}
        <a href="/terms" className="text-gold hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-gold hover:underline">
          Privacy Policy
        </a>
      </p>
    </form>
  )
}
