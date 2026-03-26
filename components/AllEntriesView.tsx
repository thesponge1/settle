'use client'

import type { Entry } from '@/lib/types'
import { EntryRow } from './HomeView'

interface Props {
  entries: Entry[]
  onDelete: (id: string) => void
}

function formatDateHeading(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date(); today.setHours(0,0,0,0)
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  date.setHours(0,0,0,0)

  if (date.getTime() === today.getTime()) return 'today'
  if (date.getTime() === yesterday.getTime()) return 'yesterday'
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function AllEntriesView({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return <p style={s.empty}>nothing logged yet — whenever you're ready</p>
  }

  // Group by date
  const groups = entries.reduce<Record<string, Entry[]>>((acc, e) => {
    ;(acc[e.date] ??= []).push(e)
    return acc
  }, {})

  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a))

  return (
    <div style={s.container}>
      {sortedDates.map(date => {
        const dayEntries = groups[date]
        const dayTotal = dayEntries.reduce((s, e) => s + e.amount, 0)
        return (
          <div key={date} style={s.group}>
            <div style={s.dateRow}>
              <span style={s.dateLabel}>{formatDateHeading(date)}</span>
              <span style={s.dateTotal}>${dayTotal.toFixed(2)}</span>
            </div>
            {dayEntries.map(e => (
              <EntryRow key={e.id} entry={e} onDelete={onDelete} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '32px' },
  empty: {
    color: 'var(--text-muted)',
    fontSize: '0.9375rem',
    fontStyle: 'italic',
    fontFamily: 'var(--font-display)',
  },
  group: { display: 'flex', flexDirection: 'column' },
  dateRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '4px',
    paddingBottom: '10px',
    borderBottom: '1px solid var(--border)',
  },
  dateLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  dateTotal: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    color: 'var(--text-muted)',
  },
}
