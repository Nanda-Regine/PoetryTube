import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'
import { MOOD_COLORS } from '@/types'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format view counts: 12000 → "12K", 1500000 → "1.5M" */
export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toString()
}

/** Format seconds → "4:32" or "1:04:32" */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Relative time: "3 days ago" */
export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

/** Full date: "January 15, 2025" */
export function fullDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMMM d, yyyy')
}

/** Get mood color by name (case-insensitive) */
export function getMoodColor(mood: string): string {
  return MOOD_COLORS[mood.toLowerCase()] ?? '#D4AF37'
}

/** Generate an excerpt from poem text */
export function generateExcerpt(text: string, maxLength = 120): string {
  const stripped = text.replace(/[#*_`>\-]/g, '').replace(/\n+/g, ' ').trim()
  if (stripped.length <= maxLength) return stripped
  return stripped.slice(0, maxLength).replace(/\s+\S*$/, '…')
}

/** Slugify a string for URLs */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/** Build Supabase Storage public URL */
export function getStorageUrl(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/${bucket}/${path}`
}

/** Validate username: 3-30 chars, alphanumeric + underscores */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username)
}
