'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Coffee, Layers, Settings } from 'lucide-react'

const TABS = [
  { href: '/sessions', label: 'Сессии',   Icon: CalendarDays },
  { href: '/coffee',   label: 'Кофе',     Icon: Coffee       },
  { href: '/wheel',    label: 'SCA Колесо', Icon: Layers     },
  { href: '/settings', label: 'Настройки', Icon: Settings    },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="flex tab-safe flex-shrink-0"
      style={{
        background: 'var(--ios-tbar)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '0.5px solid var(--ios-border)',
        paddingTop: 8,
      }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href ||
          (href !== '/sessions' && pathname.startsWith(href))
        return (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center gap-1 press-scale py-1">
            <Icon
              className="w-6 h-6"
              style={{ color: active ? 'var(--gold-light)' : 'var(--ios-text3)' }}
              strokeWidth={active ? 2.2 : 1.8}
            />
            <span className="text-[10px] font-medium" style={{ color: active ? 'var(--gold-light)' : 'var(--ios-text3)' }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
