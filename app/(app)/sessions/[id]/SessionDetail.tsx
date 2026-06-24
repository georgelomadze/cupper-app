'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Play, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Session, SessionSample, SessionMember } from '@/lib/types'

const COUNTRY_FLAGS: Record<string, string> = {
  'Ethiopia':'🇪🇹','Colombia':'🇨🇴','Kenya':'🇰🇪','Rwanda':'🇷🇼',
  'Brazil':'🇧🇷','Guatemala':'🇬🇹','Honduras':'🇭🇳','Costa Rica':'🇨🇷',
  'Panama':'🇵🇦','Yemen':'🇾🇪','Indonesia':'🇮🇩','Peru':'🇵🇪',
  'Mexico':'🇲🇽','Tanzania':'🇹🇿','Uganda':'🇺🇬','Burundi':'🇧🇮',
}

interface ScoreRow { session_sample_id: string; user_id: string; final_score: number }

interface Props {
  session: Session
  samples: SessionSample[]
  members: SessionMember[]
  currentUserId: string
  scores: ScoreRow[]
}

export default function SessionDetail({ session, samples, members, currentUserId, scores }: Props) {
  const router = useRouter()
  const isHost = session.host_id === currentUserId
  const isActive = session.status === 'active'
  const [showFinishAlert, setShowFinishAlert] = useState(false)
  const [finishing, setFinishing] = useState(false)

  // Средний балл по образцу (среди всех участников)
  function avgScore(sampleId: string): number | null {
    const sampleScores = scores.filter(s => s.session_sample_id === sampleId)
    if (!sampleScores.length) return null
    const avg = sampleScores.reduce((sum, s) => sum + s.final_score, 0) / sampleScores.length
    return Math.round(avg * 100) / 100
  }

  // Мой балл по образцу
  function myScore(sampleId: string): number | null {
    const s = scores.find(s => s.session_sample_id === sampleId && s.user_id === currentUserId)
    return s ? s.final_score : null
  }

  async function handleFinish() {
    setFinishing(true)
    const supabase = createClient()
    await supabase
      .from('sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', session.id)
    router.push('/sessions')
  }

  const hasSamples = samples.length > 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
        <Link href="/sessions" style={{ color: 'var(--gold-light)' }}>
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-base truncate">{session.name}</h2>
          <p className="text-xs" style={{ color: 'var(--ios-text3)' }}>
            {members.length} участников · {session.cup_count} чашек
          </p>
        </div>
        {isActive && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ color: 'var(--ios-green)', background: 'rgba(48,209,88,0.12)', border: '0.5px solid rgba(48,209,88,0.3)' }}>
            ● Live
          </span>
        )}
      </div>

      {/* Samples list */}
      <div className="scroll-native flex-1" style={{ paddingBottom: 140 }}>
        <div className="flex items-center justify-between px-5 pt-3 pb-2">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ios-text3)' }}>
            Образцы · {samples.length}
          </p>
          {isHost && isActive && (
            <Link href={`/sessions/${session.id}/samples/new`}>
              <div className="flex items-center gap-1 press-scale">
                <Plus className="w-4 h-4" style={{ color: 'var(--gold-light)' }} strokeWidth={2.5} />
                <span className="text-sm font-semibold" style={{ color: 'var(--gold-light)' }}>Добавить</span>
              </div>
            </Link>
          )}
        </div>

        {samples.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 gap-4">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center" style={{ background: 'var(--ios-surface2)' }}>
              <span className="text-3xl">☕</span>
            </div>
            <div className="text-center">
              <p className="font-semibold mb-1">Нет образцов</p>
              <p className="text-sm" style={{ color: 'var(--ios-text3)' }}>Добавьте образцы чтобы начать каппинг</p>
            </div>
            {isHost && (
              <Link href={`/sessions/${session.id}/samples/new`}>
                <button className="px-6 py-3 rounded-2xl font-semibold text-black press-scale" style={{ background: 'var(--gold)' }}>
                  + Добавить образец
                </button>
              </Link>
            )}
          </div>
        ) : (
          samples.map((s, i) => {
            const avg = avgScore(s.id)
            const mine = myScore(s.id)
            const hasMyScore = mine !== null

            return (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="mx-4 mb-2.5"
              >
                <Link href={`/sessions/${session.id}/cupping?sample=${s.id}`}>
                  <div className="glass-card p-4 press-scale">
                    <div className="flex items-center gap-4">
                      {/* Флаг */}
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: 'var(--ios-glass2)' }}>
                        {COUNTRY_FLAGS[s.coffee_sample?.country ?? ''] ?? '☕'}
                      </div>

                      {/* Инфо */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold" style={{ color: 'var(--ios-text3)' }}>#{s.position}</span>
                          <p className="font-semibold text-[15px] truncate">{s.coffee_sample?.name ?? 'Неизвестно'}</p>
                        </div>
                        <p className="text-xs truncate" style={{ color: 'var(--ios-text2)' }}>
                          {[s.coffee_sample?.country, s.coffee_sample?.process].filter(Boolean).join(' · ') || 'Нет данных'}
                        </p>
                      </div>

                      {/* Баллы */}
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        {avg !== null ? (
                          <>
                            <p className="text-xl font-bold leading-none" style={{ color: 'var(--gold-light)' }}>
                              {avg.toFixed(2)}
                            </p>
                            <p className="text-[10px]" style={{ color: 'var(--ios-text3)' }}>средний</p>
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-5 h-5" style={{ color: 'var(--ios-text3)' }} />
                          </>
                        )}
                        {hasMyScore && avg !== null && (
                          <p className="text-[10px]" style={{ color: 'var(--ios-text3)' }}>
                            мой: {mine!.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Bottom CTA — Start или Завершить */}
      {hasSamples && isActive && (
        <div className="absolute bottom-24 left-4 right-4 flex gap-3">
          <Link href={`/sessions/${session.id}/cupping?sample=${samples[0]?.id}`} className="flex-1">
            <button className="w-full py-4 rounded-2xl font-bold text-base text-black press-scale flex items-center justify-center gap-2"
              style={{ background: 'var(--gold)' }}>
              <Play className="w-5 h-5" fill="black" strokeWidth={0} />
              Каппинг
            </button>
          </Link>

          {isHost && (
            <button
              onClick={() => setShowFinishAlert(true)}
              className="py-4 px-5 rounded-2xl font-bold text-base press-scale flex items-center justify-center gap-2"
              style={{ background: 'rgba(255,69,58,0.15)', border: '0.5px solid rgba(255,69,58,0.4)' }}
            >
              <CheckCircle className="w-5 h-5" style={{ color: 'var(--ios-red)' }} strokeWidth={2} />
              <span style={{ color: 'var(--ios-red)' }}>Завершить</span>
            </button>
          )}
        </div>
      )}

      {/* Finish Alert */}
      <AnimatePresence>
        {showFinishAlert && (
          <>
            <motion.div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.6)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFinishAlert(false)} />
            <motion.div className="fixed z-50 left-8 right-8" style={{ top: '40%' }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
              <div className="rounded-3xl overflow-hidden" style={{ background: 'var(--ios-surface)', border: '0.5px solid var(--ios-border)' }}>
                <div className="p-6 text-center">
                  <p className="text-lg font-bold mb-2">Завершить каппинг?</p>
                  <p className="text-sm" style={{ color: 'var(--ios-text2)' }}>
                    Сессия будет закрыта для всех участников
                  </p>
                </div>
                <div style={{ borderTop: '0.5px solid var(--ios-border)' }}>
                  <button onClick={handleFinish} disabled={finishing}
                    className="w-full py-4 text-base font-bold press-scale disabled:opacity-50"
                    style={{ color: 'var(--ios-red)' }}>
                    {finishing ? 'Завершение...' : 'Да, завершить'}
                  </button>
                  <div style={{ borderTop: '0.5px solid var(--ios-border)' }}>
                    <button onClick={() => setShowFinishAlert(false)}
                      className="w-full py-4 text-base font-semibold press-scale"
                      style={{ color: 'var(--ios-text2)' }}>
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
