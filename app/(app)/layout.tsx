import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TabBar from '@/components/ui/TabBar'
import NavBar from '@/components/ui/NavBar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div
      className="flex flex-col w-full overflow-hidden"
      style={{
        background: 'var(--ios-bg)',
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <NavBar user={profile} />
      <main className="flex-1 overflow-hidden relative min-h-0">
        {children}
      </main>
      <TabBar />
    </div>
  )
}
