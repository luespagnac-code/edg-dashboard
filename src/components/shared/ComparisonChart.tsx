import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { MonthKey, MetricRow } from '../../types'
import { MONTH_LABELS } from '../../types'
import { formatCompact } from '../../utils/formatters'

interface ComparisonChartProps {
  metrics: MetricRow[]
  selectedMonths: MonthKey[]
  compareMonths: MonthKey[]
  color: string
  compareColor?: string
  type?: 'bar' | 'line'
  title: string
  maxMetrics?: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 border border-slate-600 rounded-lg p-3 shadow-xl">
      <p className="text-white font-medium text-sm mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{formatCompact(entry.value ?? 0)}</span>
        </p>
      ))}
    </div>
  )
}

export function ComparisonChart({
  metrics,
  selectedMonths,
  compareMonths,
  color,
  compareColor = '#10B981',
  type = 'bar',
  title,
  maxMetrics = 6,
}: ComparisonChartProps) {
  const visibleMetrics = metrics.slice(0, maxMetrics)

  // Build chart data: one entry per metric, with primary and compare bars
  const data = visibleMetrics.map(m => {
    const primaryVal = selectedMonths.reduce((acc, mo) => acc + (m.values[mo] ?? 0), 0)
    const compareVal = compareMonths.reduce((acc, mo) => acc + (m.values[mo] ?? 0), 0)
    const label = m.label.length > 20 ? m.label.slice(0, 18) + '…' : m.label
    return {
      name: label,
      Principal: primaryVal || undefined,
      Comparación: compareMonths.length ? (compareVal || undefined) : undefined,
    }
  })

  const ChartComponent = type === 'line' ? LineChart : BarChart

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={formatCompact} width={55} />
            <Tooltip content={<CustomTooltip />} />
            {compareMonths.length > 0 && <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />}
            <Bar dataKey="Principal" fill={color} radius={[4, 4, 0, 0]} maxBarSize={40} />
            {compareMonths.length > 0 && (
              <Bar dataKey="Comparación" fill={compareColor} radius={[4, 4, 0, 0]} maxBarSize={40} />
            )}
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={formatCompact} width={55} />
            <Tooltip content={<CustomTooltip />} />
            {compareMonths.length > 0 && <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />}
            <Line type="monotone" dataKey="Principal" stroke={color} strokeWidth={2} dot={{ r: 4 }} />
            {compareMonths.length > 0 && (
              <Line type="monotone" dataKey="Comparación" stroke={compareColor} strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

// ─── Time Series Chart (one line per metric over months) ───────────────────────

interface TimeSeriesChartProps {
  metrics: MetricRow[]
  months: MonthKey[]
  colors: string[]
  title: string
}

export function TimeSeriesChart({ metrics, months, colors, title }: TimeSeriesChartProps) {
  const data = months.map(month => {
    const point: Record<string, string | number> = { name: MONTH_LABELS[month].slice(0, 3) }
    metrics.forEach(m => {
      if (m.values[month] !== undefined) point[m.label] = m.values[month]!
    })
    return point
  })

  const hasData = data.some(d => Object.keys(d).length > 1)
  if (!hasData) return null

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={formatCompact} width={55} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 11 }} />
          {metrics.map((m, i) => (
            <Line
              key={m.label}
              type="monotone"
              dataKey={m.label}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={{ r: 4, fill: colors[i % colors.length] }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
