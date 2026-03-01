# 🌹 PoetryTube — Where African Voices Live Forever

Africa's first dedicated spoken word, slam poetry, and performance art platform.  
Built with **Next.js 15**, **Supabase**, **Tailwind CSS**, and **OpenAI**.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/poetrytube.git
cd poetrytube
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
# Fill in your Supabase and OpenAI keys in .env.local
```

### 3. Set Up Supabase Database
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy & paste the contents of `supabase/schema.sql` and run it
4. This creates all tables, RLS policies, triggers, and storage buckets

### 4. Configure Supabase Auth
In your Supabase dashboard → **Authentication → URL Configuration**:
- Site URL: `http://localhost:3000` (dev) or your production URL
- Redirect URLs: Add `http://localhost:3000/auth/callback`

### 5. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🏗️ Tech Stack

| Layer         | Tech                                    |
|---------------|-----------------------------------------|
| Framework     | Next.js 15 (App Router)                 |
| Styling       | Tailwind CSS 3                          |
| Database      | Supabase (PostgreSQL)                   |
| Auth          | Supabase Auth                           |
| Storage       | Supabase Storage                        |
| AI            | OpenAI gpt-4o-mini                      |
| Analytics     | Vercel Analytics + Speed Insights       |
| Fonts         | Playfair Display, Cormorant Garamond, DM Sans |
| Deploy        | Vercel                                  |

---

## 🗂️ Project Structure

```
poetrytube/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (header, sidebar, analytics)
│   ├── page.tsx            # Homepage with video/poem feed
│   ├── watch/[id]/         # Video watch page + Write With Me AI
│   ├── poem/[id]/          # Poem reading page with likes & reviews
│   ├── upload/             # Upload video or post poem
│   ├── profile/[username]/ # Poet profile page
│   ├── auth/               # Login, signup, callback
│   └── api/                # Server-side API routes (AI, view counts)
├── components/             # Reusable React components
│   ├── layout/             # Header, Sidebar, Footer
│   ├── video/              # VideoCard, VideoGrid, VideoPlayer
│   ├── poem/               # PoemCard, PoemViewer, CommentSection
│   ├── profile/            # ProfileCard, SocialLinks, FollowButton
│   ├── ai/                 # WriteWithMe, TitleGenerator, MoodAutoTagger
│   └── ui/                 # MoodFilter, MoodPill, LoadingDots, etc.
├── lib/
│   ├── supabase/           # client.ts, server.ts (Supabase helpers)
│   └── utils.ts            # Shared utility functions
├── types/index.ts          # Global TypeScript types
├── styles/globals.css      # Global styles + Tailwind base
├── middleware.ts           # Auth route protection
├── supabase/schema.sql     # Complete database schema (run once)
└── .env.example            # Environment variable template
```

---

## ✨ Features

- **Video Platform** — Upload, stream, and discover African spoken word performances
- **Poem Platform** — Post poems as text with rich formatting (AllPoetry-style but better)
- **AI Write With Me** — AI completes your poem in the African spoken word tradition
- **AI Title Generator** — 5 styled title suggestions for your performance
- **AI Mood Auto-Tagger** — Automatically tags emotional mood from poem content
- **User Profiles** — Showcase videos, poems, social links, follower counts
- **Engagement** — Views, likes, and reviews on all content
- **Mood Filtering** — Filter by: Defiant, Tender, Grief, Joy, Resistance, Love, Identity, Hope
- **Mobile-First** — Fully responsive at 375px with bottom-sheet panels
- **SEO Optimized** — Open Graph, Twitter cards, structured data, sitemap
- **Vercel Analytics** — Page views and performance tracking built in

---

## 🔐 Security

- Row Level Security (RLS) on all Supabase tables
- Server-side auth validation in middleware
- API keys never exposed to client
- OpenAI calls go through Next.js API routes only
- Service role key only used server-side

---

## 🛣️ Roadmap

- [ ] Real-time notifications (Supabase Realtime)
- [ ] Search with full-text indexing
- [ ] Collections / playlists
- [ ] Creator monetisation
- [ ] Mobile app (React Native + Expo)

---

Built by **Nanda Regine** · Creative Technologist & AI Engineer  
[Mirembe Muse (Pty) Ltd](https://creativelynanda.co.za) · East London, South Africa
