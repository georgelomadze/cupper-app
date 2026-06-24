import { createClient } from '@/lib/supabase/server'
import CoffeeList from '@/components/coffee/CoffeeList'

export default async function CoffeePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: samples } = await supabase
    .from('coffee_samples')
    .select('*')
    .eq('owner_id', user?.id ?? '')
    .order('created_at', { ascending: false })

  return <CoffeeList samples={samples ?? []} />
}
