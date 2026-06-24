'use client'

import { useRef } from 'react'
import type { SessionSample } from '@/lib/types'

interface SamplePickerProps {
  samples: SessionSample[]
  activeSampleId: string
  onSelect: (id: string) => void
}

export default function SamplePicker({ samples, activeSampleId, onSelect }: SamplePickerProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  function handleSelect(id: string) {
    onSelect(id)
    // Scroll pill into view
    const el = rowRef.current?.querySelector(`[data-id="${id}"]`) as HTMLElement
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <div
      ref={rowRef}
      className="flex gap-2 px-4 pb-3 overflow-x-auto flex-shrink-0"
      style={{ scrollbarWidth: 'none' }}
    >
      {samples.map((s, i) => {
        const active = s.id === activeSampleId
        return (
          <button
            key={s.id}
            data-id={s.id}
            onClick={() => handleSelect(s.id)}
            className="flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold press-scale"
            style={{
              background: active ? 'var(--gold)' : 'var(--ios-surface2)',
              color: active ? '#000' : 'var(--ios-text2)',
              border: `0.5px solid ${active ? 'var(--gold-light)' : 'var(--ios-border)'}`,
            }}
          >
            {s.coffee_sample?.name ? s.coffee_sample.name.split(' ')[0] : `#${i + 1}`}
          </button>
        )
      })}
    </div>
  )
}
