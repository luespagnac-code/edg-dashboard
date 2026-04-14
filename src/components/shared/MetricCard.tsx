import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCompact, formatPercent } from '../../utils/formatters'

interface MetricCardProps {
  label: string
  value: number
  previousValue?: number
  prefix?: string
  suffix?: string
  color?: string
  format?: 'compact' | 'currency' | 'percent' | 'raw'
}

function formatVal(value: number, format: MetricCardProps['format'], prefix = '', suffix = ''): string {
  let str = ''
  if (format === 'currency') {
    str = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value)
  } else if (format === 'percent') {
    str = `${value.toFixed(2)}%`
  } else if (format === 'compact') {
    str = formatCompact(value)
  } else {
    str = new Intl.NumberFormat('es-AR').format(value)
  }
  return `${prefix}${str}${suffix}`
}

export function MetricCard({ label, value, previousValue, prefix = '', suffix = '', color = '#6366F1', format = 'compact' }: MetricCardProps) {
  const hasPrev = previousValue !== undefined && previousValue !== null
  const pct = hasPrev ? ((value - previousValue!) / (previousValue! || 1)) * 100 : null
  const isUp = pct !== null && pct > 0
  const isDown = pct !== null && pct < 0

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-500 transition-all duration-200">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider truncate mb-2">{label}</p>
      <p className="text-2xl font-bold text-white mb-2" style={{ color: value > 0 ? 'white' : '#64748B' }}>
        {formatVal(value, format, prefix, suffix)}
      </p>
      {pct !== null && (
        <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-slate-400'}`}>
          {isUp ? <TrendingUp size={14} /> : isDown ? <TrendingDown size={14} /> : <Minus size={14} />}
          <span>{formatPercent(pct)} vs período anterior</span>
        </div>
      )}
      <div className="mt-3 h-1 rounded-full bg-slate-700">
        <div className="h-1 rounded-full transition-all duration-500" style={{ width: '100%', backgroundColor: color, opacity: 0.7 }} />
      </div>
    </div>
  )
}
