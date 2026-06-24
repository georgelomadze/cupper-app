'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const COUNTRIES = [
  'Эфиопия','Колумбия','Кения','Руанда','Бразилия','Гватемала',
  'Гондурас','Коста-Рика','Панама','Йемен','Индонезия','Перу',
  'Мексика','Танзания','Уганда','Бурунди','Боливия','Эквадор',
  'Эль-Сальвадор','Никарагуа','Папуа Новая Гвинея','Вьетнам','Индия',
]

const COUNTRIES_EN: Record<string, string> = {
  'Эфиопия':'Ethiopia','Колумбия':'Colombia','Кения':'Kenya','Руанда':'Rwanda',
  'Бразилия':'Brazil','Гватемала':'Guatemala','Гондурас':'Honduras','Коста-Рика':'Costa Rica',
  'Панама':'Panama','Йемен':'Yemen','Индонезия':'Indonesia','Перу':'Peru',
  'Мексика':'Mexico','Танзания':'Tanzania','Уганда':'Uganda','Бурунди':'Burundi',
  'Боливия':'Bolivia','Эквадор':'Ecuador','Эль-Сальвадор':'El Salvador',
  'Никарагуа':'Nicaragua','Папуа Новая Гвинея':'Papua New Guinea','Вьетнам':'Vietnam','Индия':'India',
}

const PROCESSES = ['Вошд (Washed)','Натуральный (Natural)','Хани (Honey)','Анаэробный','Гилинг Басах','Карбоновая мацерация','Двойная ферментация','Экспериментальный']
const PROCESSES_EN: Record<string, string> = {
  'Вошд (Washed)':'Washed','Натуральный (Natural)':'Natural','Хани (Honey)':'Honey',
  'Анаэробный':'Anaerobic','Гилинг Басах':'Wet Hulled','Карбоновая мацерация':'Carbonic Maceration',
  'Двойная ферментация':'Double Fermented','Экспериментальный':'Experimental',
}

export default function SampleForm({ onSave, onCancel, sessionId, nextPosition }: {
  onSave?: (id: string) => void; onCancel?: () => void; sessionId?: string; nextPosition?: number
}) {
  const router = useRouter()
  const [type, setType]           = useState<'single_origin' | 'espresso'>('single_origin')
  const [name, setName]           = useState('')
  const [country, setCountry]     = useState('')
  const [process, setProcess]     = useState('')
  const [roaster, setRoaster]     = useState('')
  const [roastDate, setRoastDate] = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  async function handleSave() {
    if (!name.trim()) { setError('Введите название'); return }
    setLoading(true); setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: sample, error: err } = await supabase.from('coffee_samples').insert({
      owner_id: user.id, type,
      name: name.trim(),
      country: COUNTRIES_EN[country] || country || null,
      process: PROCESSES_EN[process] || process || null,
      roaster: roaster || null,
      roast_date: roastDate || null,
    }).select().single()

    if (err) { setError(err.message); setLoading(false); return }

    if (sessionId && sample && nextPosition !== undefined) {
      await supabase.from('session_samples').insert({
        session_id: sessionId, coffee_sample_id: sample.id, position: nextPosition,
      })
    }

    setLoading(false)
    if (onSave && sample) onSave(sample.id)
    else router.push('/coffee')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
        <button onClick={onCancel ?? (() => router.back())} style={{ color: 'var(--gold-light)' }} className="press-scale">
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <h2 className="text-lg font-semibold">Новый образец</h2>
      </div>

      <div className="scroll-native flex-1 px-4 space-y-3 pb-8">
        <div>
          <Label>Тип</Label>
          <div className="glass-card p-1 flex gap-1">
            {(['single_origin', 'espresso'] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all press-scale"
                style={{ background: type === t ? 'var(--gold)' : 'transparent', color: type === t ? '#000' : 'var(--ios-text2)' }}>
                {t === 'single_origin' ? 'Моносорт' : 'Эспрессо'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Название лота *</Label>
          <div className="glass-card overflow-hidden">
            <input type="text" placeholder="Например: Yirgacheffe G1" value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-transparent px-4 py-4 text-base outline-none placeholder:opacity-30"
              style={{ color: 'var(--ios-text)' }} />
          </div>
        </div>

        <div>
          <Label>Страна происхождения</Label>
          <div className="glass-card overflow-hidden relative">
            <select value={country} onChange={e => setCountry(e.target.value)}
              className="w-full bg-transparent px-4 py-4 text-base outline-none appearance-none"
              style={{ color: country ? 'var(--ios-text)' : 'var(--ios-text3)' }}>
              <option value="">Выберите страну...</option>
              {COUNTRIES.map(c => <option key={c} value={c} style={{ background: '#1c1c1e' }}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--ios-text3)' }} />
          </div>
        </div>

        <div>
          <Label>Обработка</Label>
          <div className="glass-card overflow-hidden relative">
            <select value={process} onChange={e => setProcess(e.target.value)}
              className="w-full bg-transparent px-4 py-4 text-base outline-none appearance-none"
              style={{ color: process ? 'var(--ios-text)' : 'var(--ios-text3)' }}>
              <option value="">Выберите обработку...</option>
              {PROCESSES.map(p => <option key={p} value={p} style={{ background: '#1c1c1e' }}>{p}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--ios-text3)' }} />
          </div>
        </div>

        <div>
          <Label>Обжарщик</Label>
          <div className="glass-card overflow-hidden">
            <input type="text" placeholder="Например: Drop Coffee" value={roaster}
              onChange={e => setRoaster(e.target.value)}
              className="w-full bg-transparent px-4 py-4 text-base outline-none placeholder:opacity-30"
              style={{ color: 'var(--ios-text)' }} />
          </div>
        </div>

        <div>
          <Label>Дата обжарки</Label>
          <div className="glass-card overflow-hidden">
            <input type="date" value={roastDate} onChange={e => setRoastDate(e.target.value)}
              className="w-full bg-transparent px-4 py-4 text-base outline-none"
              style={{ color: roastDate ? 'var(--ios-text)' : 'var(--ios-text3)', colorScheme: 'dark' }} />
          </div>
        </div>

        {error && <p className="text-sm px-1" style={{ color: 'var(--ios-red)' }}>{error}</p>}

        <button onClick={handleSave} disabled={!name.trim() || loading}
          className="w-full py-4 rounded-2xl font-bold text-base text-black press-scale disabled:opacity-40 mt-2"
          style={{ background: 'var(--gold)' }}>
          {loading ? 'Сохранение...' : 'Сохранить образец'}
        </button>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--ios-text3)' }}>{children}</p>
}
