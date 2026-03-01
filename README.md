# 🌹 PoetryTube — Where African Voices Live Forever

Africa's first dedicated spoken word, slam poetry, and performance art video platform. PoetryTube is not a rebrand — it's a real product built for a real market: the millions of African poets, griots, and storytellers whose voices deserve a permanent home.

Built by **Nanda Regine** — Creative Technologist & AI Engineer @ [Mirembe Muse (Pty) Ltd](https://creativelynanda.co.za)

---

## 🎯 Mission

> *"Where African Voices Live Forever"*

PoetryTube exists to preserve, celebrate, and amplify African spoken word, slam poetry, storytelling, theatre, and performance art — content that is underserved by mainstream video platforms.

---

## ✨ AI Features

All AI features use **OpenAI gpt-4o-mini** for fast, low-cost inference.

### 1. Write With Me 🌹 (Watch Page)
The signature feature. On any video watch page, a sidebar panel invites viewers to be inspired by the performance they just watched.

- **How it works:** User enters the opening lines of a poem they feel inspired to write. On click, the app sends their text to the OpenAI API with a system prompt instructing it to respond as a poet in the African spoken word tradition — completing the poem in 4–6 powerful lines.
- **Output:** Displayed in a styled box with a gold border, in italic serif type
- **Actions:** Copy to clipboard + Share on WhatsApp (deep link with pre-filled text)
- **Mobile:** Fullscreen bottom sheet triggered by a floating 🌹 button

**System prompt:**
```
You are a poet who writes in the African spoken word tradition. Complete the following poem opening in 4-6 lines that honor the emotional tone and imagery the writer has begun. Write only the poem continuation — no explanation, no preamble. Make it powerful.
```

### 2. Title Generator ✨ (Upload / Creator Page)
When a creator is uploading their performance, they can paste their poem and get 5 title suggestions — each in a different style.

- **How it works:** Creator pastes their poem or description. On click, the API returns 5 titles: provocative, poetic, intimate, philosophical, and punchy.
- **Output:** Displayed as clickable chips — clicking any chip populates the title input field

**System prompt:**
```
Generate 5 compelling titles for a spoken word performance based on the content provided. Each title must be different in style: 1. Provocative and political, 2. Poetic and abstract, 3. Deeply personal and intimate, 4. Universal and philosophical, 5. Short and punchy (under 4 words). Return ONLY a numbered list of titles. No explanations.
```

### 3. Mood Auto-Tagger 🏷️ (Upload / Creator Page)
Automatically reads a poem or description and selects the most accurate mood tags from PoetryTube's fixed vocabulary.

- **How it works:** Creator clicks "Auto-Tag Mood". The API returns a JSON array of 1–3 moods from: `['Defiant', 'Tender', 'Grief', 'Joy', 'Resistance', 'Love', 'Identity', 'Hope']`
- **Output:** Matching mood chips are auto-selected in the UI. Creators can also adjust manually.

**System prompt:**
```
You are a poetry curator. Read the following poem or description and return ONLY a JSON array of 1-3 mood tags from this exact list: ['Defiant', 'Tender', 'Grief', 'Joy', 'Resistance', 'Love', 'Identity', 'Hope']. Return ONLY the JSON array. Nothing else.
```

---

## 🗂️ Project Structure

```
poetrytube/
├── index.html           — Homepage: video grid, mood filter bar, sidebar
├── watch.html           — Watch page: video player + Write With Me panel
├── upload.html          — Creator page: upload form + AI title gen + mood tagger
├── styles/
│   ├── general.css      — CSS variables, resets, base styles, utilities
│   ├── header.css       — Top navigation header
│   ├── sidebar.css      — Sidebar + mobile drawer
│   ├── video.css        — Video cards, mood pills, grid, mood filter bar
│   ├── watch.css        — Watch page layout + Write With Me panel styles
│   └── upload.css       — Creator page form styles + AI feature cards
├── scripts/
│   └── app.js           — All JavaScript: UI interactions + AI API calls
├── api/
│   └── ai.js            — Vercel serverless proxy for OpenAI (key stays server-side)
├── public/              — Static assets: favicon, og-image, etc.
├── .env.example         — Environment variable reference
└── README.md            — This file
```

---

## 🔧 Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Markup      | HTML5 (semantic)              |
| Styling     | CSS3 (custom properties, Grid, Flexbox) |
| Interactivity | Vanilla JavaScript (ES2020+) |
| AI          | OpenAI API — gpt-4o-mini      |
| Fonts       | Playfair Display, Cormorant Garamond, DM Sans (Google Fonts) |
| Deploy      | Vercel                        |

---

## 🚀 Setup

```bash
# 1. Clone the repo
git clone https://github.com/Nanda-Regine/PoetryTube.git
cd PoetryTube

# 2. Add your OpenAI API key
cp .env.example .env.local
# Edit .env.local and set: OPENAI_API_KEY=sk-...

# 3. Deploy to Vercel (AI features require the serverless proxy)
vercel dev        # local dev with serverless functions
vercel --prod     # production deploy
```

> **AI features require Vercel** (or another serverless host) because `api/ai.js` runs server-side to keep your OpenAI key out of the browser. Set `OPENAI_API_KEY` in Vercel → Project Settings → Environment Variables.

---

## 📋 Features

- ✅ African-identity brand — deep burgundy, gold, near-black palette
- ✅ 9 navigation categories for African poetry/performance content
- ✅ Mood filter bar — filter videos by: Defiant, Tender, Grief, Joy, Resistance, Love, Identity, Hope
- ✅ 9 seed video cards with mood pills and CSS gradient thumbnails
- ✅ AI Feature 1: Write With Me — poem completion in African spoken word tradition
- ✅ AI Feature 2: Title Generator — 5 styled title ideas as clickable chips
- ✅ AI Feature 3: Mood Auto-Tagger — JSON-parsed mood tags from fixed vocabulary
- ✅ Mobile-responsive at 375px — hamburger nav, single-column grid, bottom-sheet panel
- ✅ Minimum 44px tap targets throughout
- ✅ CSS-only thumbnail gradients — no image dependencies
- ✅ Like button, follow button, share and save actions
- ✅ WhatsApp deep-link sharing of AI-generated poems

---

## 📖 Case Study

[Read about the build process →](https://creativelynanda.co.za/blog)

---

## 🛣️ Roadmap

- [ ] Backend video upload (Supabase Storage)
- [ ] User authentication (Supabase Auth)
- [ ] Real video playback
- [ ] Search functionality
- [ ] Comments and reactions
- [ ] Creator profiles
- [ ] Next.js migration for SSR + performance

---

## 👩🏾‍💻 Built By

**Nanda Regine** — Creative Technologist & AI Engineer  
Founder, Mirembe Muse (Pty) Ltd — East London, South Africa  
[creativelynanda.co.za](https://creativelynanda.co.za) · [hello@mirembemuse.co.za](mailto:hello@mirembemuse.co.za)

---

*PoetryTube is a Mirembe Muse product concept.*
