'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { MOOD_COLORS } from '@/types'

const navItems = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'featured', label: 'Featured', href: '/?category=featured' },
  { icon: 'spokenword', label: 'Spoken Word', href: '/?category=spoken-word' },
  { icon: 'slam', label: 'Slam Poetry', href: '/?category=slam-poetry' },
  { icon: 'storytelling', label: 'Storytelling', href: '/?category=storytelling' },
  { icon: 'theatre', label: 'Theatre & Monologue', href: '/?category=theatre' },
  { icon: 'music', label: 'Music Poetry', href: '/?category=music-poetry' },
  { icon: 'visual', label: 'Visual Art', href: '/?category=visual-art' },
  { icon: 'new', label: 'New Voices', href: '/?category=new-voices' },
]

const moodItems = [
  { mood: 'defiant', label: 'Defiant', emoji: '🔥', color: MOOD_COLORS.defiant },
  { mood: 'tender', label: 'Tender', emoji: '🌸', color: MOOD_COLORS.tender },
  { mood: 'grief', label: 'Grief', emoji: '💙', color: MOOD_COLORS.grief },
  { mood: 'joy', label: 'Joy', emoji: '✨', color: MOOD_COLORS.joy },
  { mood: 'resistance', label: 'Resistance', emoji: '✊', color: MOOD_COLORS.resistance },
  { mood: 'love', label: 'Love', emoji: '🌹', color: MOOD_COLORS.love },
  { mood: 'identity', label: 'Identity', emoji: '🌍', color: MOOD_COLORS.identity },
  { mood: 'hope', label: 'Hope', emoji: '🌱', color: MOOD_COLORS.hope },
]

export default function Sidebar() {
  const pathname = usePathname()

  const handleNavClick = () => {
    // Close sidebar on mobile when nav item clicked
    if (window.innerWidth < 1024) {
      const sidebar = document.querySelector('[data-sidebar]')
      sidebar?.classList.remove('sidebar-open')
      document.body.classList.remove('overflow-hidden')
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden sidebar-overlay"
        onClick={() => {
          const sidebar = document.querySelector('[data-sidebar]')
          sidebar?.classList.remove('sidebar-open')
          document.body.classList.remove('overflow-hidden')
        }}
      />

      {/* Sidebar */}
      <aside
        data-sidebar
        className="fixed top-0 lg:top-[var(--header-height)] left-0 w-[280px] lg:w-[var(--sidebar-width)] h-screen lg:h-[calc(100vh-var(--header-height))] bg-bg-sidebar border-r border-poetry-border overflow-y-auto z-50 lg:z-30 -translate-x-full lg:translate-x-0 transition-transform duration-300"
      >
        {/* Logo for mobile (when sidebar is open) */}
        <div className="lg:hidden flex items-center gap-2 p-4 border-b border-poetry-border">
          <span className="text-2xl">🌹</span>
          <span className="font-display text-xl font-black text-gradient-gold">
            PoetryTube
          </span>
        </div>

        {/* Main Navigation */}
        <nav className="py-2 border-b border-poetry-border">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-4 px-5 py-2.5 transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-burgundy/50 text-gold border-r-2 border-gold'
                    : 'text-poetry-muted hover:bg-bg-hover hover:text-poetry-text'
                }`}
              >
                <NavIcon icon={item.icon} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Mood Categories */}
        <div className="py-4 border-b border-poetry-border">
          <h3 className="px-5 text-xs font-semibold uppercase tracking-wider text-poetry-dim mb-3">
            Browse by Mood
          </h3>
          {moodItems.map((item) => (
            <Link
              key={item.mood}
              href={`/?mood=${item.mood}`}
              onClick={handleNavClick}
              className="flex items-center gap-3 px-5 py-2 text-poetry-muted hover:text-poetry-text transition-colors min-h-[36px]"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm flex-1">
                {item.label} {item.emoji}
              </span>
            </Link>
          ))}
        </div>

        {/* Upload CTA */}
        <div className="p-4">
          <Link
            href="/upload"
            onClick={handleNavClick}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-burgundy hover:bg-burgundy-light rounded-lg transition-colors font-medium text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Upload Your Work
          </Link>
        </div>
      </aside>

      <style jsx global>{`
        .sidebar-overlay {
          display: none;
        }
        .sidebar-open ~ .sidebar-overlay,
        [data-sidebar].sidebar-open ~ .sidebar-overlay {
          display: block;
        }
        [data-sidebar].sidebar-open {
          transform: translateX(0);
        }
      `}</style>
    </>
  )
}

// Icon component for navigation items
function NavIcon({ icon }: { icon: string }) {
  const icons: Record<string, JSX.Element> = {
    home: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    featured: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
    spokenword: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    slam: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    storytelling: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    theatre: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <polyline points="8 21 12 17 16 21" />
      </svg>
    ),
    music: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    visual: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    new: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  }
  
  return icons[icon] || icons.home
}
