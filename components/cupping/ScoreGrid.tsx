'use client'

import { useState } from 'react'
import { CRITERIA, type Score, type ScoreCriterion } from '@/lib/types'
import { scoreColor } from '@/lib/sca/scoring'
import SliderSheet from '@/components/ui/SliderSheet'
import { Lock } from 'lucide-react'

const CRITERIA_RU: Record<string, string> = {
  fragrance:  'Аромат',
  flavor:     'Вкус',
  aftertaste: 'Послевкусие',
  acidity:    'Кислотность',
  body:       'Тело',
  uniformity: 'Однородность',
  balance:    'Баланс',
  clean_cup:  'Чистота',
  sweetness:  'Сладость',
  overall:    'Общее',
}

interface ScoreGridProps {
  score: Partial<Score>
  cupCount: number
  onUpdate: (criterion: ScoreCriterion, value: number) => void
  readonly?: boolean
}

export default function ScoreGrid({ score, cupCount, onUpdate, readonly }: ScoreGridProps) {
  const [openCriterion, setOpenCriterion] = useState<ScoreCriterion | null>(null)

  const finalScore = CRITERIA.reduce((sum, { key }) => sum + ((score[key] as number) ?? 6), 0)
  const fixedKeys: ScoreCriterion[] = cupCount === 1 ? ['uniformity', 'clean_cup'] : []

  return (
    <>
      {/* Итоговый балл */}
      <div
        className="mx-4 mb-3 rounded-2xl flex justify-between items-center px-5 py-3.5"
        style={{ background: 'var(--ios-surface2)', border: '0.5px solid var(--ios-border)' }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ios-text3)' }}>Итоговый балл</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ios-text3)' }}>Протокол SCA</p>
        </div>
        <p className="text-4xl font-black tracking-tight" style={{ color: scoreColor(finalScore) }}>
          {finalScore.toFixed(2)}
        </p>
      </div>

      {/* Сетка оценок */}
      <div className="grid grid-cols-3 gap-2.5 px-4">
        {CRITERIA.map(({ key }) => {
          const val = (score[key] as number) ?? 6
          const isFixed = fixedKeys.includes(key)
          const isHigh = val >= 9.75

          return (
            <button
              key={key}
              onClick={() => !isFixed && !readonly && setOpenCriterion(key)}
              disabled={isFixed || readonly}
              className="rounded-2xl px-2 py-3.5 flex flex-col items-center gap-1.5 press-scale disabled:opacity-100"
              style={{
                background: isFixed ? 'rgba(48,209,88,0.08)' : 'var(--ios-surface2)',
                border: `0.5px solid ${isFixed ? 'rgba(48,209,88,0.25)' : 'var(--ios-border)'}`,
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-center leading-tight"
                style={{ color: isFixed ? 'var(--ios-green)' : 'var(--ios-text2)' }}>
                {CRITERIA_RU[key]}
              </p>
              <div className="flex items-center gap-1">
                {isFixed && <Lock className="w-2.5 h-2.5" style={{ color: 'var(--ios-green)' }} strokeWidth={2.5} />}
                <p className="text-xl font-bold tracking-tight"
                  style={{ color: isFixed ? 'var(--ios-green)' : isHigh ? 'var(--ios-green)' : 'var(--gold-light)' }}>
                  {val.toFixed(2)}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Слайдер */}
      {openCriterion && (
        <SliderSheet
          open={!!openCriterion}
          onClose={() => setOpenCriterion(null)}
          criterion={CRITERIA_RU[openCriterion] ?? openCriterion}
          value={(score[openCriterion] as number) ?? 6}
          onChange={(v) => onUpdate(openCriterion, v)}
        />
      )}
    </>
  )
}
