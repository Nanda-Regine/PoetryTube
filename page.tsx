import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your PoetryTube account',
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string }
}) {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-3">
            Welcome Back
          </h1>
          <p className="font-serif italic text-poetry-muted">
            Sign in to share your voice with the world
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-bg-card border border-poetry-border rounded-2xl p-8">
          <LoginForm redirectTo={searchParams.redirectTo} />
        </div>

        {/* Sign up link */}
        <p className="text-center mt-6 text-sm text-poetry-muted">
          Don't have an account?{' '}
          <a
            href="/auth/signup"
            className="text-gold hover:text-gold-light font-medium transition-colors"
          >
            Sign up for free
          </a>
        </p>
      </div>
    </div>
  )
}
