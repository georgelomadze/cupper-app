import { createClient } from '@/lib/supabase/server'
import SessionList from '@/components/sessions/SessionList'

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: sessions } = await supabase
    .from('sessions')
    .select(`
      *,
      host:users!host_id(id, name, photo_url),
      member_count:session_members(count),
      sample_count:session_samples(count)
    `)
    .or(`type.eq.open,host_id.eq.${user?.id}`)
    .order('created_at', { ascending: false })

  return <SessionList sessions={sessions ?? []} currentUserId={user?.id ?? ''} />
}
