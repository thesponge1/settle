'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getEntries, addEntry, deleteEntry } from '@/lib/db'
import type { Entry, NewEntry } from '@/lib/types'
import HomeView from './HomeView'
import AddEntryModal from './AddEntryModal'
import SettledScreen from './SettledScreen'
import AllEntriesView from './AllEntriesView'
import PatternsView from './PatternsView'

type Tab = 'today' | 'all' | 'patterns'
type View = 'home' | 'settled'

interface Props {
  userEmail: string
}

export default function SettleApp({ userEmail }: Props) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('today')
  const [view, setView] = useState<View>('home')
  const [showAdd, setShowAdd] = useState(false)
  const [lastEntry, setLastEntry] = useState<Entry | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await getEntries()
      setEntries(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(newEntry: NewEntry) {
    const entry = await addEntry(newEntry)
    setEntries(prev => [entry, ...prev])
    setLastEntry(entry)
    setShowAdd(false)
    setView('settled')
  }

  async function handleDelete(id: string) {
    await deleteEntry(id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (view === 'settled' && lastEntry) {
    return (
      <SettledScreen
        entry={lastEntry}
        onDone={() => setView('home')}
      />
    )
  }

  return (
    <>
      <HomeView
        entries={entries}
        loading={loading}
        tab={tab}
        onTabChange={setTab}
        onAdd={() => setShowAdd(true)}
        onDelete={handleDelete}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        renderTabContent={
          tab === 'all'
            ? <AllEntriesView entries={entries} onDelete={handleDelete} />
            : tab === 'patterns'
            ? <PatternsView entries={entries} />
            : null
        }
      />
      {showAdd && (
        <AddEntryModal
          onSubmit={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  )
}
