import { RefreshCw, Clock } from 'lucide-react'
import { MONTH_LABELS } from '../../types'
import type { MonthKey } from '../../types'

interface HeaderProps {
  title: string
  selectedMonths: MonthKey[]
  compareMonths: MonthKey[]
  lastUpdated: Date | null
  onRefresh: () => void
  loading: boolean
}

export function Header({ title, selectedMonths, compareMonths, lastUpdated, onRefresh, loading }: HeaderProps) {
  const formatDate = (d: Date) =>
    d.toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

  const periodLabel =
    selectedMonths.length === 0
      ? 'Sin período seleccionado'
      : selectedMonths.length === 1
      ? MONTH_LABELS[selectedMonths[0]]
      : `${MONTH_LABELS[selectedMonths[0]]} – ${MONTH_LABELS[selectedMonths[selectedMonths.length - 1]]}`

  const compareLabel =
    compareMonths.length === 0
      ? null
      : compareMonths.length === 1
      ? MONTH_LABELS[compareMonths[0]]
      : `${MONTH_LABELS[compareMonths[0]]} – ${MONTH_LABELS[compareMonths[compareMonths.length - 1]]}`

  return (
    <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-600/30">
            {periodLabel}
          </span>
          {compareLabel && (
            <>
              <span className="text-slate-600 text-xs">vs</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">
                {compareLabel}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock size={12} />
            <span>Actualizado: {formatDate(lastUpdated)}</span>
          </div>
        )}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 text-sm font-medium transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>
    </header>
  )
}
