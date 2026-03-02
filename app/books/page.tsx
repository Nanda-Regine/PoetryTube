import type { Metadata } from 'next'
import BooksClient from './BooksClient'

export const metadata: Metadata = {
  title: 'Book Shelf',
  description: 'Discover and download poetry books, chapbooks, and literary works from African poets on PoetryTube.',
  openGraph: {
    title: 'Book Shelf | PoetryTube',
    description: 'African poetry in print — discover and download literary works.',
  },
}

export default function BooksPage() {
  return <BooksClient />
}
