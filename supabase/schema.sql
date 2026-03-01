-- ============================================================
--  PoetryTube — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username         TEXT UNIQUE NOT NULL,
  display_name     TEXT,
  bio              TEXT,
  avatar_url       TEXT,
  language         TEXT DEFAULT 'en',
  location         TEXT,
  website          TEXT,
  follower_count   INTEGER DEFAULT 0,
  following_count  INTEGER DEFAULT 0,
  video_count      INTEGER DEFAULT 0,
  book_count       INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: public read"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "profiles: own insert"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: own update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── 2. VIDEOS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS videos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  video_url        TEXT,
  thumbnail_url    TEXT,
  moods            TEXT[] DEFAULT '{}',
  language         TEXT DEFAULT 'en',
  duration_seconds INTEGER,
  view_count       INTEGER DEFAULT 0,
  like_count       INTEGER DEFAULT 0,
  is_published     BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "videos: public read published"
  ON videos FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "videos: own insert"
  ON videos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "videos: own update"
  ON videos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "videos: own delete"
  ON videos FOR DELETE
  USING (auth.uid() = user_id);

-- ── 3. BOOKS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  author_name      TEXT,
  cover_url        TEXT,
  file_url         TEXT NOT NULL,
  language         TEXT DEFAULT 'en',
  genre            TEXT,
  download_count   INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "books: public read"
  ON books FOR SELECT USING (true);

CREATE POLICY "books: own insert"
  ON books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "books: own update"
  ON books FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "books: own delete"
  ON books FOR DELETE
  USING (auth.uid() = user_id);

-- ── 4. LIKES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS likes (
  user_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, video_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "likes: public read"
  ON likes FOR SELECT USING (true);

CREATE POLICY "likes: authenticated write"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes: own delete"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- ── 5. FOLLOWS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  follower_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows: public read"
  ON follows FOR SELECT USING (true);

CREATE POLICY "follows: authenticated insert"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "follows: own delete"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ── 6. AUTO-CREATE PROFILE ON SIGNUP ─────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter       INTEGER := 0;
BEGIN
  base_username := lower(replace(
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    ' ', '_'
  ));
  final_username := base_username;

  -- Ensure username uniqueness
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;

  INSERT INTO profiles (id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    final_username
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 7. STORAGE BUCKETS ───────────────────────────────────────
-- Run these in the Supabase Storage dashboard or via API:
--
-- INSERT INTO storage.buckets (id, name, public)
--   VALUES ('avatars', 'avatars', true),
--          ('books',   'books',   true),
--          ('covers',  'covers',  true);

-- ── 8. STORAGE POLICIES ──────────────────────────────────────
-- Allow public read on all buckets (already public=true above)
-- Allow authenticated users to upload to avatars (own folder only)
CREATE POLICY "avatars: own upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "avatars: own update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

-- Allow authenticated users to upload books and covers
CREATE POLICY "books: authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('books', 'covers') AND auth.role() = 'authenticated');

CREATE POLICY "books: own delete"
  ON storage.objects FOR DELETE
  USING (bucket_id IN ('books', 'covers') AND auth.uid()::TEXT = (storage.foldername(name))[1]);
