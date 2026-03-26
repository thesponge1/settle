'use client'

import type { Entry } from '@/lib/types'

interface Props {
  entry: Entry
  onDone: () => void
}

const MESSAGES = {
  today: [
    'logged and released.',
    'noted. that\'s all it needs to be.',
    'it\'s down. you can let it go.',
    'all settled.',
    'written and released.',
  ],
  yesterday: [
    'better late than not at all.',
    'yesterday\'s now accounted for.',
    'still counts. all settled.',
  ],
  older: [
    'it found its place.',
    'even late, it\'s recorded.',
    'the past is now accounted for.',
  ],
}

function pickMessage(date: string): string {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  let pool: string[]
  if (date === today) pool = MESSAGES.today
  else if (date === yesterday) pool = MESSAGES.yesterday
  else pool = MESSAGES.older

  return pool[Math.floor(Math.random() * pool.length)]
}

function formatEntryDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  date.setHours(0, 0, 0, 0)

  if (date.getTime() === today.getTime()) return 'today'
  if (date.getTime() === yesterday.getTime()) return 'yesterday'
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

export default function SettledScreen({ entry, onDone }: Props) {
  const message = pickMessage(entry.date)
  const when = formatEntryDate(entry.date)

  return (
    <div style={s.page}>
      <div style={s.container}>
        <p style={s.message}>{message}</p>

        <div style={s.summary}>
          <p style={s.amount}>${entry.amount.toFixed(2)}</p>
          <p style={s.detail}>{entry.category}{entry.note ? ` · ${entry.note}` : ''}</p>
          <p style={s.when}>{when}</p>
        </div>

        <button onClick={onDone} style={s.btn}>
          back to settle
        </button>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    background: 'var(--bg)',
  },
  container: {
    maxWidth: '360px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  message: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    fontWeight: 400,
    fontStyle: 'italic',
    color: 'var(--text)',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  summary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '20px 0',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  },
  amount: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    fontWeight: 400,
    color: 'var(--text)',
    letterSpacing: '-0.03em',
  },
  detail: {
    fontSize: '0.9375rem',
    color: 'var(--text-muted)',
  },
  when: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    fontFamily: 'var(--font-display)',
  },
  btn: {
    alignSelf: 'flex-start',
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    padding: '4px 0',
    borderBottom: '1px solid var(--border)',
  },
}
