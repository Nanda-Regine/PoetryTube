import type { Metadata } from 'next'
import ProfileClient from './ProfileClient'

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your PoetryTube creator profile — upload performances, build your following, and share your African voice.',
  openGraph: {
    title: 'Creator Profile | PoetryTube',
    description: 'Share your African voice on PoetryTube.',
  },
}

export default function ProfilePage() {
  return <ProfileClient />
}
