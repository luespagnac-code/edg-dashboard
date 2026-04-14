import type { FacebookData, MonthKey } from '../../types'
import { MetricCard } from '../shared/MetricCard'
import { ComparisonChart, TimeSeriesChart } from '../shared/ComparisonChart'
import { InsightCard } from '../shared/InsightCard'
import { sumMetricOverMonths } from '../../utils/parseSheets'

const COLOR = '#4267B2'
const COLORS = ['#4267B2', '#1877F2', '#42B72A', '#F7B928', '#E84C4C']

interface Props {
  data: FacebookData
  selectedMonths: MonthKey[]
  compareMonths: MonthKey[]
}

const STATIC_INSIGHTS = [
  { title: 'Enero', text: 'Fuerte alcance orgánico por contenido de oficios. Los Reels continúan siendo el principal driver de exposición.' },
  { title: 'Febrero', text: 'Mayor calidad en el consumo de contenido a pesar de menor volumen de exposición. Aumento del 29% en interacciones.' },
  { title: 'Marzo', text: 'Crecimiento de seguidores de +193. Recomendación: aumentar frecuencia de publicación a 3-4 posts semanales.' },
]

export function FacebookSection({ data, selectedMonths, compareMonths }: Props) {
  const posic = data.posicionamiento
  const audiencia = data.audiencia

  const getMetricValue = (label: string, months: MonthKey[]) => {
    const m = posic.find(r => r.label.toLowerCase().includes(label.toLowerCase()))
    if (!m || !months.length) return 0
    return sumMetricOverMonths(m, months)
  }

  const getPrev = (label: string) =>
    compareMonths.length ? (getMetricValue(label, compareMonths) || undefined) : undefined

  const viewers = getMetricValue('espect', selectedMonths)
  const views = getMetricValue('visual', selectedMonths)
  const followers = getMetricValue('seguidor', selectedMonths)
  const interactions = getMetricValue('interacci', selectedMonths)

  const insightsText = Object.values(data.insights).filter(Boolean)

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Posicionamiento de Marca
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Espectadores Únicos" value={viewers} previousValue={getPrev('espect')} color={COLOR} />
          <MetricCard label="Visualizaciones Totales" value={views} previousValue={getPrev('visual')} color={COLOR} />
          <MetricCard label="Crecimiento Seguidores" value={followers} previousValue={getPrev('seguidor')} color={COLOR} format="raw" />
          <MetricCard label="Interacciones Totales" value={interactions} previousValue={getPrev('interacci')} color={COLOR} />
        </div>
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ComparisonChart
          metrics={posic}
          selectedMonths={selectedMonths}
          compareMonths={compareMonths}
          color={COLOR}
          title="Posicionamiento — Comparación"
        />
        <TimeSeriesChart
          metrics={posic.slice(0, 3)}
          months={selectedMonths.length ? selectedMonths : ['Ene', 'Feb', 'Mar']}
          colors={COLORS}
          title="Evolución mensual"
        />
      </div>

      {/* Audience */}
      {audiencia.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Generación de Públicos
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ComparisonChart
              metrics={audiencia}
              selectedMonths={selectedMonths}
              compareMonths={compareMonths}
              color="#1877F2"
              title="Interacciones por formato"
              maxMetrics={8}
            />
            <div className="grid grid-cols-2 gap-3">
              {audiencia.slice(0, 4).map(m => {
                const val = sumMetricOverMonths(m, selectedMonths)
                const prev = compareMonths.length ? sumMetricOverMonths(m, compareMonths) : undefined
                return (
                  <MetricCard
                    key={m.label}
                    label={m.label}
                    value={val}
                    previousValue={prev || undefined}
                    color="#1877F2"
                    format="raw"
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Insights */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Insights y Recomendaciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard
            title="Insights del período"
            insights={insightsText.length ? insightsText : STATIC_INSIGHTS.map(i => `${i.title}: ${i.text}`)}
            type="insight"
            color={COLOR}
          />
          <div className="space-y-3">
            {STATIC_INSIGHTS.map(item => (
              <div key={item.title} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <p className="text-xs font-semibold text-blue-400 mb-1">{item.title}</p>
                <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
