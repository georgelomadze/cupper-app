'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Coffee } from 'lucide-react'
import Link from 'next/link'
import type { CoffeeSample } from '@/lib/types'

const COUNTRY_FLAGS: Record<string, string> = {
  'Ethiopia': '🇪🇹', 'Colombia': '🇨🇴', 'Kenya': '🇰🇪', 'Rwanda': '🇷🇼',
  'Brazil': '🇧🇷', 'Guatemala': '🇬🇹', 'Honduras': '🇭🇳', 'Costa Rica': '🇨🇷',
  'Panama': '🇵🇦', 'Yemen': '🇾🇪', 'Indonesia': '🇮🇩', 'Peru': '🇵🇪',
  'Mexico': '🇲🇽', 'Tanzania': '🇹🇿', 'Uganda': '🇺🇬', 'Burundi': '🇧🇮',
}

interface CoffeeListProps { samples: CoffeeSample[] }

export default function CoffeeList({ samples }: CoffeeListProps) {
  const [query, setQuery] = useState('')
  const filtered = samples.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    (s.country ?? '').toLowerCase().includes(query.toLowerCase()) ||
    (s.roaster ?? '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full relative">
      {/* Search */}
      <div className="px-4 pt-2 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: 'var(--ios-surface2)', border: '0.5px solid var(--ios-border)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--ios-text3)' }} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search lots..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
            style={{ color: 'var(--ios-text)' }}
          />
        </div>
      </div>

      {/* Count */}
      {samples.length > 0 && (
        <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider flex-shrink-0"
          style={{ color: 'var(--ios-text3)' }}>
          Collection · {samples.length}
        </p>
      )}

      {/* List */}
      <div className="scroll-native flex-1" style={{ paddingBottom: 120 }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <Coffee className="w-10 h-10" style={{ color: 'var(--ios-text3)' }} strokeWidth={1.5} />
            <div className="text-center">
              <p className="font-semibold mb-1">{query ? 'No results' : 'No samples yet'}</p>
              <p className="text-sm" style={{ color: 'var(--ios-text3)' }}>
                {query ? 'Try a different search' : 'Tap + to add your first lot'}
              </p>
            </div>
          </div>
        ) : (
          filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="mx-4 mb-2.5"
            >
              <div className="glass-card press-scale">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'var(--ios-glass2)' }}>
                    {COUNTRY_FLAGS[s.country ?? ''] ?? '☕'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] truncate">{s.name}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--ios-text2)' }}>
                      {[s.country, s.process, s.roaster].filter(Boolean).join(' · ') || 'No details'}
                    </p>
                    {s.roast_date && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--ios-text3)' }}>
                        Roasted {new Date(s.roast_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold" style={{ color: 'var(--gold-light)' }}>
                      {s.last_score?.toFixed(2) ?? '—'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ios-text3)' }}>
                      {s.cupping_count ?? 0} cupping{(s.cupping_count ?? 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* FAB */}
      <Link href="/coffee/new">
        <button
          className="absolute press-scale flex items-center justify-center rounded-full"
          style={{
            bottom: 88, right: 20, width: 52, height: 52,
            background: 'var(--gold)',
            boxShadow: '0 4px 20px rgba(200,169,110,0.4)',
          }}
        >
          <Plus className="w-6 h-6 text-black" strokeWidth={2.5} />
        </button>
      </Link>
    </div>
  )
}
