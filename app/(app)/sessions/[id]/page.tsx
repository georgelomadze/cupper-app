import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SessionDetail from './SessionDetail'

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: session } = await supabase
    .from('sessions')
    .select('*, host:users!host_id(*)')
    .eq('id', id)
    .single()

  if (!session) notFound()

  const { data: samples } = await supabase
    .from('session_samples')
    .select('*, coffee_sample:coffee_samples(*)')
    .eq('session_id', id)
    .order('position')

  const { data: members } = await supabase
    .from('session_members')
    .select('*, user:users(*)')
    .eq('session_id', id)

  const { data: { user } } = await supabase.auth.getUser()

  // Загружаем все оценки для этой сессии
  const sampleIds = (samples ?? []).map(s => s.id)
  const { data: scores } = sampleIds.length > 0
    ? await supabase
        .from('scores')
        .select('session_sample_id, user_id, final_score')
        .in('session_sample_id', sampleIds)
    : { data: [] }

  return (
    <SessionDetail
      session={session}
      samples={samples ?? []}
      members={members ?? []}
      currentUserId={user?.id ?? ''}
      scores={scores ?? []}
    />
  )
}
