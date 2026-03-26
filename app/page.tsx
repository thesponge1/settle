import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettleApp from '@/components/SettleApp'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <SettleApp userEmail={user.email ?? ''} />
}
