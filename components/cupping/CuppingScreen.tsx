'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeScores } from '@/lib/hooks/useRealtimeScores'
import ScoreGrid from './ScoreGrid'
import SamplePicker from './SamplePicker'
import { defaultScores } from '@/lib/sca/scoring'
import type { Session, SessionSample, Score, ScoreCriterion } from '@/lib/types'

interface CuppingScreenProps {
  session: Session
  samples: SessionSample[]
  currentUserId: string
  initialSampleId?: string
  isHost: boolean
}

export default function CuppingScreen({ session, samples, currentUserId, initialSampleId, isHost }: CuppingScreenProps) {
  const router = useRouter()
  const [activeSampleId, setActiveSampleId] = useState(initialSampleId ?? samples[0]?.id ?? '')
  const [localScores, setLocalScores] = useState<Record<string, Partial<Score>>>({})
  const [showFinishAlert, setShowFinishAlert] = useState(false)
  const [finishing, setFinishing] = useState(false)

  const sampleIds = samples.map(s => s.id)
  const { scores } = useRealtimeScores(sampleIds)

  const activeSample = samples.find(s => s.id === activeSampleId)
  const myScore = scores.find(s => s.session_sample_id === activeSampleId && s.user_id === currentUserId)
  const localScore = localScores[activeSampleId] ?? {}
  const displayScore: Partial<Score> = { ...defaultScores(session.cup_count), ...myScore, ...localScore }
  const activeSampleIdx = samples.findIndex(s => s.id === activeSampleId)

  const handleUpdate = useCallback(async (criterion: ScoreCriterion, value: number) => {
    setLocalScores(prev => ({
      ...prev,
      [activeSampleId]: { ...(prev[activeSampleId] ?? {}), [criterion]: value }
    }))

    const supabase = createClient()
    const defaults = defaultScores(session.cup_count)

    await supabase
      .from('scores')
      .upsert({
        session_sample_id: activeSampleId,
        user_id: currentUserId,
        ...defaults,
        ...(myScore ?? {}),
        ...(localScores[activeSampleId] ?? {}),
        [criterion]: value,
      }, { onConflict: 'session_sample_id,user_id' })
  }, [activeSampleId, currentUserId, myScore, localScores, session.cup_count])

  async function handleFinish() {
    setFinishing(true)
    const supabase = createClient()
    await supabase
      .from('sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', session.id)
    router.push('/sessions')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0">
        <Link href={`/sessions/${session.id}`} style={{ color: 'var(--gold-light)' }}>
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{session.name}</p>
          <p className="text-xs" style={{ color: 'var(--ios-text3)' }}>
            {activeSample?.coffee_sample?.name ?? `Образец ${activeSampleIdx + 1}`}
          </p>
        </div>
        <p className="text-xs font-semibold mr-2" style={{ color: 'var(--ios-text3)' }}>
          {activeSampleIdx + 1}/{samples.length}
        </p>
        {isHost && (
          <button
            onClick={() => setShowFinishAlert(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl press-scale"
            style={{ background: 'rgba(255,69,58,0.15)', border: '0.5px solid rgba(255,69,58,0.3)' }}
          >
            <CheckCircle className="w-4 h-4" style={{ color: 'var(--ios-red)' }} strokeWidth={2} />
            <span className="text-xs font-semibold" style={{ color: 'var(--ios-red)' }}>Завершить</span>
          </button>
        )}
      </div>

      {/* Sample picker */}
      <SamplePicker
        samples={samples}
        activeSampleId={activeSampleId}
        onSelect={setActiveSampleId}
      />

      {/* Scores */}
      <motion.div
        key={activeSampleId}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="scroll-native flex-1 pb-4"
      >
        <ScoreGrid
          score={displayScore}
          cupCount={session.cup_count}
          onUpdate={handleUpdate}
        />
      </motion.div>

      {/* Finish alert */}
      <AnimatePresence>
        {showFinishAlert && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFinishAlert(false)}
            />
            <motion.div
              className="fixed z-50 left-8 right-8"
              style={{ top: '40%' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="rounded-3xl overflow-hidden" style={{ background: 'var(--ios-surface)', border: '0.5px solid var(--ios-border)' }}>
                <div className="p-6 text-center">
                  <p className="text-lg font-bold mb-2">Завершить каппинг?</p>
                  <p className="text-sm" style={{ color: 'var(--ios-text2)' }}>
                    Сессия будет закрыта для всех участников
                  </p>
                </div>
                <div style={{ borderTop: '0.5px solid var(--ios-border)' }}>
                  <button
                    onClick={handleFinish}
                    disabled={finishing}
                    className="w-full py-4 text-base font-bold press-scale disabled:opacity-50"
                    style={{ color: 'var(--ios-red)' }}
                  >
                    {finishing ? 'Завершение...' : 'Да, завершить'}
                  </button>
                  <div style={{ borderTop: '0.5px solid var(--ios-border)' }}>
                    <button
                      onClick={() => setShowFinishAlert(false)}
                      className="w-full py-4 text-base font-semibold press-scale"
                      style={{ color: 'var(--ios-text2)' }}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
