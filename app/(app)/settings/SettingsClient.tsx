'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Building2, Mail, Briefcase, LogOut, Trash2, Info, ChevronRight, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as UserType } from '@/lib/types'

export default function SettingsClient({ user }: { user: UserType | null }) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [values, setValues] = useState({
    name:     user?.name     ?? '',
    company:  user?.company  ?? '',
    position: user?.position ?? '',
  })
  const [saving, setSaving] = useState(false)

  const initials = values.name
    ? values.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  async function handleSave(field: string) {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('users').update({ [field]: values[field as keyof typeof values] }).eq('id', user?.id ?? '')
    setSaving(false)
    setEditing(null)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="scroll-native h-full pb-8">
      {/* Аватар */}
      <div className="flex flex-col items-center py-8">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-bold text-black mb-3"
          style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #8B6914 100%)' }}>
          {initials}
        </div>
        <p className="text-xl font-bold">{values.name || 'Без имени'}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--ios-text2)' }}>
          {[values.position, values.company].filter(Boolean).join(' · ') || 'Заполните профиль'}
        </p>
      </div>

      {/* Профиль */}
      <SectionLabel>Профиль</SectionLabel>
      <div className="mx-4 glass-card overflow-hidden mb-4">
        <EditableRow icon={<User className="w-4 h-4" />} iconBg="rgba(10,132,255,0.15)"
          label="Имя" field="name" value={values.name}
          editing={editing === 'name'} saving={saving}
          onEdit={() => setEditing('name')}
          onChange={v => setValues(p => ({ ...p, name: v }))}
          onSave={() => handleSave('name')}
          onCancel={() => setEditing(null)} />
        <EditableRow icon={<Building2 className="w-4 h-4" />} iconBg="rgba(200,169,110,0.15)"
          label="Компания" field="company" value={values.company}
          editing={editing === 'company'} saving={saving}
          onEdit={() => setEditing('company')}
          onChange={v => setValues(p => ({ ...p, company: v }))}
          onSave={() => handleSave('company')}
          onCancel={() => setEditing(null)} />
        <EditableRow icon={<Briefcase className="w-4 h-4" />} iconBg="rgba(48,209,88,0.15)"
          label="Должность" field="position" value={values.position}
          editing={editing === 'position'} saving={saving}
          onEdit={() => setEditing('position')}
          onChange={v => setValues(p => ({ ...p, position: v }))}
          onSave={() => handleSave('position')}
          onCancel={() => setEditing(null)} last />
      </div>

      {/* Email — только показать */}
      <div className="mx-4 glass-card overflow-hidden mb-4">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,149,0,0.15)' }}>
              <Mail className="w-4 h-4" style={{ color: '#FF9500' }} strokeWidth={2} />
            </div>
            <span className="text-[15px]">Email</span>
          </div>
          <span className="text-sm truncate max-w-44" style={{ color: 'var(--ios-text3)' }}>{user?.email ?? '—'}</span>
        </div>
      </div>

      {/* Аккаунт */}
      <SectionLabel>Аккаунт</SectionLabel>
      <div className="mx-4 glass-card overflow-hidden mb-4">
        <button onClick={handleSignOut}
          className="w-full flex items-center justify-between px-5 py-4 press-scale"
          style={{ borderBottom: '0.5px solid var(--ios-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,69,58,0.15)' }}>
              <LogOut className="w-4 h-4" style={{ color: 'var(--ios-red)' }} strokeWidth={2} />
            </div>
            <span className="text-[15px]">Выйти</span>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--ios-text3)' }} />
        </button>
        <button className="w-full flex items-center justify-between px-5 py-4 press-scale">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,69,58,0.1)' }}>
              <Trash2 className="w-4 h-4" style={{ color: 'var(--ios-red)' }} strokeWidth={2} />
            </div>
            <span className="text-[15px]" style={{ color: 'var(--ios-red)' }}>Удалить аккаунт</span>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--ios-red)' }} />
        </button>
      </div>

      {/* О приложении */}
      <SectionLabel>О приложении</SectionLabel>
      <div className="mx-4 glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '0.5px solid var(--ios-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(200,169,110,0.15)' }}>
              <Info className="w-4 h-4" style={{ color: 'var(--gold)' }} strokeWidth={2} />
            </div>
            <span className="text-[15px]">CUPPER</span>
          </div>
          <span className="text-sm" style={{ color: 'var(--ios-text3)' }}>v1.0.0</span>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-[15px]" style={{ color: 'var(--ios-text2)' }}>Стандарт SCA</span>
          <span className="text-sm" style={{ color: 'var(--ios-text3)' }}>2024</span>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ios-text3)' }}>{children}</p>
}

function EditableRow({ icon, iconBg, label, field, value, editing, saving, onEdit, onChange, onSave, onCancel, last }: {
  icon: React.ReactNode; iconBg: string; label: string; field: string; value: string;
  editing: boolean; saving: boolean; onEdit: () => void; onChange: (v: string) => void;
  onSave: () => void; onCancel: () => void; last?: boolean
}) {
  return (
    <div style={!last ? { borderBottom: '0.5px solid var(--ios-border)' } : {}}>
      {editing ? (
        <div className="flex items-center gap-3 px-5 py-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
            <span style={{ color: 'var(--ios-text2)' }}>{icon}</span>
          </div>
          <input autoFocus value={value} onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel() }}
            className="flex-1 bg-transparent text-[15px] outline-none"
            style={{ color: 'var(--ios-text)' }} placeholder={label} />
          <button onClick={onCancel} className="text-sm press-scale" style={{ color: 'var(--ios-text3)' }}>Отмена</button>
          <button onClick={onSave} disabled={saving} className="press-scale disabled:opacity-50">
            <Check className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <button onClick={onEdit} className="w-full flex items-center justify-between px-5 py-4 press-scale">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
              <span style={{ color: 'var(--ios-text2)' }}>{icon}</span>
            </div>
            <span className="text-[15px]">{label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm truncate max-w-36" style={{ color: 'var(--ios-text3)' }}>{value || 'Не указано'}</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--ios-text3)' }} />
          </div>
        </button>
      )}
    </div>
  )
}
