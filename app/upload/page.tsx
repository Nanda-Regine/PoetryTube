import type { Metadata } from 'next'
import UploadClient from './UploadClient'

export const metadata: Metadata = {
  title: 'Upload Your Work',
  description: 'Share your spoken word, slam poetry, or performance art on PoetryTube. AI-powered title generation and mood tagging.',
  openGraph: {
    title: 'Upload Your Work | PoetryTube',
    description: 'Share your authentic African voice with the world.',
  },
}

export default function UploadPage() {
  return <UploadClient />
}
