'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Score } from '@/lib/types'

export function useRealtimeScores(sessionSampleIds: string[]) {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)

  const upsertScore = useCallback((newScore: Score) => {
    setScores(prev => {
      const idx = prev.findIndex(s => s.id === newScore.id)
      if (idx === -1) return [...prev, newScore]
      const next = [...prev]
      next[idx] = newScore
      return next
    })
  }, [])

  useEffect(() => {
    if (!sessionSampleIds.length) { setLoading(false); return }

    const supabase = createClient()

    // Initial fetch
    supabase
      .from('scores')
      .select('*, user:users(id, name, photo_url)')
      .in('session_sample_id', sessionSampleIds)
      .then(({ data }) => {
        if (data) setScores(data as Score[])
        setLoading(false)
      })

    // Realtime subscription
    const channel = supabase
      .channel(`scores:${sessionSampleIds.join(',')}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scores',
          filter: `session_sample_id=in.(${sessionSampleIds.join(',')})`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setScores(prev => prev.filter(s => s.id !== payload.old.id))
          } else {
            upsertScore(payload.new as Score)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [sessionSampleIds.join(',')]) // eslint-disable-line

  return { scores, loading }
}
