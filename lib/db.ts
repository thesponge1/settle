import { createClient } from './supabase/client'
import type { NewEntry, Entry } from './types'

export async function addEntry(entry: NewEntry): Promise<Entry> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('entries')
    .insert({ ...entry, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEntry(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('entries').delete().eq('id', id)
  if (error) throw error
}

export async function getEntries(): Promise<Entry[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
