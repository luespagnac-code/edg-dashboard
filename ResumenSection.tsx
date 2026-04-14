import type { DashboardData, MonthKey } from '../../types'
import { MetricCard } from '../shared/MetricCard'
import { TimeSeriesChart } from '../shared/ComparisonChart'
import { InsightCard } from '../shared/InsightCard'
import { sumMetricOverMonths } from '../../utils/parseSheets'
import { formatCurrency } from '../../utils/formatters'
import { Instagram, Facebook, Music2, BarChart3 } from 'lucide-react'

interface Props {
  data: DashboardData
  selectedMonths: MonthKey[]
  compareMonths: MonthKey[]
}

function PlatformCard({
  icon,
  name,
  color,
  metrics,
}: {
  icon: React.ReactNode
  name: string
  color: string
  metrics: { label: string; value: number; prev?: number; format?: 'compact' | 'currency' | 'percent' | 'raw' }[]
  selectedMonths?: MonthKey[]
  compareMonths?: MonthKey[]
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <h3 className="font-semibold text-white">{name}</h3>
      </div>
      <div className="space-y-3">
        {metrics.map(m => (
          <div key={m.label} className="flex items-center justify-between">
            <span className="text-slate-400 text-sm truncate flex-1">{m.label}</span>
            <div className="text-right ml-2">
              <span className="text-white font-semibold text-sm">
                {m.format === 'currency'
                  ? formatCurrency(m.value)
                  : new Intl.NumberFormat('es-AR').format(m.value)}
              </span>
              {m.prev !== undefined && m.prev > 0 && (
                <span className={`block text-xs ${m.value >= m.prev ? 'text-emerald-400' : 'text-red-400'}`}>
                  {m.value >= m.prev ? '+' : ''}{(((m.value - m.prev) / m.prev) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResumenSection({ data, selectedMonths, compareMonths }: Props) {
  const ig = data.instagram
  const fb = data.facebook
  const ma = data.metaAds

  const getIGMetric = (label: string, months: MonthKey[]) => {
    if (!ig) return 0
    const m = ig.posicionamiento.find(r => r.label.toLowerCase().includes(label.toLowerCase()))
    return m ? sumMetricOverMonths(m, months) : 0
  }

  const getFBMetric = (label: string, months: MonthKey[]) => {
    if (!fb) return 0
    const m = fb.posicionamiento.find(r => r.label.toLowerCase().includes(label.toLowerCase()))
    return m ? sumMetricOverMonths(m, months) : 0
  }

  const totalInvestment = ma
    ? selectedMonths.reduce((acc, m) => acc + (ma.investmentTotal[m] ?? 0), 0)
    : 0
  const prevInvestment = ma && compareMonths.length
    ? compareMonths.reduce((acc, m) => acc + (ma.investmentTotal[m] ?? 0), 0)
    : undefined

  const igReach = getIGMetric('alcanzad', selectedMonths)
  const fbReach = getFBMetric('espect', selectedMonths)
  const totalReach = igReach + fbReach
  const prevIGReach = compareMonths.length ? getIGMetric('alcanzad', compareMonths) : undefined
  const prevFBReach = compareMonths.length ? getFBMetric('espect', compareMonths) : undefined
  const prevTotalReach = prevIGReach !== undefined && prevFBReach !== undefined
    ? prevIGReach + prevFBReach : undefined

  const igViews = getIGMetric('visual', selectedMonths)
  const fbViews = getFBMetric('visual', selectedMonths)
  const totalViews = igViews + fbViews
  const igFollowers = getIGMetric('seguidor', selectedMonths)
  const fbFollowers = getFBMetric('seguidor', selectedMonths)

  const SUMMARY_INSIGHTS = [
    'El alcance combinado de Instagram y Facebook supera los 450K cuentas únicas mensuales en Q1 2025.',
    'Los Reels son el formato líder en engagement tanto en IG como en FB, con mayor tasa de descubrimiento orgánico.',
    'La inversión en Meta Ads aumentó un 52% de febrero a marzo, principalmente por la activación de campañas de Lead Forms para el Proyecto Comercial.',
    'TikTok se encuentra en fase inicial con estructura lista para comenzar a cargar datos mensualmente.',
  ]

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Métricas Globales</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Alcance Total (IG + FB)" value={totalReach} previousValue={prevTotalReach} color="#6366F1" />
          <MetricCard label="Visualizaciones Totales" value={totalViews} previousValue={undefined} color="#6366F1" />
          <MetricCard label="Nuevos Seguidores (IG + FB)" value={igFollowers + fbFollowers} previousValue={undefined} color="#6366F1" format="raw" />
          <MetricCard label="Inversión Meta Ads" value={totalInvestment} previousValue={prevInvestment} color="#0081FB" format="currency" />
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Por Plataforma</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <PlatformCard
            icon={<Instagram size={18} />} name="Instagram" color="#C13584"
            metrics={[
              { label: 'Visualizaciones', value: igViews, prev: compareMonths.length ? getIGMetric('visual', compareMonths) : undefined },
              { label: 'Alcance', value: igReach, prev: prevIGReach },
              { label: 'Clics en bio', value: getIGMetric('bio', selectedMonths), prev: compareMonths.length ? getIGMetric('bio', compareMonths) : undefined },
            ]}
          />
          <PlatformCard
            icon={<Facebook size={18} />} name="Facebook" color="#4267B2"
            metrics={[
              { label: 'Espectadores únicos', value: fbReach, prev: prevFBReach },
              { label: 'Visualizaciones', value: fbViews, prev: compareMonths.length ? getFBMetric('visual', compareMonths) : undefined },
              { label: 'Interacciones', value: getFBMetric('interacci', selectedMonths), prev: compareMonths.length ? getFBMetric('interacci', compareMonths) : undefined },
            ]}
          />
          <PlatformCard
            icon={<Music2 size={18} />} name="TikTok" color="#69C9D0"
            metrics={[{ label: 'En configuración', value: 0 }]}
          />
          <PlatformCard
            icon={<BarChart3 size={18} />} name="Meta Ads" color="#0081FB"
            metrics={[{ label: 'Inversión total', value: totalInvestment, format: 'currency', prev: prevInvestment }]}
          />
        </div>
      </section>

      {ig && (
        <TimeSeriesChart
          metrics={ig.posicionamiento.slice(0, 3)}
          months={selectedMonths.length ? selectedMonths : ['Ene', 'Feb', 'Mar']}
          colors={['#C13584', '#4267B2', '#69C9D0']}
          title="Tendencia IG — Métricas principales"
        />
      )}

      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Insights Generales</h2>
        <InsightCard title="Resumen ejecutivo del período" insights={SUMMARY_INSIGHTS} color="#6366F1" />
      </section>
    </div>
  )
}
