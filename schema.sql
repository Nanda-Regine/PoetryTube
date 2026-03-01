-- ============================================================
-- POETRYTUBE — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROFILES ─────────────────────────────────────────────────
-- Extends Supabase Auth users with public profile data
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username       TEXT UNIQUE NOT NULL,
  display_name   TEXT,
  avatar_url     TEXT,
  banner_url     TEXT,
  bio            TEXT,
  location       TEXT,
  website        TEXT,
  social_links   JSONB NOT NULL DEFAULT '{}',
  follower_count INT NOT NULL DEFAULT 0,
  following_count INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$')
);

-- ── VIDEOS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.videos (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  video_url        TEXT NOT NULL,
  thumbnail_url    TEXT,
  duration_seconds INT,
  category         TEXT NOT NULL DEFAULT 'Spoken Word',
  moods            TEXT[] NOT NULL DEFAULT '{}',
  view_count       INT NOT NULL DEFAULT 0,
  like_count       INT NOT NULL DEFAULT 0,
  comment_count    INT NOT NULL DEFAULT 0,
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── POEMS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.poems (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  excerpt       TEXT,
  category      TEXT NOT NULL DEFAULT 'Spoken Word',
  moods         TEXT[] NOT NULL DEFAULT '{}',
  view_count    INT NOT NULL DEFAULT 0,
  like_count    INT NOT NULL DEFAULT 0,
  comment_count INT NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── LIKES ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.likes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id   UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'poem')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, content_id, content_type)
);

-- ── COMMENTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id   UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'poem')),
  body         TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── FOLLOWS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.follows (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES — for fast queries
-- ═══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_videos_moods ON public.videos USING GIN(moods);
CREATE INDEX IF NOT EXISTS idx_videos_view_count ON public.videos(view_count DESC);

CREATE INDEX IF NOT EXISTS idx_poems_user_id ON public.poems(user_id);
CREATE INDEX IF NOT EXISTS idx_poems_published ON public.poems(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poems_category ON public.poems(category) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_poems_moods ON public.poems USING GIN(moods);

CREATE INDEX IF NOT EXISTS idx_likes_content ON public.likes(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_content ON public.comments(content_id, content_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_poems_updated_at
  BEFORE UPDATE ON public.poems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
BEGIN
  -- Build a base username from email prefix
  base_username := regexp_replace(
    split_part(NEW.email, '@', 1),
    '[^a-zA-Z0-9_]', '_', 'g'
  );
  base_username := substr(base_username, 1, 25);
  IF length(base_username) < 3 THEN
    base_username := 'poet_' || base_username;
  END IF;

  final_username := base_username;

  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Increment view count atomically
CREATE OR REPLACE FUNCTION increment_view_count(
  p_content_id UUID,
  p_content_type TEXT
) RETURNS VOID AS $$
BEGIN
  IF p_content_type = 'video' THEN
    UPDATE public.videos SET view_count = view_count + 1 WHERE id = p_content_id;
  ELSIF p_content_type = 'poem' THEN
    UPDATE public.poems SET view_count = view_count + 1 WHERE id = p_content_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sync like_count on likes table changes
CREATE OR REPLACE FUNCTION sync_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.content_type = 'video' THEN
      UPDATE public.videos SET like_count = like_count + 1 WHERE id = NEW.content_id;
    ELSIF NEW.content_type = 'poem' THEN
      UPDATE public.poems SET like_count = like_count + 1 WHERE id = NEW.content_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.content_type = 'video' THEN
      UPDATE public.videos SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.content_id;
    ELSIF OLD.content_type = 'poem' THEN
      UPDATE public.poems SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.content_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_likes_sync
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION sync_like_count();

-- Sync comment_count
CREATE OR REPLACE FUNCTION sync_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.content_type = 'video' THEN
      UPDATE public.videos SET comment_count = comment_count + 1 WHERE id = NEW.content_id;
    ELSIF NEW.content_type = 'poem' THEN
      UPDATE public.poems SET comment_count = comment_count + 1 WHERE id = NEW.content_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.content_type = 'video' THEN
      UPDATE public.videos SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.content_id;
    ELSIF OLD.content_type = 'poem' THEN
      UPDATE public.poems SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.content_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_comments_sync
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION sync_comment_count();

-- Sync follower/following counts
CREATE OR REPLACE FUNCTION sync_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE public.profiles SET follower_count  = follower_count  + 1 WHERE id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
    UPDATE public.profiles SET follower_count  = GREATEST(follower_count  - 1, 0) WHERE id = OLD.following_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_follows_sync
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION sync_follow_counts();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows   ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- VIDEOS
CREATE POLICY "Published videos are viewable by everyone"
  ON public.videos FOR SELECT
  USING (is_published = TRUE OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert videos"
  ON public.videos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos"
  ON public.videos FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos"
  ON public.videos FOR DELETE USING (auth.uid() = user_id);

-- POEMS
CREATE POLICY "Published poems are viewable by everyone"
  ON public.poems FOR SELECT
  USING (is_published = TRUE OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert poems"
  ON public.poems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own poems"
  ON public.poems FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own poems"
  ON public.poems FOR DELETE USING (auth.uid() = user_id);

-- LIKES
CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like"
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- COMMENTS
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- FOLLOWS
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT USING (true);

CREATE POLICY "Authenticated users can follow"
  ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- Run these in the Supabase Storage section or SQL editor
-- ═══════════════════════════════════════════════════════════════

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('videos',     'videos',     true, 4294967296, ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/ogg']),
  ('thumbnails', 'thumbnails', true, 10485760,   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('avatars',    'avatars',    true, 5242880,    ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('banners',    'banners',    true, 10485760,   ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read on videos"
  ON storage.objects FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Auth users can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Same pattern for thumbnails, avatars, banners
CREATE POLICY "Public read thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
CREATE POLICY "Auth upload thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
CREATE POLICY "Own delete thumbnails" ON storage.objects FOR DELETE USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Own delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Auth upload banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');
CREATE POLICY "Own delete banners" ON storage.objects FOR DELETE USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
