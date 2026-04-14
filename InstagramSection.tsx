import type { InstagramData, MonthKey } from '../../types'
import { MetricCard } from '../shared/MetricCard'
import { ComparisonChart, TimeSeriesChart } from '../shared/ComparisonChart'
import { InsightCard } from '../shared/InsightCard'
import { sumMetricOverMonths } from '../../utils/parseSheets'

const COLOR = '#C13584'
const COLORS = ['#C13584', '#E1306C', '#F77737', '#FCAF45', '#405DE6']

interface Props {
  data: InstagramData
  selectedMonths: MonthKey[]
  compareMonths: MonthKey[]
}

const STATIC_INSIGHTS = [
  { title: 'Enero', text: 'El contenido de oficios generó mayor alcance orgánico. Se recomienda continuar con temáticas de impacto social.' },
  { title: 'Febrero', text: 'Los Reels son el principal mecanismo de descubrimiento. Aumento del 23% en engagement respecto a enero.' },
  { title: 'Marzo', text: 'Crecimiento notable en seguidores (+66). Se recomienda mantener 3-4 publicaciones semanales y reforzar llamadas a la acción.' },
]

export function InstagramSection({ data, selectedMonths, compareMonths }: Props) {
  const posic = data.posicionamiento
  const audiencia = data.audiencia

  const getMetricValue = (label: string, months: MonthKey[]) => {
    const m = posic.find(r => r.label.toLowerCase().includes(label.toLowerCase()))
    if (!m || !months.length) return 0
    return sumMetricOverMonths(m, months)
  }

  const getPrev = (label: string) => {
    if (!compareMonths.length) return undefined
    return getMetricValue(label, compareMonths) || undefined
  }

  const views = getMetricValue('visual', selectedMonths)
  const reach = getMetricValue('alcanzad', selectedMonths)
  const followers = getMetricValue('seguidor', selectedMonths)
  const profileVisits = getMetricValue('visitas', selectedMonths)
  const bioClicks = getMetricValue('bio', selectedMonths)
  const interactions = getMetricValue('interacci', selectedMonths)

  const insightsText = Object.values(data.insights).filter(Boolean)

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Posicionamiento de Marca
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetricCard label="Visualizaciones" value={views} previousValue={getPrev('visual')} color={COLOR} />
          <MetricCard label="Cuentas Alcanzadas" value={reach} previousValue={getPrev('alcanzad')} color={COLOR} />
          <MetricCard label="Crecimiento Seguidores" value={followers} previousValue={getPrev('seguidor')} color={COLOR} format="raw" />
          <MetricCard label="Visitas al Perfil" value={profileVisits} previousValue={getPrev('visitas')} color={COLOR} />
          <MetricCard label="Clics en Bio" value={bioClicks} previousValue={getPrev('bio')} color={COLOR} />
          <MetricCard label="Interacciones" value={interactions} previousValue={getPrev('interacci')} color={COLOR} />
        </div>
      </section>

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
          title="Evolución de métricas principales"
        />
      </div>

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
              color="#E1306C"
              title="Interacciones por tipo"
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
                    color="#E1306C"
                    format="raw"
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}

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
                <p className="text-xs font-semibold text-pink-400 mb-1">{item.title}</p>
                <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
