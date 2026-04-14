import type { TikTokData, MonthKey } from '../../types'
import { MetricCard } from '../shared/MetricCard'
import { ComparisonChart } from '../shared/ComparisonChart'
import { InsightCard } from '../shared/InsightCard'
import { sumMetricOverMonths } from '../../utils/parseSheets'
import { Music2 } from 'lucide-react'

const COLOR = '#69C9D0'

interface Props {
  data: TikTokData
  selectedMonths: MonthKey[]
  compareMonths: MonthKey[]
}

export function TikTokSection({ data, selectedMonths, compareMonths }: Props) {
  const pub = data.publicaciones
  const insightsText = Object.values(data.insights).filter(Boolean)

  const hasData = pub.some(m => Object.keys(m.values).length > 0)

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-4">
          <Music2 size={32} className="text-teal-400" />
        </div>
        <h2 className="text-white font-semibold text-lg mb-2">Datos de TikTok en progreso</h2>
        <p className="text-slate-400 text-sm max-w-md">
          El canal de TikTok tiene estructura preparada para recibir métricas. Los datos se cargarán automáticamente
          cuando se ingresen en el Google Sheet correspondiente.
        </p>
        <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-700 max-w-sm">
          <p className="text-xs text-slate-400 font-medium mb-2">Métricas disponibles cuando se complete el sheet:</p>
          <ul className="text-xs text-slate-500 space-y-1 text-left">
            <li>• Videos publicados por mes</li>
            <li>• Reproducciones e interacciones</li>
            <li>• Crecimiento de seguidores</li>
            <li>• Top 3 videos del período</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Publicaciones</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {pub.map(m => {
            const val = sumMetricOverMonths(m, selectedMonths)
            const prev = compareMonths.length ? sumMetricOverMonths(m, compareMonths) : undefined
            return (
              <MetricCard
                key={m.label}
                label={m.label}
                value={val}
                previousValue={prev || undefined}
                color={COLOR}
                format="raw"
              />
            )
          })}
        </div>
      </section>

      {pub.length > 0 && (
        <ComparisonChart
          metrics={pub}
          selectedMonths={selectedMonths}
          compareMonths={compareMonths}
          color={COLOR}
          title="Métricas por período"
        />
      )}

      <InsightCard
        title="Insights TikTok"
        insights={insightsText.length ? insightsText : ['Los datos de TikTok están siendo recopilados. Próximamente disponibles.']}
        color={COLOR}
      />
    </div>
  )
}
