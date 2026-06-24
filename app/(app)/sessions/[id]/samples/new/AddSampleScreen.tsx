'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, Library } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import SampleForm from '@/components/coffee/SampleForm'
import type { Session, CoffeeSample } from '@/lib/types'

const COUNTRY_FLAGS: Record<string, string> = {
  'Ethiopia':'🇪🇹','Colombia':'🇨🇴','Kenya':'🇰🇪','Rwanda':'🇷🇼',
  'Brazil':'🇧🇷','Guatemala':'🇬🇹','Honduras':'🇭🇳','Costa Rica':'🇨🇷',
  'Panama':'🇵🇦','Yemen':'🇾🇪','Indonesia':'🇮🇩','Peru':'🇵🇪',
}

type View = 'choose' | 'new' | 'collection'

export default function AddSampleScreen({ session, existingCount, mySamples }: {
  session: Session; existingCount: number; mySamples: CoffeeSample[]
}) {
  const router = useRouter()
  const [view, setView] = useState<View>('choose')
  const [adding, setAdding] = useState<string | null>(null)
  const nextPosition = existingCount + 1

  async function addFromCollection(sample: CoffeeSample) {
    setAdding(sample.id)
    const supabase = createClient()
    await supabase.from('session_samples').insert({
      session_id: session.id, coffee_sample_id: sample.id, position: nextPosition,
    })
    router.push(`/sessions/${session.id}`)
  }

  if (view === 'new') {
    return <SampleForm sessionId={session.id} nextPosition={nextPosition} onSave={() => router.push(`/sessions/${session.id}`)} onCancel={() => setView('choose')} />
  }

  if (view === 'collection') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
          <button onClick={() => setView('choose')} style={{ color: 'var(--gold-light)' }} className="press-scale">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <h2 className="text-lg font-semibold">Моя коллекция</h2>
        </div>
        <div className="scroll-native flex-1 pb-8">
          {mySamples.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <p className="text-sm" style={{ color: 'var(--ios-text3)' }}>Коллекция пуста</p>
              <button onClick={() => setView('new')} className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-black press-scale" style={{ background: 'var(--gold)' }}>Создать новый</button>
            </div>
          ) : mySamples.map(s => (
            <div key={s.id} className="mx-4 mb-2.5">
              <button onClick={() => addFromCollection(s)} disabled={adding === s.id} className="w-full glass-card press-scale disabled:opacity-50">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'var(--ios-glass2)' }}>
                    {COUNTRY_FLAGS[s.country ?? ''] ?? '☕'}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-[15px] truncate">{s.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ios-text2)' }}>
                      {[s.country, s.process].filter(Boolean).join(' · ') || 'Нет данных'}
                    </p>
                  </div>
                  <Plus className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} strokeWidth={2.5} />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
        <button onClick={() => router.back()} style={{ color: 'var(--gold-light)' }} className="press-scale">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <div>
          <h2 className="text-lg font-semibold">Добавить образец</h2>
          <p className="text-xs" style={{ color: 'var(--ios-text3)' }}>Образец #{nextPosition} · {session.name}</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-4 gap-4">
        <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          onClick={() => setView('new')} className="glass-card p-6 press-scale flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,169,110,0.15)' }}>
            <Plus className="w-7 h-7" style={{ color: 'var(--gold)' }} strokeWidth={2} />
          </div>
          <div className="text-left">
            <p className="font-semibold text-base">Новый образец</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--ios-text2)' }}>Создать и добавить в коллекцию</p>
          </div>
        </motion.button>
        <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onClick={() => setView('collection')} className="glass-card p-6 press-scale flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,132,255,0.12)' }}>
            <Library className="w-7 h-7" style={{ color: 'var(--ios-blue)' }} strokeWidth={1.8} />
          </div>
          <div className="text-left">
            <p className="font-semibold text-base">Из коллекции</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--ios-text2)' }}>{mySamples.length} образцов доступно</p>
          </div>
        </motion.button>
      </div>
    </div>
  )
}
