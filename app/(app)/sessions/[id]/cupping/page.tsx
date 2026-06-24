import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CuppingScreen from '@/components/cupping/CuppingScreen'

export default async function CuppingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sample?: string }>
}) {
  const { id } = await params
  const { sample: sampleId } = await searchParams
  const supabase = await createClient()

  const { data: session } = await supabase.from('sessions').select('*').eq('id', id).single()
  if (!session) notFound()

  const { data: samples } = await supabase
    .from('session_samples')
    .select('*, coffee_sample:coffee_samples(*)')
    .eq('session_id', id)
    .order('position')

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <CuppingScreen
      session={session}
      samples={samples ?? []}
      currentUserId={user?.id ?? ''}
      initialSampleId={sampleId}
      isHost={session.host_id === user?.id}
    />
  )
}
