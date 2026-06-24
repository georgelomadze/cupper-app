'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { WHEEL_DATA, type WheelGroup, type WheelSubgroup } from '@/lib/sca/wheel-data'

type WheelLevel = 'groups' | 'subgroups' | 'descriptors'

export default function FlavorWheel() {
  const [level, setLevel]           = useState<WheelLevel>('groups')
  const [group, setGroup]           = useState<WheelGroup | null>(null)
  const [subgroup, setSubgroup]     = useState<WheelSubgroup | null>(null)
  const [selected, setSelected]     = useState<Set<string>>(new Set())

  function selectGroup(g: WheelGroup) {
    setGroup(g)
    setLevel('subgroups')
  }

  function selectSubgroup(sg: WheelSubgroup) {
    setSubgroup(sg)
    setLevel('descriptors')
  }

  function toggleDescriptor(name: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  function goBack() {
    if (level === 'descriptors') { setLevel('subgroups'); setSubgroup(null) }
    else { setLevel('groups'); setGroup(null) }
  }

  const accentColor = group?.color ?? 'var(--gold)'

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-5 py-2 flex-shrink-0">
        {level !== 'groups' && (
          <button onClick={goBack} className="press-scale" style={{ color: 'var(--gold-light)' }}>
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}
        <div className="flex items-center gap-1.5 text-sm">
          <span style={{ color: level === 'groups' ? 'var(--ios-text)' : 'var(--ios-text3)' }}
            className={level !== 'groups' ? 'cursor-pointer' : ''}
            onClick={() => level !== 'groups' && setLevel('groups') && setGroup(null)}>
            Wheel
          </span>
          {group && <>
            <span style={{ color: 'var(--ios-text3)' }}>›</span>
            <span style={{ color: group.color }}>{group.name}</span>
          </>}
          {subgroup && <>
            <span style={{ color: 'var(--ios-text3)' }}>›</span>
            <span style={{ color: 'var(--ios-text)' }}>{subgroup.name}</span>
          </>}
        </div>
      </div>

      {/* Selected chips */}
      {selected.size > 0 && (
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-none flex-shrink-0">
          {[...selected].map(d => (
            <button key={d} onClick={() => toggleDescriptor(d)}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full press-scale"
              style={{ background: 'var(--gold)', color: '#000' }}>
              {d} ×
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="scroll-native flex-1 pb-24">
        <AnimatePresence mode="wait">
          {level === 'groups' && (
            <motion.div key="groups" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex flex-wrap gap-2.5 px-4 pt-2">
              {WHEEL_DATA.map(g => (
                <button key={g.id} onClick={() => selectGroup(g)}
                  className="rounded-2xl px-4 py-2.5 text-sm font-semibold press-scale"
                  style={{ background: `${g.color}20`, color: g.color, border: `0.5px solid ${g.color}40` }}>
                  {g.name}
                </button>
              ))}
            </motion.div>
          )}

          {level === 'subgroups' && group && (
            <motion.div key="subgroups" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex flex-wrap gap-2.5 px-4 pt-2">
              {group.subgroups.map(sg => (
                <button key={sg.id} onClick={() => selectSubgroup(sg)}
                  className="rounded-2xl px-4 py-2.5 text-sm font-semibold press-scale"
                  style={{ background: `${group.color}15`, color: group.color, border: `0.5px solid ${group.color}30` }}>
                  {sg.name}
                </button>
              ))}
            </motion.div>
          )}

          {level === 'descriptors' && subgroup && (
            <motion.div key="descriptors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex flex-wrap gap-2.5 px-4 pt-2">
              {subgroup.descriptors.map(d => {
                const isSelected = selected.has(d)
                return (
                  <button key={d} onClick={() => toggleDescriptor(d)}
                    className="rounded-2xl px-4 py-2.5 text-sm font-semibold press-scale"
                    style={{
                      background: isSelected ? accentColor : `${accentColor}15`,
                      color: isSelected ? '#000' : accentColor,
                      border: `0.5px solid ${accentColor}40`,
                    }}>
                    {d}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
