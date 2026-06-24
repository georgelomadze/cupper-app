'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Coffee, Globe, Lock } from 'lucide-react'
import type { Session } from '@/lib/types'

function CupIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  )
}

export default function SessionList({ sessions, currentUserId }: { sessions: Session[]; currentUserId: string }) {
  const active = sessions.filter(s => s.status === 'active')
  const past   = sessions.filter(s => s.status !== 'active')

  return (
    <div className="scroll-native h-full pb-4">
      {active.length > 0 && (
        <>
          <SectionHeader title="Активные" />
          {active.map((s, i) => <SessionCard key={s.id} session={s} index={i} isHost={s.host_id === currentUserId} />)}
        </>
      )}
      {past.length > 0 && (
        <>
          <SectionHeader title="Завершённые" />
          {past.map((s, i) => <SessionCard key={s.id} session={s} index={i + active.length} isHost={s.host_id === currentUserId} />)}
        </>
      )}
      {sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Coffee className="w-12 h-12" style={{ color: 'var(--ios-text3)' }} strokeWidth={1.5} />
          <p className="text-sm" style={{ color: 'var(--ios-text3)' }}>Нет сессий. Нажмите + чтобы начать.</p>
        </div>
      )}
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return <p className="px-5 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ios-text3)' }}>{title}</p>
}

function SessionCard({ session, index, isHost }: { session: Session; index: number; isHost: boolean }) {
  const isActive = session.status === 'active'
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="mx-4 mb-3">
      <Link href={`/sessions/${session.id}`}>
        <div className="glass-card p-4 press-scale">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold text-base leading-tight">{session.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ios-text3)' }}>
                {new Date(session.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <StatusBadge status={session.status} />
          </div>
          <div className="flex gap-2 mb-3">
            <TypeBadge type={session.type} />
            {isHost && <HostBadge />}
          </div>
          <div className="flex gap-4 pt-3" style={{ borderTop: '0.5px solid var(--ios-border)' }}>
            <MetaItem Icon={Users}   value={(session as any).member_count?.[0]?.count ?? 0} label="участников" />
            <MetaItem Icon={Coffee}  value={(session as any).sample_count?.[0]?.count ?? 0} label="образцов" />
            <MetaItem Icon={CupIcon} value={session.cup_count} label="чашек" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string; border: string }> = {
    active:    { label: '● Live',      color: 'var(--ios-green)', bg: 'rgba(48,209,88,0.12)',  border: 'rgba(48,209,88,0.3)'  },
    completed: { label: 'Завершена',   color: 'var(--ios-text3)', bg: 'var(--ios-glass)',       border: 'var(--ios-border)'    },
    scheduled: { label: 'Запланирована', color: 'var(--ios-blue)', bg: 'rgba(10,132,255,0.12)', border: 'rgba(10,132,255,0.3)' },
  }
  const s = map[status] ?? map.completed
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: s.color, background: s.bg, border: `0.5px solid ${s.border}` }}>{s.label}</span>
}

function TypeBadge({ type }: { type: string }) {
  const isOpen = type === 'open'
  return (
    <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: isOpen ? 'var(--ios-blue)' : 'var(--ios-text2)', background: isOpen ? 'rgba(10,132,255,0.1)' : 'var(--ios-glass)', border: '0.5px solid var(--ios-border)' }}>
      {isOpen ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
      {isOpen ? 'Открытая' : 'Закрытая'}
    </span>
  )
}

function HostBadge() {
  return <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: 'var(--gold)', background: 'rgba(200,169,110,0.12)', border: '0.5px solid rgba(200,169,110,0.3)' }}>Хост</span>
}

function MetaItem({ Icon, value, label }: { Icon: React.ComponentType<any>; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" style={{ color: 'var(--ios-text3)' }} strokeWidth={1.8} />
      <span className="text-xs" style={{ color: 'var(--ios-text2)' }}>{value} {label}</span>
    </div>
  )
}
