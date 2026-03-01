# PoetryTube — Batch 3: Authentication, Video Features & AI

This batch adds user authentication, video watch pages with AI features, upload functionality, and user profiles.

## 📦 What's Included in Batch 3

### Authentication Pages
- **app/auth/login/page.tsx** — Login page with email/password
- **app/auth/signup/page.tsx** — User registration page
- **app/auth/callback/route.ts** — OAuth callback handler

### Video Pages
- **app/watch/[id]/page.tsx** — Video watch page with AI panel
- **app/upload/page.tsx** — Upload page with AI features
- **app/profile/[username]/page.tsx** — User profile page

### AI API Routes
- **app/api/ai/complete-poem/route.ts** — AI poem completion API
- **app/api/ai/generate-titles/route.ts** — AI title generation API
- **app/api/ai/tag-moods/route.ts** — AI mood tagging API

### Authentication Components
- **components/auth/LoginForm.tsx** — Login form component
- **components/auth/SignupForm.tsx** — Signup form component

### Video Components
- **components/video/VideoPlayer.tsx** — Video player with controls
- **components/video/VideoInfo.tsx** — Video metadata and engagement

### AI Components
- **components/ai/WriteWithMePanel.tsx** — AI poem completion panel

### Upload Components
- **components/upload/UploadForm.tsx** — Upload form with AI features

### Profile Components
- **components/profile/ProfileHeader.tsx** — User profile header
- **components/profile/ProfileTabs.tsx** — Videos/Poems tabs

### Poem Components
- **components/poem/PoemCard.tsx** — Poem preview card

## 🎯 Key Features Implemented

✅ **User Authentication** — Email/password signup and login via Supabase Auth
✅ **Video Watch Page** — Full-featured video player with metadata
✅ **AI "Write With Me"** — AI poem completion inspired by videos
✅ **Upload System** — Video upload to Supabase Storage
✅ **AI Title Generator** — 5 styled title suggestions for uploads
✅ **AI Mood Auto-Tagger** — Automatic mood detection from poem text
✅ **User Profiles** — Show videos, poems, stats, social links
✅ **Protected Routes** — Auth-required pages (upload, profile edit)
✅ **Engagement Features** — Like, comment, follow buttons (UI ready)

## 📂 File Structure

```
batch3/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts
│   ├── watch/[id]/page.tsx
│   ├── upload/page.tsx
│   ├── profile/[username]/page.tsx
│   └── api/ai/
│       ├── complete-poem/route.ts
│       ├── generate-titles/route.ts
│       └── tag-moods/route.ts
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── video/
│   │   ├── VideoPlayer.tsx
│   │   └── VideoInfo.tsx
│   ├── ai/
│   │   └── WriteWithMePanel.tsx
│   ├── upload/
│   │   └── UploadForm.tsx
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   └── ProfileTabs.tsx
│   └── poem/
│       └── PoemCard.tsx
└── README.md
```

## 🚀 Installation Instructions

1. **Copy all Batch 3 files** to your project:
   ```bash
   cp -r batch3/* /path/to/your/poetrytube/
   ```

2. **Add OpenAI API key** to `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-proj-...
   ```

3. **Configure Supabase Auth** in your Supabase dashboard:
   - Go to Authentication → URL Configuration
   - Add your site URL: `http://localhost:3000` (dev) or production URL
   - Add redirect URL: `http://localhost:3000/auth/callback`

4. **Verify Supabase Storage** buckets exist:
   - videos
   - thumbnails
   - avatars
   - banners
   
   (These should have been created in Batch 1 via schema.sql)

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## ✨ What Works Now

### Authentication Flow
1. User signs up at `/auth/signup`
2. Receives email confirmation
3. Confirms email and gets redirected
4. Auto-creates profile in `profiles` table
5. Can log in at `/auth/login`

### Video Upload Flow
1. User goes to `/upload` (protected route)
2. Selects video file
3. Fills in title, description, category
4. Uses AI to:
   - Generate 5 title suggestions
   - Auto-tag mood from poem text
5. Uploads video to Supabase Storage
6. Creates video record in database
7. Redirects to user profile

### Video Watch Flow
1. User clicks video card
2. Goes to `/watch/[id]` page
3. Sees video player and metadata
4. Can use "Write With Me" AI panel:
   - Start writing a poem
   - Click "Complete My Poem with AI"
   - Get AI continuation in African spoken word tradition
   - Copy or share to WhatsApp

### Profile Pages
1. Visit `/profile/[username]`
2. See profile header with avatar, bio, social links
3. Browse user's videos and poems in tabs
4. Follow/unfollow user (UI ready)
5. Edit own profile (if logged in)

## 🔧 API Endpoints

### POST /api/ai/complete-poem
Complete a poem using AI.

