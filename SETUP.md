# CUPPER — Этап 1: Инструкции по запуску

## Шаг 1: Залить на GitHub

```bash
cd cupper-app
git init
git add .
git commit -m "feat: initial CUPPER boilerplate — Этап 1"
git branch -M main
git remote add origin https://github.com/georgelomadze/cupper-app.git
git push -u origin main
```

## Шаг 2: Запустить SQL в Supabase

1. Открой: https://supabase.com/dashboard/project/dqggfydxtxnroqfkydux/sql/new
2. Скопируй ВЕСЬ файл: `supabase/migrations/001_initial.sql`
3. Вставь и нажми **Run**

## Шаг 3: Установить и запустить локально

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Шаг 4: Деплой на Vercel (бесплатно)

```bash
npx vercel
```

В панели Vercel добавь env vars:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Статус файлов

✅ package.json — все зависимости
✅ tsconfig.json — TypeScript strict
✅ tailwind.config.ts — iOS design tokens
✅ next.config.ts — PWA конфиг
✅ middleware.ts — защита роутов
✅ app/layout.tsx — PWA meta tags
✅ app/manifest.ts — PWA manifest
✅ app/globals.css — CSS переменные iOS
✅ app/(auth)/login — Email + Google auth
✅ app/(app)/layout.tsx — TabBar + NavBar
✅ app/(app)/sessions — список + создание
✅ app/(app)/sessions/[id] — детали сессии
✅ app/(app)/sessions/[id]/cupping — экран каппинга
✅ app/(app)/coffee — коллекция кофе
✅ app/(app)/wheel — SCA колесо
✅ app/(app)/settings — настройки + выход
✅ components/ui — BottomSheet, SliderSheet, TabBar, NavBar
✅ components/cupping — CuppingScreen, ScoreGrid, SamplePicker
✅ components/sessions — SessionList, SessionCard
✅ components/coffee — CoffeeList
✅ components/wheel — FlavorWheel (все 9 групп SCA)
✅ lib/supabase — client, server, middleware
✅ lib/sca/scoring.ts — SCA формула
✅ lib/sca/wheel-data.ts — полное дерево дескрипторов
✅ lib/hooks/useRealtimeScores.ts — Realtime
✅ lib/hooks/useSession.ts — session state
✅ lib/types/index.ts — все TypeScript типы
✅ supabase/migrations/001_initial.sql — полная БД + RLS + Realtime
✅ .gitignore — .env.local защищён
✅ README.md
