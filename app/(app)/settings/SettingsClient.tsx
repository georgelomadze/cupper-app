'use client'

import { useRouter } from 'next/navigation'
import { User, Building2, Mail, Briefcase, LogOut, Trash2, Info, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as UserType } from '@/lib/types'

export default function SettingsClient({ user }: { user: UserType | null }) {
  const router = useRouter()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="scroll-native h-full pb-8">
      {/* Profile hero */}
      <div className="flex flex-col items-center py-8">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-bold text-black mb-3"
          style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #8B6914 100%)' }}>
          {initials}
        </div>
        <p className="text-xl font-bold">{user?.name || 'Unnamed'}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--ios-text2)' }}>
          {[user?.position, user?.company].filter(Boolean).join(' · ') || 'No role set'}
        </p>
      </div>

      {/* Profile section */}
      <SectionLabel>Profile</SectionLabel>
      <div className="mx-4 glass-card overflow-hidden mb-4">
        <SettingsRow Icon={User}      label="Name"     value={user?.name}     />
        <SettingsRow Icon={Building2} label="Company"  value={user?.company}  />
        <SettingsRow Icon={Briefcase} label="Position" value={user?.position} />
        <SettingsRow Icon={Mail}      label="Email"    value={user?.email} last />
      </div>

      {/* Account */}
      <SectionLabel>Account</SectionLabel>
      <div className="mx-4 glass-card overflow-hidden mb-4">
        <button onClick={handleSignOut}
          className="w-full flex items-center justify-between px-5 py-4 press-scale"
          style={{ borderBottom: '0.5px solid var(--ios-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,69,58,0.15)' }}>
              <LogOut className="w-4 h-4" style={{ color: 'var(--ios-red)' }} strokeWidth={2} />
            </div>
            <span className="text-[15px]">Sign out</span>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--ios-text3)' }} />
        </button>
        <button
          className="w-full flex items-center justify-between px-5 py-4 press-scale">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,69,58,0.1)' }}>
              <Trash2 className="w-4 h-4" style={{ color: 'var(--ios-red)' }} strokeWidth={2} />
            </div>
            <span className="text-[15px]" style={{ color: 'var(--ios-red)' }}>Delete account</span>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--ios-red)' }} />
        </button>
      </div>

      {/* About */}
      <SectionLabel>About</SectionLabel>
      <div className="mx-4 glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '0.5px solid var(--ios-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(200,169,110,0.15)' }}>
              <Info className="w-4 h-4" style={{ color: 'var(--gold)' }} strokeWidth={2} />
            </div>
            <span className="text-[15px]">CUPPER</span>
          </div>
          <span className="text-sm" style={{ color: 'var(--ios-text3)' }}>v0.1.0</span>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-[15px]" style={{ color: 'var(--ios-text2)' }}>SCA Standard</span>
          <span className="text-sm" style={{ color: 'var(--ios-text3)' }}>2024</span>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ios-text3)' }}>{children}</p>
}

function SettingsRow({ Icon, label, value, last }: { Icon: React.ComponentType<any>; label: string; value?: string | null; last?: boolean }) {
  return (
    <button className="w-full flex items-center justify-between px-5 py-4 press-scale"
      style={!last ? { borderBottom: '0.5px solid var(--ios-border)' } : {}}>
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" style={{ color: 'var(--ios-text3)' }} strokeWidth={2} />
        <span className="text-[15px]">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm truncate max-w-36" style={{ color: 'var(--ios-text3)' }}>{value || '—'}</span>
        <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--ios-text3)' }} />
      </div>
    </button>
  )
}
