# settle

A calm, judgment-free spending journal. Log purchases as a nighttime ritual — not a budget tracker.

---

## Stack

- **Next.js 14** (App Router) — hosted free on Vercel
- **Supabase** — auth (magic link) + Postgres database
- **Recharts** — patterns charts

---

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In the SQL Editor, paste and run the contents of `supabase-schema.sql`
3. In **Authentication → Providers**, make sure **Email** is enabled
4. In **Authentication → URL Configuration**, set your Site URL to your Vercel URL (or `http://localhost:3000` for local dev)

### 2. Get your Supabase keys

Go to **Settings → API** and copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Local development

```bash
# Install dependencies
npm install

# Create your env file
cp .env.local.example .env.local
# Then fill in your Supabase URL and anon key

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).

Add your environment variables in Vercel's project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**That's it.** Vercel + Supabase are both free for this scale.

---

## Auth flow

Settle uses **magic links** — no passwords. Users enter their email, get a link, click it, and they're in. The session is stored in cookies and refreshed automatically by middleware.

---

## File structure

```
settle/
├── app/
│   ├── globals.css          # Design tokens, fonts
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home (checks auth, renders app)
│   ├── login/
│   │   └── page.tsx         # Magic link login screen
│   └── auth/
│       └── callback/
│           └── route.ts     # Supabase auth callback
├── components/
│   ├── SettleApp.tsx        # Main client shell (state, data fetching)
│   ├── HomeView.tsx         # KPI cards, tabs, today's entries
│   ├── AddEntryModal.tsx    # Bottom sheet for logging
│   ├── SettledScreen.tsx    # Calm confirmation screen
│   ├── AllEntriesView.tsx   # Entries grouped by date
│   └── PatternsView.tsx     # Donut + bar charts
├── lib/
│   ├── types.ts             # Entry type, categories, colors
│   ├── db.ts                # Supabase query helpers
│   └── supabase/
│       ├── client.ts        # Browser Supabase client
│       └── server.ts        # Server Supabase client
├── middleware.ts             # Auth redirect middleware
├── supabase-schema.sql      # Run once in Supabase SQL editor
└── .env.local.example       # Env var template
```
