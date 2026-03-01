import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Playfair_Display, Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'PoetryTube — Where African Voices Live Forever',
    template: '%s | PoetryTube',
  },
  description: 'Africa\'s first dedicated spoken word, slam poetry, and performance art platform. Discover powerful voices, share your art, and connect with a community that celebrates African storytelling.',
  keywords: [
    'African poetry',
    'spoken word',
    'slam poetry',
    'performance art',
    'African voices',
    'storytelling',
    'poetry platform',
    'PoetryTube',
  ],
  authors: [{ name: 'Nanda Regine', url: 'https://creativelynanda.co.za' }],
  creator: 'Nanda Regine',
  publisher: 'Mirembe Muse (Pty) Ltd',
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: '/',
    siteName: 'PoetryTube',
    title: 'PoetryTube — Where African Voices Live Forever',
    description: 'Africa\'s first dedicated spoken word, slam poetry, and performance art platform.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PoetryTube - Where African Voices Live Forever',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PoetryTube — Where African Voices Live Forever',
    description: 'Africa\'s first dedicated platform for spoken word, slam poetry, and performance art.',
    images: ['/og-image.png'],
    creator: '@poetrytube',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-[#0F0A0A] text-poetry-text">
        <div className="min-h-screen flex flex-col">
          <Header />
          
          <div className="flex flex-1 mt-[var(--header-height)]">
            <Sidebar />
            
            <main className="flex-1 ml-0 lg:ml-[var(--sidebar-width)] transition-[margin] duration-300">
              {children}
            </main>
          </div>
          
          <Footer />
        </div>
        
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
