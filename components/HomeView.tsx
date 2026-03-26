'use client'

import type { Entry } from '@/lib/types'

type Tab = 'today' | 'all' | 'patterns'

interface Props {
  entries: Entry[]
  loading: boolean
  tab: Tab
  onTabChange: (t: Tab) => void
  onAdd: () => void
  onDelete: (id: string) => void
  userEmail: string
  onSignOut: () => void
  renderTabContent: React.ReactNode
}

function fmt(n: number) {
  return '$' + n.toFixed(2)
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function thisMonthStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function HomeView({
  entries, loading, tab, onTabChange, onAdd,
  onDelete, userEmail, onSignOut, renderTabContent
}: Props) {
  const today = todayStr()
  const month = thisMonthStr()

  const todayTotal = entries
    .filter(e => e.date === today)
    .reduce((s, e) => s + e.amount, 0)

  const monthTotal = entries
    .filter(e => e.date.startsWith(month))
    .reduce((s, e) => s + e.amount, 0)

  const todayEntries = entries.filter(e => e.date === today)

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.wordmark}>settle</h1>
          <p style={s.date}>{formatDate(new Date())}</p>
        </div>
        <div style={s.headerRight}>
          <button onClick={onAdd} style={s.addBtn}>+ add</button>
          <button onClick={onSignOut} style={s.signOutBtn} title={`signed in as ${userEmail}`}>
            sign out
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={s.cards}>
        <div style={s.card}>
          <p style={s.cardLabel}>this month</p>
          <p style={s.cardValue}>{loading ? '—' : fmt(monthTotal)}</p>
        </div>
        <div style={s.card}>
          <p style={s.cardLabel}>today</p>
          <p style={s.cardValue}>{loading ? '—' : fmt(todayTotal)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {(['today', 'all', 'patterns'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            style={{
              ...s.tabBtn,
              ...(tab === t ? s.tabActive : {}),
            }}
          >
            {t === 'all' ? 'all entries' : t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={s.content}>
        {renderTabContent ?? (
          todayEntries.length === 0 ? (
            <p style={s.empty}>nothing yet today — rest easy</p>
          ) : (
            <div style={s.entryList}>
              {todayEntries.map(entry => (
                <EntryRow key={entry.id} entry={entry} onDelete={onDelete} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export function EntryRow({ entry, onDelete }: { entry: Entry; onDelete: (id: string) => void }) {
  return (
    <div style={er.row}>
      <div style={er.left}>
        <span style={er.category}>{entry.category}</span>
        {entry.note && <span style={er.note}>{entry.note}</span>}
      </div>
      <div style={er.right}>
        <span style={er.amount}>${entry.amount.toFixed(2)}</span>
        <button onClick={() => onDelete(entry.id)} style={er.del} aria-label="delete">×</button>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '32px 20px 80px',
    minHeight: '100dvh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  wordmark: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    fontWeight: 400,
    letterSpacing: '-0.02em',
    color: 'var(--text)',
  },
  date: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
  },
  addBtn: {
    padding: '8px 16px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text)',
    fontSize: '0.875rem',
    letterSpacing: '0.01em',
  },
  signOutBtn: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    padding: '2px 0',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '20px 24px',
  },
  cardLabel: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
    marginBottom: '6px',
  },
  cardValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    fontWeight: 400,
    color: 'var(--text-dark)',
    letterSpacing: '-0.02em',
  },
  tabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    marginBottom: '28px',
  },
  tabBtn: {
    padding: '10px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)',
    fontSize: '0.8125rem',
    letterSpacing: '0.02em',
    transition: 'all 0.15s',
    background: 'transparent',
  },
  tabActive: {
    background: 'var(--surface-2)',
    color: 'var(--text)',
    borderColor: '#3a3a3a',
  },
  content: {},
  empty: {
    color: 'var(--text-muted)',
    fontSize: '0.9375rem',
    fontStyle: 'italic',
    fontFamily: 'var(--font-display)',
  },
  entryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
}

const er: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid var(--border)',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  category: {
    fontSize: '0.9375rem',
    color: 'var(--text)',
  },
  note: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  amount: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.125rem',
    fontWeight: 400,
    color: 'var(--text)',
  },
  del: {
    color: 'var(--text-muted)',
    fontSize: '1.25rem',
    lineHeight: 1,
    padding: '4px',
    opacity: 0.5,
  },
}
