'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.wordmark}>settle</h1>
        <p style={styles.tagline}>a quiet place for your spending</p>

        {!sent ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <p style={styles.label}>enter your email to get a sign-in link</p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
              autoFocus
            />
            {error && <p style={styles.error}>{error}</p>}
            <button
              type="submit"
              disabled={loading || !email}
              style={{
                ...styles.button,
                opacity: loading || !email ? 0.4 : 1,
              }}
            >
              {loading ? 'sending…' : 'send link'}
            </button>
          </form>
        ) : (
          <div style={styles.sentBox}>
            <p style={styles.sentTitle}>check your inbox</p>
            <p style={styles.sentSub}>
              we sent a sign-in link to <span style={{ color: 'var(--accent)' }}>{email}</span>
            </p>
            <p style={styles.sentNote}>no password needed — ever.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'var(--bg)',
  },
  container: {
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  wordmark: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    fontWeight: 400,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
  },
  tagline: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'var(--surface)',
    color: 'var(--text-dark)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9375rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    transition: 'opacity 0.2s',
    marginTop: '4px',
  },
  error: {
    fontSize: '0.8125rem',
    color: '#c08080',
  },
  sentBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '24px',
    background: 'var(--surface-2)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
  sentTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: 400,
  },
  sentSub: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  },
  sentNote: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
    marginTop: '8px',
    fontStyle: 'italic',
    fontFamily: 'var(--font-display)',
  },
}
