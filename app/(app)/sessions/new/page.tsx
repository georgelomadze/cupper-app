'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Globe, Lock, Plus, Minus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewSessionPage() {
  const router = useRouter()
  const [name, setName]       = useState('')
  const [type, setType]       = useState<'open' | 'closed'>('open')
  const [cups, setCups]       = useState(1)
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({ name: name.trim(), type, cup_count: cups, host_id: user.id })
      .select().single()

    if (!error && session) {
      await supabase.from('session_members').insert({ session_id: session.id, user_id: user.id })
      router.push(`/sessions/${session.id}`)
    }
    setLoading(false)
  }

  return (
    <div className="scroll-native h-full">
      <div className="flex items-center gap-3 px-5 py-3">
        <button onClick={() => router.back()} className="press-scale" style={{ color: 'var(--gold-light)' }}>
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h2 className="text-lg font-semibold">Новая сессия</h2>
      </div>

      <div className="px-5 space-y-4 pb-8">
        {/* Название */}
        <div>
          <Label>Название</Label>
          <div className="glass-card overflow-hidden">
            <input
              type="text"
              placeholder="Например: Ethiopia Morning Blend"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              className="w-full bg-transparent px-4 py-4 text-base outline-none placeholder:opacity-30"
              style={{ color: 'var(--ios-text)' }}
            />
          </div>
        </div>

        {/* Тип */}
        <div>
          <Label>Тип сессии</Label>
          <div className="glass-card p-1 flex gap-1">
            {([['open', Globe, 'Открытая'], ['closed', Lock, 'Закрытая']] as const).map(([val, Icon, lbl]) => (
              <button key={val} onClick={() => setType(val)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all press-scale"
                style={{ background: type === val ? 'var(--gold)' : 'transparent', color: type === val ? '#000' : 'var(--ios-text2)' }}>
                <Icon className="w-4 h-4" strokeWidth={2} />{lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Чашки */}
        <div>
          <Label>Чашек на образец</Label>
          <StepperRow value={cups} min={1} max={10} onChange={setCups} />
          {cups === 1 && (
            <p className="text-xs mt-2 px-1" style={{ color: 'var(--ios-text3)' }}>
              При 1 чашке: Однородность и Чистота = 10 автоматически.
            </p>
          )}
        </div>

        <button
          onClick={handleCreate}
          disabled={!name.trim() || loading}
          className="w-full py-4 rounded-2xl font-bold text-base text-black press-scale disabled:opacity-40 mt-4"
          style={{ background: 'var(--gold)' }}
        >
          {loading ? 'Создание...' : 'Начать сессию →'}
        </button>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--ios-text3)' }}>{children}</p>
}

function StepperRow({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="glass-card flex items-center justify-between px-5 py-3">
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        className="w-9 h-9 rounded-full flex items-center justify-center press-scale disabled:opacity-30"
        style={{ background: 'var(--ios-glass2)' }}>
        <Minus className="w-4 h-4" strokeWidth={2.5} />
      </button>
      <span className="text-2xl font-bold" style={{ color: 'var(--gold-light)' }}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
        className="w-9 h-9 rounded-full flex items-center justify-center press-scale disabled:opacity-30"
        style={{ background: 'var(--ios-glass2)' }}>
        <Plus className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  )
}
