'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const items = [
    {
      href: '/',
      label: 'Home',
      icon: <svg className="bn-icon" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    {
      href: '#',
      label: 'Discover',
      icon: <svg className="bn-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    },
    {
      href: '/upload',
      label: 'Upload',
      upload: true,
      icon: <svg className="bn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    },
    {
      href: '/books',
      label: 'Books',
      icon: <svg className="bn-icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: <svg className="bn-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
  ]

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <div className="bottom-nav-inner">
        {items.map(item => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={`bottom-nav-item${item.upload ? ' upload-nav-item' : ''}${pathname === item.href ? ' active' : ''}`}
            aria-label={item.label}
          >
            {item.upload
              ? <span className="bn-icon-wrap">{item.icon}</span>
              : item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
