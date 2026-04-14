import { Lightbulb, MessageSquare } from 'lucide-react'

interface InsightCardProps {
  title: string
  insights: string[]
  type?: 'insight' | 'comment'
  color?: string
}

export function InsightCard({ title, insights, type = 'insight', color = '#6366F1' }: InsightCardProps) {
  if (!insights.length) return null

  const Icon = type === 'insight' ? Lightbulb : MessageSquare

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <ul className="space-y-3">
        {insights.map((text, i) => (
          <li key={i} className="flex gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface StaticInsightsProps {
  items: { title: string; text: string }[]
  color?: string
}

export function StaticInsights({ items, color = '#6366F1' }: StaticInsightsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.title}</p>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
        </div>
      ))}
    </div>
  )
}
