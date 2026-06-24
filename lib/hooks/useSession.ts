'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session, SessionMember, SessionSample } from '@/lib/types'

export function useSession(sessionId: string) {
  const [session, setSession]   = useState<Session | null>(null)
  const [members, setMembers]   = useState<SessionMember[]>([])
  const [samples, setSamples]   = useState<SessionSample[]>([])
  const [loading, setLoading]   = useState(true)
  const [isHost,  setIsHost]    = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      const [{ data: sess }, { data: mems }, { data: samps }] = await Promise.all([
        supabase
          .from('sessions')
          .select('*, host:users!host_id(id, name, photo_url)')
          .eq('id', sessionId)
          .single(),
        supabase
          .from('session_members')
          .select('*, user:users(id, name, photo_url)')
          .eq('session_id', sessionId),
        supabase
          .from('session_samples')
          .select('*, coffee_sample:coffee_samples(*)')
          .eq('session_id', sessionId)
          .order('position'),
      ])

      if (sess) {
        setSession(sess as Session)
        setIsHost(sess.host_id === user?.id)
      }
      if (mems) setMembers(mems as SessionMember[])
      if (samps) setSamples(samps as SessionSample[])
      setLoading(false)
    }

    load()

    // Realtime: member joins
    const ch = supabase
      .channel(`session:${sessionId}:members`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'session_members', filter: `session_id=eq.${sessionId}` },
        (payload) => setMembers(prev => [...prev, payload.new as SessionMember])
      )
      .subscribe()

    return () => { supabase.removeChannel(ch) }
  }, [sessionId])

  return { session, members, samples, loading, isHost }
}
