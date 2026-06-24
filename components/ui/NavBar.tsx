'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@/lib/types'

const TITLES: Record<string, string> = {
  '/sessions': 'CUPPER',
  '/coffee':   'Кофе',
  '/wheel':    'SCA Колесо',
  '/settings': 'Настройки',
}

export default function NavBar({ user }: { user: User | null }) {
  const pathname = usePathname()
  const title = TITLES[pathname] ?? 'CUPPER'
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="flex items-center justify-between px-5 pb-3 flex-shrink-0" style={{ height: 52 }}>
      <Link href="/settings">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-black press-scale"
          style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #8B6914 100%)' }}>
          {initials}
        </div>
      </Link>
      <h1 className="text-lg font-bold"
        style={{ color: 'var(--gold-light)', letterSpacing: pathname === '/sessions' ? '4px' : '1px' }}>
        {title}
      </h1>
      <div className="w-8" />
    </header>
  )
}
