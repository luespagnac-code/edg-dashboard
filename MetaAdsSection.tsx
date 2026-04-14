import type { MetaAdsData, MonthKey } from '../../types'
import { MetricCard } from '../shared/MetricCard'
import { ComparisonChart } from '../shared/ComparisonChart'
import { InsightCard } from '../shared/InsightCard'
import { sumMetricOverMonths } from '../../utils/parseSheets'
import { formatCurrency } from '../../utils/formatters'

const COLOR = '#0081FB'
const STAGE_COLORS: Record<string, string> = {
  TOFU: '#0081FB',
  MOFU: '#F06B3F',
  BOFU: '#10B981',
}
const STAGE_LABELS: Record<string, string> = {
  TOFU: 'Top of Funnel',
  MOFU: 'Middle of Funnel',
  BOFU: 'Bottom of Funnel',
}

interface Props {
  data: MetaAdsData
  selectedMonths: MonthKey[]
  compareMonths: MonthKey[]
}

export function MetaAdsSection({ data, selectedMonths, compareMonths }: Props) {
  const { investmentTotal, campaigns, insights } = data
  const insightsText = Object.values(insights).filter(Boolean)

  const totalInvestment = selectedMonths.reduce((acc, m) => acc + (investmentTotal[m] ?? 0), 0)
  const prevInvestment = compareMonths.length
    ? compareMonths.reduce((acc, m) => acc + (investmentTotal[m] ?? 0), 0)
    : undefined

  const stages = ['TOFU', 'MOFU', 'BOFU'] as const

  return (
    <div className="space-y-6">
      {/* Investment summary */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Inversión Total
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <MetricCard
            label="Inversión Total"
            value={totalInvestment}
            previousValue={prevInvestment}
            color={COLOR}
            format="currency"
          />
          {stages.map(stage => {
            const stageCampaigns = campaigns.filter(c => c.stage === stage)
            const invMetric = stageCampaigns
              .flatMap(c => c.metrics)
              .find(m => m.label.toLowerCase().includes('inversi'))
            const val = invMetric ? sumMetricOverMonths(invMetric, selectedMonths) : 0
            const prev = invMetric && compareMonths.length ? sumMetricOverMonths(invMetric, compareMonths) : undefined
            return (
              <MetricCard
                key={stage}
                label={`${stage} — ${STAGE_LABELS[stage]}`}
                value={val}
                previousValue={prev || undefined}
                color={STAGE_COLORS[stage]}
                format="currency"
              />
            )
          })}
        </div>
      </section>

      {/* Campaigns by stage */}
      {stages.map(stage => {
        const stageCampaigns = campaigns.filter(c => c.stage === stage)
        if (!stageCampaigns.length) return null

        const stageColor = STAGE_COLORS[stage]

        return (
          <section key={stage}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stageColor }} />
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {stage} — {STAGE_LABELS[stage]}
              </h2>
            </div>
            {stageCampaigns.map(campaign => {
              const keyMetrics = campaign.metrics.filter(m => {
                const l = m.label.toLowerCase()
                return l.includes('cpa') || l.includes('alcance') || l.includes('reach') ||
                  l.includes('impresion') || l.includes('impression') || l.includes('mensajes') ||
                  l.includes('leads') || l.includes('thruplay') || l.includes('ctr') || l.includes('cpm')
              })

              return (
                <div key={campaign.name} className="mb-4">
                  <p className="text-sm font-semibold text-white mb-3">
                    {campaign.name || `Campaña ${stage}`}
                  </p>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {keyMetrics.slice(0, 6).map(m => {
                        const val = sumMetricOverMonths(m, selectedMonths)
                        const prev = compareMonths.length ? sumMetricOverMonths(m, compareMonths) : undefined
                        const isCurrency = m.label.toLowerCase().includes('cpa') || m.label.toLowerCase().includes('inversi') || m.label.toLowerCase().includes('cpm')
                        const isPercent = m.label.toLowerCase().includes('ctr')
                        return (
                          <MetricCard
                            key={m.label}
                            label={m.label}
                            value={val}
                            previousValue={prev || undefined}
                            color={stageColor}
                            format={isCurrency ? 'currency' : isPercent ? 'percent' : 'compact'}
                          />
                        )
                      })}
                    </div>
                    {campaign.metrics.length > 0 && (
                      <ComparisonChart
                        metrics={campaign.metrics.filter(m => {
                          const l = m.label.toLowerCase()
                          return l.includes('reach') || l.includes('alcance') || l.includes('impresion') ||
                            l.includes('mensajes') || l.includes('leads') || l.includes('thruplay')
                        })}
                        selectedMonths={selectedMonths}
                        compareMonths={compareMonths}
                        color={stageColor}
                        title={`${campaign.name || stage} — Métricas de alcance`}
                        maxMetrics={4}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}

      {/* Insights */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Insights y Recomendaciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard
            title="Observaciones Meta Ads"
            insights={
              insightsText.length
                ? insightsText
                : [
                    'Enero–Febrero: Inversión principal en TOFU (Tráfico a IG) y BOFU (Retargeting mensajes). CPA de mensajes estable en $16-22.',
                    'Marzo: Activación de campaña de Lead Forms para Proyecto Comercial. BOFU pausado. Inversión aumentada a $10,808.',
                    'Recomendación: Analizar tasa de cierre comercial y ajustar presupuesto entre MOFU y BOFU según resultados.',
                  ]
            }
            color={COLOR}
          />
          <div className="space-y-3">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-xs font-semibold text-blue-400 mb-2">Resumen de inversión</p>
              <div className="space-y-2">
                {(['Ene', 'Feb', 'Mar'] as MonthKey[]).map(m => (
                  investmentTotal[m] !== undefined && (
                    <div key={m} className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{m}</span>
                      <span className="text-white font-medium text-sm">
                        {formatCurrency(investmentTotal[m]!)}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-xs font-semibold text-orange-400 mb-2">Próximos pasos</p>
              <ul className="space-y-1.5">
                <li className="text-slate-300 text-sm">• Análisis proceso comercial para leads del proyecto</li>
                <li className="text-slate-300 text-sm">• Solicitar materiales creativos actualizados</li>
                <li className="text-slate-300 text-sm">• Evaluar activar retargeting para Lead Forms</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
