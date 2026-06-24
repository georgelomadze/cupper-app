'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Chrome, Coffee } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [sent, setSent]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const supabase = createClient()

  async function handleEmailLogin() {
    if (!email) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/sessions` },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/sessions` },
    })
  }

  return (
    <div className="w-full max-w-sm mx-auto px-6 py-12">
      {/* Logo */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
          style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #8B6914 100%)' }}>
          <Coffee className="w-10 h-10 text-black" strokeWidth={2} />
        </div>
        <h1 className="text-4xl font-bold tracking-widest text-gold">CUPPER</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ios-text3)' }}>
          Professional SCA Cupping
        </p>
      </div>

      {sent ? (
        <div className="glass-card p-6 text-center">
          <Mail className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <p className="font-semibold mb-1">Check your inbox</p>
          <p className="text-sm" style={{ color: 'var(--ios-text2)' }}>
            We sent a magic link to <span className="text-gold">{email}</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Email */}
          <div className="glass-card overflow-hidden">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmailLogin()}
              className="w-full bg-transparent px-4 py-4 text-base outline-none placeholder:opacity-40"
              style={{ color: 'var(--ios-text)' }}
            />
          </div>

          <button
            onClick={handleEmailLogin}
            disabled={loading || !email}
            className="w-full py-4 rounded-2xl font-semibold text-base text-black press-scale disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #C8A96E 0%, #8B6914 100%)' }}
          >
            {loading ? 'Sending...' : 'Continue with Email'}
          </button>

          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px" style={{ background: 'var(--ios-border)' }} />
            <span className="text-xs" style={{ color: 'var(--ios-text3)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--ios-border)' }} />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 rounded-2xl font-semibold text-base press-scale flex items-center justify-center gap-3 glass-card"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          {error && (
            <p className="text-sm text-center" style={{ color: 'var(--ios-red)' }}>{error}</p>
          )}
        </div>
      )}
    </div>
  )
}
