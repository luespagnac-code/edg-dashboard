import { ALL_MONTHS, MONTH_LABELS, QUARTERS, BIANNUAL } from '../../types'
import type { MonthKey, PeriodType, Period } from '../../types'
import { Calendar, BarChart2, TrendingUp } from 'lucide-react'

interface MonthSelectorProps {
  selectedMonths: MonthKey[]
  onChangeMonths: (months: MonthKey[]) => void
  periodType: PeriodType
  onChangePeriodType: (type: PeriodType) => void
  compareMonths: MonthKey[]
  onChangeCompare: (months: MonthKey[]) => void
  availableMonths: MonthKey[]
}

const PERIOD_TABS: { value: PeriodType; label: string; icon: React.ReactNode }[] = [
  { value: 'monthly', label: 'Mensual', icon: <Calendar size={14} /> },
  { value: 'quarterly', label: 'Trimestral', icon: <BarChart2 size={14} /> },
  { value: 'biannual', label: 'Semestral', icon: <TrendingUp size={14} /> },
]

function PeriodChip({ period, active, onClick }: { period: Period; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {period.label}
    </button>
  )
}

function MonthChip({ month, active, onClick, disabled }: { month: MonthKey; active: boolean; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        disabled
          ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
          : active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {month}
    </button>
  )
}

export function MonthSelector({
  selectedMonths,
  onChangeMonths,
  periodType,
  onChangePeriodType,
  compareMonths,
  onChangeCompare,
  availableMonths,
}: MonthSelectorProps) {
  const toggleMonth = (month: MonthKey, isCompare: boolean) => {
    const current = isCompare ? compareMonths : selectedMonths
    const setter = isCompare ? onChangeCompare : onChangeMonths
    if (current.includes(month)) {
      setter(current.filter(m => m !== month))
    } else {
      setter([...current, month].sort((a, b) => ALL_MONTHS.indexOf(a) - ALL_MONTHS.indexOf(b)))
    }
  }

  const setPeriod = (period: Period, isCompare: boolean) => {
    const setter = isCompare ? onChangeCompare : onChangeMonths
    setter(period.months.filter(m => availableMonths.includes(m)))
  }

  const periods = periodType === 'quarterly' ? QUARTERS : BIANNUAL

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4">
      {/* Period type tabs */}
      <div className="flex items-center gap-2">
        {PERIOD_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => onChangePeriodType(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              periodType === tab.value
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {periodType === 'monthly' ? (
        <div className="grid grid-cols-2 gap-4">
          {/* Primary selection */}
          <div>
            <p className="text-xs text-slate-400 mb-2 font-medium">Período principal</p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_MONTHS.map(m => (
                <MonthChip
                  key={m}
                  month={m}
                  active={selectedMonths.includes(m)}
                  disabled={!availableMonths.includes(m)}
                  onClick={() => toggleMonth(m, false)}
                />
              ))}
            </div>
          </div>
          {/* Compare selection */}
          <div>
            <p className="text-xs text-slate-400 mb-2 font-medium">Comparar con</p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_MONTHS.map(m => (
                <MonthChip
                  key={m}
                  month={m}
                  active={compareMonths.includes(m)}
                  disabled={!availableMonths.includes(m)}
                  onClick={() => toggleMonth(m, true)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 mb-2 font-medium">Período principal</p>
            <div className="flex flex-wrap gap-1.5">
              {periods.map(p => (
                <PeriodChip
                  key={p.label}
                  period={p}
                  active={p.months.every(m => selectedMonths.includes(m))}
                  onClick={() => setPeriod(p, false)}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2 font-medium">Comparar con</p>
            <div className="flex flex-wrap gap-1.5">
              {periods.map(p => (
                <PeriodChip
                  key={p.label}
                  period={p}
                  active={p.months.every(m => compareMonths.includes(m))}
                  onClick={() => setPeriod(p, true)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="flex gap-4 pt-1 border-t border-slate-700 text-xs text-slate-400">
        <span>
          <span className="text-indigo-400 font-medium">Principal:</span>{' '}
          {selectedMonths.length ? selectedMonths.map(m => MONTH_LABELS[m]).join(', ') : 'Ninguno'}
        </span>
        {compareMonths.length > 0 && (
          <span>
            <span className="text-emerald-400 font-medium">Comparar:</span>{' '}
            {compareMonths.map(m => MONTH_LABELS[m]).join(', ')}
          </span>
        )}
      </div>
    </div>
  )
}
