'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Coffee, Trash2, Copy, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { CoffeeSample } from '@/lib/types'

const COUNTRY_FLAGS: Record<string, string> = {
  'Ethiopia':'🇪🇹','Colombia':'🇨🇴','Kenya':'🇰🇪','Rwanda':'🇷🇼',
  'Brazil':'🇧🇷','Guatemala':'🇬🇹','Honduras':'🇭🇳','Costa Rica':'🇨🇷',
  'Panama':'🇵🇦','Yemen':'🇾🇪','Indonesia':'🇮🇩','Peru':'🇵🇪',
  'Mexico':'🇲🇽','Tanzania':'🇹🇿','Uganda':'🇺🇬','Burundi':'🇧🇮',
}

export default function CoffeeList({ samples: initial }: { samples: CoffeeSample[] }) {
  const router = useRouter()
  const [samples, setSamples] = useState(initial)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = samples.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    (s.country ?? '').toLowerCase().includes(query.toLowerCase()) ||
    (s.roaster ?? '').toLowerCase().includes(query.toLowerCase())
  )

  async function handleDelete(id: string) {
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('coffee_samples').delete().eq('id', id)
    setSamples(prev => prev.filter(s => s.id !== id))
    setDeleting(null)
    setExpanded(null)
  }

  async function handleDuplicate(sample: CoffeeSample) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('coffee_samples').insert({
      owner_id: user.id,
      type: sample.type,
      name: sample.name + ' (копия)',
      country: sample.country,
      process: sample.process,
      roaster: sample.roaster,
      roast_date: sample.roast_date,
    }).select().single()
    if (data) setSamples(prev => [data as CoffeeSample, ...prev])
    setExpanded(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Поиск */}
      <div className="px-4 pt-2 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: 'var(--ios-surface2)', border: '0.5px solid var(--ios-border)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--ios-text3)' }} strokeWidth={2} />
          <input type="text" placeholder="Поиск лотов..." value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
            style={{ color: 'var(--ios-text)' }} />
        </div>
      </div>

      {samples.length > 0 && (
        <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider flex-shrink-0" style={{ color: 'var(--ios-text3)' }}>
          Коллекция · {samples.length}
        </p>
      )}

      {/* Список */}
      <div className="scroll-native flex-1" style={{ paddingBottom: 16 }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Coffee className="w-10 h-10" style={{ color: 'var(--ios-text3)' }} strokeWidth={1.5} />
            <p className="text-sm" style={{ color: 'var(--ios-text3)' }}>
              {query ? 'Ничего не найдено' : 'Нет образцов'}
            </p>
          </div>
        ) : (
          filtered.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }} className="mx-4 mb-2.5">
              <div className="glass-card overflow-hidden">
                {/* Карточка */}
                <button className="w-full flex items-center gap-4 p-4 press-scale text-left"
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'var(--ios-glass2)' }}>
                    {COUNTRY_FLAGS[s.country ?? ''] ?? '☕'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] truncate">{s.name}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--ios-text2)' }}>
                      {[s.country, s.process, s.roaster].filter(Boolean).join(' · ') || 'Нет данных'}
                    </p>
                    {s.roast_date && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--ios-text3)' }}>
                        Обжарка: {new Date(s.roast_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold" style={{ color: 'var(--gold-light)' }}>
                      {s.last_score?.toFixed(2) ?? '—'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ios-text3)' }}>
                      {s.cupping_count ?? 0} капп.
                    </p>
                  </div>
                </button>

                {/* Действия */}
                {expanded === s.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex border-t" style={{ borderColor: 'var(--ios-border)' }}>
                    <Link href={`/coffee/${s.id}/edit`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 py-3 text-sm press-scale"
                        style={{ color: 'var(--ios-blue)' }}>
                        <Pencil className="w-4 h-4" strokeWidth={2} />
                        Изменить
                      </button>
                    </Link>
                    <div style={{ width: '0.5px', background: 'var(--ios-border)' }} />
                    <button onClick={() => handleDuplicate(s)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm press-scale"
                      style={{ color: 'var(--ios-text2)' }}>
                      <Copy className="w-4 h-4" strokeWidth={2} />
                      Дублировать
                    </button>
                    <div style={{ width: '0.5px', background: 'var(--ios-border)' }} />
                    <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm press-scale disabled:opacity-50"
                      style={{ color: 'var(--ios-red)' }}>
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                      {deleting === s.id ? '...' : 'Удалить'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Кнопка добавить */}
      <div className="px-4 pb-4 flex-shrink-0">
        <Link href="/coffee/new">
          <button className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 press-scale"
            style={{ background: 'var(--ios-surface2)', border: '0.5px solid var(--ios-border)', color: 'var(--gold-light)' }}>
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            Добавить кофе
          </button>
        </Link>
      </div>
    </div>
  )
}
