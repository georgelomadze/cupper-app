import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AddSampleScreen from './AddSampleScreen'

export default async function AddSamplePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (!session) notFound()

  const { data: existing } = await supabase
    .from('session_samples')
    .select('id')
    .eq('session_id', id)

  const { data: { user } } = await supabase.auth.getUser()

  const { data: mySamples } = await supabase
    .from('coffee_samples')
    .select('*')
    .eq('owner_id', user?.id ?? '')
    .order('created_at', { ascending: false })

  return (
    <AddSampleScreen
      session={session}
      existingCount={existing?.length ?? 0}
      mySamples={mySamples ?? []}
    />
  )
}
