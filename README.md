# CUPPER ☕

Professional SCA cupping app — Next.js 15 PWA with Supabase Realtime.

## Stack

- **Next.js 15** — App Router, Server Actions
- **React 19** — latest
- **TypeScript** — strict mode
- **TailwindCSS** — iOS design tokens
- **Framer Motion** — spring animations
- **Supabase** — Auth, PostgreSQL, Realtime, Storage
- **Lucide React** — vector icons
- **next-pwa** — Service Worker, offline support

## Setup

### 1. Clone & install

```bash
git clone https://github.com/georgelomadze/cupper-app.git
cd cupper-app
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
# .env.local is already populated with your Supabase credentials
```

### 3. Database

Run the migration in **Supabase SQL Editor**:

```
supabase/migrations/001_initial.sql
```

Copy the full contents and run it in:
`https://supabase.com/dashboard/project/dqggfydxtxnroqfkydux/sql/new`

### 4. Enable Google OAuth (optional)

In Supabase Dashboard → Authentication → Providers → Google:
- Add your Google OAuth credentials
- Add redirect URL: `https://your-domain.com/sessions`

### 5. Run locally

```bash
npm run dev
# → http://localhost:3000
```

### 6. Deploy to Vercel

```bash
npx vercel
# Add env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Project structure

```
app/
  (auth)/login/        ← login page
  (app)/
    sessions/          ← session list + detail + cupping
    coffee/            ← coffee collection
    wheel/             ← SCA flavor wheel
    settings/          ← user settings
components/
  ui/                  ← reusable: BottomSheet, SliderSheet, TabBar, NavBar
  sessions/            ← SessionCard, SessionList, NewSessionForm
  cupping/             ← CuppingScreen, ScoreGrid, SamplePicker
  coffee/              ← CoffeeList, CoffeeCard
  wheel/               ← FlavorWheel
lib/
  supabase/            ← client, server, middleware
  sca/                 ← scoring formula, wheel data
  hooks/               ← useRealtimeScores, useSession
  types/               ← all TypeScript types
supabase/
  migrations/          ← SQL migrations
```

## SCA Scoring

Final Score = Σ(all criteria) - 36

| Criterion | Default | Range |
|-----------|---------|-------|
| Fragrance/Aroma | 6.00 | 6–10 |
| Flavor | 6.00 | 6–10 |
| Aftertaste | 6.00 | 6–10 |
| Acidity | 6.00 | 6–10 |
| Body | 6.00 | 6–10 |
| Uniformity | 10.00* | 6–10 |
| Balance | 6.00 | 6–10 |
| Clean Cup | 10.00* | 6–10 |
| Sweetness | 10.00 | 6–10 |
| Overall | 6.00 | 6–10 |

*Fixed at 10 when cup_count = 1

## License

MIT
