import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-poetry-border bg-bg-sidebar ml-0 lg:ml-[var(--sidebar-width)] transition-[margin] duration-300">
      <div className="max-w-[1600px] mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌹</span>
              <span className="font-display text-xl font-black text-gradient-gold">
                PoetryTube
              </span>
            </div>
            <p className="font-serif italic text-poetry-muted text-sm leading-relaxed">
              Where African Voices Live Forever
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-poetry-text mb-3 text-sm uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-poetry-muted hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-poetry-muted hover:text-gold transition-colors">
                  Upload
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-poetry-muted hover:text-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-poetry-muted hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-poetry-text mb-3 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-poetry-muted hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-poetry-muted hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-poetry-muted hover:text-gold transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-poetry-border text-center">
          <p className="text-poetry-dim text-sm leading-relaxed">
            © {currentYear} PoetryTube. Built by{' '}
            <a
              href="https://creativelynanda.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors"
            >
              Nanda Regine
            </a>
            {' '}· Creative Technologist & AI Engineer
          </p>
          <p className="text-poetry-dim text-xs mt-2">
            <a
              href="https://creativelynanda.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Mirembe Muse (Pty) Ltd
            </a>
            {' '}· East London, South Africa
          </p>
        </div>
      </div>
    </footer>
  )
}
