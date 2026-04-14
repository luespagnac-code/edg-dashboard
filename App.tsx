import { useState, useMemo } from 'react'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { MonthSelector } from './components/shared/MonthSelector'
import { ResumenSection } from './components/sections/ResumenSection'
import { InstagramSection } from './components/sections/InstagramSection'
import { FacebookSection } from './components/sections/FacebookSection'
import { TikTokSection } from './components/sections/TikTokSection'
import { MetaAdsSection } from './components/sections/MetaAdsSection'
import { useSheetData } from './hooks/useSheetData'
import type { Section } from './components/Layout/Sidebar'
import type { MonthKey, PeriodType } from './types'
import { ALL_MONTHS } from './types'
import { Loader2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'

const SECTION_TITLES: Record<Section, string> = {
  resumen: 'Resumen General',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  metaads: 'Meta Ads',
}

// Derive which months have any data
function getAvailableMonths(data: ReturnType<typeof useSheetData>['data']): MonthKey[] {
  const months = new Set<MonthKey>()
  const ig = data.instagram
  if (ig) {
    for (const metric of ig.posicionamiento) {
      for (const m of ALL_MONTHS) {
        if (metric.values[m] !== undefined) months.add(m)
      }
    }
  }
  const fb = data.facebook
  if (fb) {
    for (const metric of fb.posicionamiento) {
      for (const m of ALL_MONTHS) {
        if (metric.values[m] !== undefined) months.add(m)
      }
    }
  }
  // If nothing found, show first 3
  if (months.size === 0) return ['Ene', 'Feb', 'Mar']
  return ALL_MONTHS.filter(m => months.has(m))
}

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('resumen')
  const [selectedMonths, setSelectedMonths] = useState<MonthKey[]>(['Ene', 'Feb', 'Mar'])
  const [compareMonths, setCompareMonths] = useState<MonthKey[]>([])
  const [periodType, setPeriodType] = useState<PeriodType>('monthly')
  const [selectorOpen, setSelectorOpen] = useState(false)

  const { data, loading, error, lastUpdated, refresh } = useSheetData()
  const availableMonths = useMemo(() => getAvailableMonths(data), [data])

  const renderSection = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 size={40} className="text-indigo-400 animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Cargando datos desde Google Sheets…</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <p className="text-white font-semibold mb-2">Error al cargar datos</p>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )
    }

    const months = selectedMonths.length ? selectedMonths : availableMonths
    const props = { selectedMonths: months, compareMonths }

    switch (activeSection) {
      case 'resumen':
        return <ResumenSection data={data} {...props} />
      case 'instagram':
        return data.instagram
          ? <InstagramSection data={data.instagram} {...props} />
          : <EmptyState platform="Instagram" />
      case 'facebook':
        return data.facebook
          ? <FacebookSection data={data.facebook} {...props} />
          : <EmptyState platform="Facebook" />
      case 'tiktok':
        return data.tiktok
          ? <TikTokSection data={data.tiktok} {...props} />
          : <EmptyState platform="TikTok" />
      case 'metaads':
        return data.metaAds
          ? <MetaAdsSection data={data.metaAds} {...props} />
          : <EmptyState platform="Meta Ads" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Sidebar active={activeSection} onSelect={s => { setActiveSection(s); setSelectorOpen(false) }} />

      <div className="ml-56 min-h-screen flex flex-col">
        <Header
          title={SECTION_TITLES[activeSection]}
          selectedMonths={selectedMonths}
          compareMonths={compareMonths}
          lastUpdated={lastUpdated}
          onRefresh={refresh}
          loading={loading}
        />

        <main className="flex-1 p-6 space-y-4">
          {/* Month selector toggle */}
          <div>
            <button
              onClick={() => setSelectorOpen(o => !o)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-2"
            >
              {selectorOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {selectorOpen ? 'Ocultar selector de período' : 'Seleccionar período / comparar'}
            </button>
            {selectorOpen && (
              <MonthSelector
                selectedMonths={selectedMonths}
                onChangeMonths={setSelectedMonths}
                periodType={periodType}
                onChangePeriodType={setPeriodType}
                compareMonths={compareMonths}
                onChangeCompare={setCompareMonths}
                availableMonths={availableMonths}
              />
            )}
          </div>

          {/* Section content */}
          {renderSection()}
        </main>
      </div>
    </div>
  )
}

function EmptyState({ platform }: { platform: string }) {
  return (
    <div className="flex items-center justify-center py-32">
      <p className="text-slate-500">No hay datos disponibles para {platform}</p>
    </div>
  )
}
