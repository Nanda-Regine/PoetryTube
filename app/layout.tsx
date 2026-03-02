import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import Header    from '@/components/Header'
import Sidebar   from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'
import AuthModal from '@/components/AuthModal'
import Footer    from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://poetrytube.vercel.app'),
  title: {
    default:  'PoetryTube — Where African Voices Live Forever',
    template: '%s | PoetryTube',
  },
  description:
    "Africa's first dedicated spoken word, slam poetry, and performance art video platform. Discover and share authentic African voices.",
  keywords: [
    'spoken word', 'slam poetry', 'African poetry', 'performance art',
    'African voices', 'PoetryTube', 'poetry platform', 'poetry Africa',
    'Swahili poetry', 'Zulu poetry', 'Yoruba poetry', 'Amharic poetry',
  ],
  authors: [{ name: 'Nandawula Kabali-Kagwa', url: 'https://creativelynanda.co.za' }],
  creator: 'Nandawula Kabali-Kagwa',
  openGraph: {
    type:        'website',
    locale:      'en_ZA',
    url:         'https://poetrytube.vercel.app',
    siteName:    'PoetryTube',
    title:       'PoetryTube — Where African Voices Live Forever',
    description: "Africa's first dedicated spoken word, slam poetry, and performance art video platform.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PoetryTube' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'PoetryTube — Where African Voices Live Forever',
    description: "Africa's first dedicated spoken word, slam poetry, and performance art video platform.",
    images:      ['/og-image.png'],
    creator:     '@poetrytube',
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export const viewport: Viewport = {
  themeColor:          '#4A0E2A',
  width:               'device-width',
  initialScale:        1,
  viewportFit:         'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Sidebar />

        <div className="main-content">
          <main className="content-area" id="main">
            {children}
          </main>
        </div>

        <Footer />
        <BottomNav />
        <AuthModal />
        <Analytics />
      </body>
    </html>
  )
}
