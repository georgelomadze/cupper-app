'use client'

import { useState } from 'react'
import BottomSheet from './BottomSheet'
import { SCORE_MIN, SCORE_MAX, SCORE_STEP } from '@/lib/types'
import { roundToStep } from '@/lib/sca/scoring'

interface SliderSheetProps {
  open: boolean
  onClose: () => void
  criterion: string
  value: number
  onChange: (value: number) => void
}

export default function SliderSheet({ open, onClose, criterion, value, onChange }: SliderSheetProps) {
  const [local, setLocal] = useState(value)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = roundToStep(parseFloat(e.target.value))
    setLocal(v)
    onChange(v)
  }

  function handleClose() {
    onChange(local)
    onClose()
  }

  const pct = ((local - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100

  return (
    <BottomSheet open={open} onClose={handleClose} title={criterion}>
      {/* Large value display */}
      <div className="text-center mb-6">
        <span
          className="text-6xl font-black tracking-tight"
          style={{ color: 'var(--gold-light)' }}
        >
          {local.toFixed(2)}
        </span>
      </div>

      {/* Slider */}
      <div className="relative mb-2">
        <input
          type="range"
          min={SCORE_MIN}
          max={SCORE_MAX}
          step={SCORE_STEP}
          value={local}
          onChange={handleChange}
          className="w-full h-6 appearance-none bg-transparent cursor-pointer"
          style={{
            /* Custom track */
          }}
        />
        {/* Custom track bg */}
        <div
          className="absolute top-1/2 left-0 right-0 h-1.5 rounded-full pointer-events-none -translate-y-1/2"
          style={{ background: 'var(--ios-surface3)' }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: 'var(--gold)' }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs mb-8" style={{ color: 'var(--ios-text3)' }}>
        <span>{SCORE_MIN.toFixed(2)}</span>
        <span>{SCORE_MAX.toFixed(2)}</span>
      </div>

      {/* Done */}
      <button
        onClick={handleClose}
        className="w-full py-4 rounded-2xl font-bold text-base text-black press-scale"
        style={{ background: 'var(--gold)' }}
      >
        Done
      </button>
    </BottomSheet>
  )
}