**Request:**
```json
{
  "poemStart": "I come from a land where..."
}
```

**Response:**
```json
{
  "continuation": "the soil remembers each name spoken\nthe wind carries stories unbroken..."
}
```

### POST /api/ai/generate-titles
Generate 5 title suggestions.

**Request:**
```json
{
  "description": "A poem about identity and resistance..."
}
```

**Response:**
```json
{
  "titles": [
    "Roots of Rebellion",
    "Whispers in the Wind",
    "My Mother's Hands",
    "The Weight We Carry",
    "Unbroken"
  ]
}
```

### POST /api/ai/tag-moods
Auto-tag moods from content.

**Request:**
```json
{
  "description": "A tender reflection on love and loss..."
}
```

**Response:**
```json
{
  "moods": ["Tender", "Grief", "Love"]
}
```

## 🎨 Design Features

### Video Watch Page
- **Responsive Layout** — 2-column desktop, stacked mobile
- **Sticky AI Panel** — Stays in view while scrolling
- **Mobile Bottom Sheet** — AI panel slides up on mobile
- **Engagement Buttons** — Like, comment, share, save
- **Mood Pills** — Clickable mood tags for filtering

### Upload Page
- **Drag & Drop** — Visual file upload area
- **AI Integration** — Two AI feature cards with loading states
- **Title Chips** — Clickable suggestions with style labels
- **Mood Pills** — Toggle selection with colors
- **Form Validation** — Required fields and file size checks

### Profile Page
- **Banner Image** — Hero banner with overlay
- **Avatar** — Circular profile image or initials
- **Social Links** — Clickable social media buttons
- **Tabs** — Switch between videos and poems
- **Empty States** — Helpful messages for new users

## 🔐 Security Features

✅ **Row Level Security** — All Supabase queries respect RLS policies
✅ **Protected Routes** — Middleware redirects unauthorized users
✅ **Server-side Auth** — User verification in API routes
✅ **Input Validation** — Length limits and type checking
✅ **Storage Policies** — Only owners can upload/delete their content

## 🐛 Known Limitations

- **Video Player** — Currently a placeholder. Integrate with your video hosting service (Mux, Cloudflare Stream, etc.)
- **Engagement Actions** — Like, comment, follow buttons have UI but need backend implementation
- **Real-time Updates** — View counts, likes don't update in real-time yet
- **Profile Edit** — Edit profile page not yet implemented
- **Password Reset** — Reset password flow not included

## 📝 Next Steps (Future Batches)

- Profile edit page
- Password reset flow
- Comments system with replies
- Real-time notifications
- Video recommendations algorithm
- Search functionality
- Poem creation/editing pages
- Collections/playlists
- Email templates
- Analytics dashboard

## 🆘 Troubleshooting

### "Unauthorized" errors in AI API routes
Make sure you're logged in. AI features require authentication.

### Video upload fails
1. Check Supabase Storage bucket exists: `videos`
2. Verify storage policies allow authenticated uploads
3. Check file size (max 4GB)
4. Verify file type is video/*

### AI features not working
1. Verify `OPENAI_API_KEY` is set in `.env.local`
2. Check OpenAI account has credits
3. Look for errors in browser console and server logs

### Auth redirect loops
1. Check middleware.ts is configured correctly
2. Verify Supabase Auth URLs in dashboard match your site
3. Clear browser cookies and try again

### Profile page 404
1. Make sure you're using a valid username
2. Check that profiles table has the user record
3. Verify RLS policies allow reading profiles

## ✅ Testing Checklist

Before deploying, test:
- [ ] Sign up new user → receives email
- [ ] Confirm email → redirects to login
- [ ] Login → redirects to homepage
- [ ] Visit /upload → can upload video
- [ ] Use AI title generator → gets 5 suggestions
- [ ] Use AI mood tagger → tags are selected
- [ ] Upload video → appears on profile
- [ ] Visit /watch/[id] → video plays
- [ ] Use Write With Me → AI completes poem
- [ ] Visit profile → shows videos and stats
- [ ] Social links → open in new tab
- [ ] Mood pills → filter videos

## 🚀 Ready for Production?

Before deploying:
1. Add real video hosting (Mux, Cloudflare Stream, etc.)
2. Implement engagement backend (likes, comments, follows)
3. Add email verification flow
4. Set up password reset
5. Configure production Supabase Auth URLs
6. Test with real users
7. Add monitoring (Sentry, LogRocket)
8. Set up CI/CD pipeline

---

**Need Batch 4?** 
Let me know when you're ready for:
- Comments & Reviews system
- Search functionality
- Poem creation pages
- Email notifications
- Admin dashboard

Just say "**build batch 4**" when ready! 🌹
