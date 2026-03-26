'use client'

import { useState } from 'react'
import { CATEGORIES, type Category, type NewEntry } from '@/lib/types'

interface Props {
  onSubmit: (entry: NewEntry) => Promise<void>
  onClose: () => void
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function AddEntryModal({ onSubmit, onClose }: Props) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Eating Out')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayStr())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed <= 0) {
      setError('enter a valid amount')
      return
    }
    setLoading(true)
    try {
      await onSubmit({ amount: parsed, category, note: note || undefined, date })
    } catch (err) {
      setError('something went wrong, try again')
      setLoading(false)
    }
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <h2 style={s.title}>log an entry</h2>
          <button onClick={onClose} style={s.close}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          {/* Amount */}
          <div style={s.field}>
            <label style={s.label}>amount</label>
            <div style={s.amountWrap}>
              <span style={s.dollar}>$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                style={s.amountInput}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Category */}
          <div style={s.field}>
            <label style={s.label}>category</label>
            <div style={s.catGrid}>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  style={{
                    ...s.catBtn,
                    ...(category === c ? s.catActive : {}),
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div style={s.field}>
            <label style={s.label}>date</label>
            <input
              type="date"
              value={date}
              max={todayStr()}
              onChange={e => setDate(e.target.value)}
              style={s.input}
            />
          </div>

          {/* Note */}
          <div style={s.field}>
            <label style={s.label}>note <span style={s.optional}>(optional)</span></label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="what was it?"
              style={s.input}
              maxLength={120}
            />
          </div>

          {error && <p style={s.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !amount}
            style={{
              ...s.submit,
              opacity: loading || !amount ? 0.4 : 1,
            }}
          >
            {loading ? 'saving…' : 'settle it'}
          </button>
        </form>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 100,
    padding: '0',
  },
  modal: {
    width: '100%',
    maxWidth: '680px',
    background: '#141414',
    borderRadius: '20px 20px 0 0',
    padding: '28px 24px 40px',
    border: '1px solid var(--border)',
    borderBottom: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.375rem',
    fontWeight: 400,
    color: 'var(--text)',
  },
  close: {
    fontSize: '1.5rem',
    color: 'var(--text-muted)',
    lineHeight: 1,
    padding: '4px 8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  optional: {
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: '0.75rem',
  },
  amountWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '0 16px',
  },
  dollar: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    color: 'var(--text-muted)',
  },
  amountInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: 'var(--text)',
    fontSize: '1.5rem',
    fontFamily: 'var(--font-display)',
    padding: '12px 0',
    outline: 'none',
    width: '100%',
  },
  input: {
    padding: '12px 16px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text)',
    fontSize: '0.9375rem',
    outline: 'none',
    width: '100%',
    colorScheme: 'dark',
  },
  catGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  catBtn: {
    padding: '8px 14px',
    border: '1px solid var(--border)',
    borderRadius: '100px',
    color: 'var(--text-muted)',
    fontSize: '0.8125rem',
    background: 'transparent',
    transition: 'all 0.15s',
  },
  catActive: {
    background: 'var(--surface)',
    color: 'var(--text-dark)',
    borderColor: 'var(--surface)',
  },
  error: {
    fontSize: '0.8125rem',
    color: '#c08080',
  },
  submit: {
    padding: '16px',
    background: 'var(--surface)',
    color: 'var(--text-dark)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'opacity 0.2s',
    marginTop: '4px',
  },
}
