'use client'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { Entry, Category } from '@/lib/types'
import { CATEGORY_COLORS } from '@/lib/types'

interface Props {
  entries: Entry[]
}

function thisMonthStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function last6Months(): { key: string; label: string }[] {
  const result = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'short' })
    result.push({ key, label })
  }
  return result
}

export default function PatternsView({ entries }: Props) {
  const month = thisMonthStr()

  // Donut: this month by category
  const monthEntries = entries.filter(e => e.date.startsWith(month))
  const catTotals = monthEntries.reduce<Partial<Record<Category, number>>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount
    return acc
  }, {})
  const donutData = Object.entries(catTotals).map(([cat, value]) => ({
    name: cat,
    value: value as number,
    color: CATEGORY_COLORS[cat as Category],
  }))

  // Bar: 6-month totals
  const months = last6Months()
  const barData = months.map(({ key, label }) => ({
    label,
    total: entries
      .filter(e => e.date.startsWith(key))
      .reduce((s, e) => s + e.amount, 0),
  }))

  if (entries.length === 0) {
    return <p style={s.empty}>patterns will appear once you start logging</p>
  }

  return (
    <div style={s.container}>
      {/* This month donut */}
      <div style={s.section}>
        <p style={s.sectionLabel}>this month by category</p>
        {donutData.length === 0 ? (
          <p style={s.sub}>nothing logged this month yet</p>
        ) : (
          <>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {donutData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={s.legend}>
              {donutData.map(d => (
                <div key={d.name} style={s.legendItem}>
                  <span style={{ ...s.dot, background: d.color }} />
                  <span style={s.legendName}>{d.name}</span>
                  <span style={s.legendValue}>${d.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 6-month bar */}
      <div style={s.section}>
        <p style={s.sectionLabel}>last 6 months</p>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barSize={24}>
              <XAxis
                dataKey="label"
                tick={{ fill: '#6b6b6b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  color: '#f5f2ec',
                  fontSize: 13,
                }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, '']}
                labelStyle={{ color: '#6b6b6b' }}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Bar dataKey="total" fill="#c4a882" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '40px' },
  empty: {
    color: 'var(--text-muted)',
    fontSize: '0.9375rem',
    fontStyle: 'italic',
    fontFamily: 'var(--font-display)',
  },
  section: { display: 'flex', flexDirection: 'column', gap: '16px' },
  sectionLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  sub: { fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' },
  legend: { display: 'flex', flexDirection: 'column', gap: '10px' },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
  },
  legendName: { fontSize: '0.875rem', color: 'var(--text)', flex: 1 },
  legendValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9375rem',
    color: 'var(--text-muted)',
  },
}
