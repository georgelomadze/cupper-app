'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { WHEEL_DATA } from '@/lib/sca/wheel-data'

export default function FlavorWheel() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  function toggle(name: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Выбранные */}
      {selected.size > 0 && (
        <div className="px-4 pt-2 pb-1 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {[...selected].map(d => (
              <button key={d} onClick={() => toggle(d)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full press-scale"
                style={{ background: 'var(--gold)', color: '#000' }}>
                {d} ×
              </button>
            ))}
          </div>
          <button onClick={() => setSelected(new Set())}
            className="text-xs mt-2 press-scale" style={{ color: 'var(--ios-text3)' }}>
            Очистить всё
          </button>
        </div>
      )}

      {/* Группы — аккордеон */}
      <div className="scroll-native flex-1 px-4 pt-2 pb-4 space-y-2">
        {WHEEL_DATA.map(group => (
          <div key={group.id} className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--ios-surface)', border: '0.5px solid var(--ios-border)' }}>
            {/* Заголовок группы */}
            <button
              onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
              className="w-full flex items-center justify-between px-4 py-3.5 press-scale">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: group.color }} />
                <span className="font-semibold text-[15px]">{group.name}</span>
              </div>
              <span className="text-lg" style={{ color: 'var(--ios-text3)',
                transform: openGroup === group.id ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease', display: 'inline-block' }}>
                ›
              </span>
            </button>

            {/* Дескрипторы — все сразу */}
            {openGroup === group.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4 pt-1"
                style={{ borderTop: '0.5px solid var(--ios-border)' }}
              >
                {group.subgroups.map(sub => (
                  <div key={sub.id} className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: group.color, opacity: 0.8 }}>{sub.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {sub.descriptors.map(d => {
                        const isSelected = selected.has(d)
                        return (
                          <button key={d} onClick={() => toggle(d)}
                            className="text-sm px-3 py-1.5 rounded-xl press-scale font-medium"
                            style={{
                              background: isSelected ? group.color : `${group.color}18`,
                              color: isSelected ? '#000' : group.color,
                              border: `0.5px solid ${group.color}40`,
                            }}>
                            {d}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
