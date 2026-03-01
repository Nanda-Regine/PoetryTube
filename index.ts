// ============================================================
// POETRYTUBE — Global TypeScript Types
// ============================================================

// ── Mood Tags ─────────────────────────────────────────────
export const MOOD_TAGS = [
  'Defiant', 'Tender', 'Grief', 'Joy',
  'Resistance', 'Love', 'Identity', 'Hope',
] as const

export type MoodTag = typeof MOOD_TAGS[number]

export const MOOD_COLORS: Record<string, string> = {
  defiant:    '#E85D26',
  tender:     '#C77AC2',
  grief:      '#5B8FD4',
  joy:        '#E8C84A',
  resistance: '#4CAF72',
  love:       '#D4506A',
  identity:   '#6DB8A0',
  hope:       '#8BC34A',
}

// ── Content Categories ────────────────────────────────────
export const CATEGORIES = [
  'Spoken Word',
  'Slam Poetry',
  'Storytelling',
  'Theatre & Monologue',
  'Music Poetry',
  'Visual Art Performances',
  'New Voices',
  'Featured',
] as const

export type Category = typeof CATEGORIES[number]

// ── Supabase / Database Types ─────────────────────────────

export interface Profile {
  id: string                          // matches auth.users.id
  username: string
  display_name: string | null
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  location: string | null
  website: string | null
  social_links: SocialLinks
  follower_count: number
  following_count: number
  created_at: string
  updated_at: string
}

export interface SocialLinks {
  instagram?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  facebook?: string
  spotify?: string
  soundcloud?: string
  linktree?: string
}

export interface Video {
  id: string
  user_id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  duration_seconds: number | null
  category: Category
  moods: MoodTag[]
  view_count: number
  like_count: number
  comment_count: number
  is_published: boolean
  created_at: string
  updated_at: string
  // Joined from profiles
  profile?: Profile
}

export interface Poem {
  id: string
  user_id: string
  title: string
  content: string                     // The full poem text (markdown supported)
  excerpt: string | null              // First ~100 chars auto-generated
  category: Category
  moods: MoodTag[]
  view_count: number
  like_count: number
  comment_count: number
  is_published: boolean
  created_at: string
  updated_at: string
  // Joined from profiles
  profile?: Profile
}

export interface Like {
  id: string
  user_id: string
  content_id: string
  content_type: 'video' | 'poem'
  created_at: string
}

export interface Comment {
  id: string
  user_id: string
  content_id: string
  content_type: 'video' | 'poem'
  body: string
  created_at: string
  updated_at: string
  // Joined
  profile?: Profile
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

// ── API Response Wrappers ─────────────────────────────────

export interface ApiSuccess<T> {
  data: T
  error: null
}

export interface ApiError {
  data: null
  error: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ── UI / Component Types ──────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}

export type ContentType = 'video' | 'poem'

export interface SearchFilters {
  query?: string
  category?: Category
  moods?: MoodTag[]
  sort_by?: 'recent' | 'popular' | 'views'
}
