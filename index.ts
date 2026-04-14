export type MonthKey = 'Ene' | 'Feb' | 'Mar' | 'Abr' | 'May' | 'Jun' | 'Jul' | 'Ago' | 'Sep' | 'Oct' | 'Nov' | 'Dic'

export const ALL_MONTHS: MonthKey[] = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

export const MONTH_LABELS: Record<MonthKey, string> = {
  Ene: 'Enero',
  Feb: 'Febrero',
  Mar: 'Marzo',
  Abr: 'Abril',
  May: 'Mayo',
  Jun: 'Junio',
  Jul: 'Julio',
  Ago: 'Agosto',
  Sep: 'Septiembre',
  Oct: 'Octubre',
  Nov: 'Noviembre',
  Dic: 'Diciembre',
}

export type MonthData = Partial<Record<MonthKey, number>>

export interface MetricRow {
  label: string
  values: MonthData
}

export interface SheetSection {
  name: string
  metrics: MetricRow[]
  insights: string[]
}

// ─── Instagram ────────────────────────────────────────────────────────────────

export interface TopContent {
  name: string
  views: number
  likes: number
  month: MonthKey
}

export interface InstagramData {
  posicionamiento: MetricRow[]
  audiencia: MetricRow[]
  topContent: TopContent[]
  insights: Record<string, string>
}

// ─── Facebook ─────────────────────────────────────────────────────────────────

export interface FacebookData {
  posicionamiento: MetricRow[]
  audiencia: MetricRow[]
  topContent: TopContent[]
  insights: Record<string, string>
}

// ─── TikTok ───────────────────────────────────────────────────────────────────

export interface TikTokData {
  publicaciones: MetricRow[]
  topVideos: TopContent[]
  insights: Record<string, string>
}

// ─── Meta Ads ─────────────────────────────────────────────────────────────────

export interface AdsCampaign {
  name: string
  stage: 'TOFU' | 'MOFU' | 'BOFU'
  metrics: MetricRow[]
}

export interface MetaAdsData {
  investmentTotal: MonthData
  campaigns: AdsCampaign[]
  insights: Record<string, string>
}

// ─── Resumen ──────────────────────────────────────────────────────────────────

export interface ResumenData {
  marcaIG: MetricRow[]
  marcaFB: MetricRow[]
  centro: MetricRow[]
  proyecto: MetricRow[]
}

// ─── Full Dashboard Data ──────────────────────────────────────────────────────

export interface DashboardData {
  instagram: InstagramData | null
  facebook: FacebookData | null
  tiktok: TikTokData | null
  metaAds: MetaAdsData | null
  resumen: ResumenData | null
}

// ─── Period Comparison ────────────────────────────────────────────────────────

export type PeriodType = 'monthly' | 'quarterly' | 'biannual'

export interface Period {
  label: string
  months: MonthKey[]
}

export const QUARTERS: Period[] = [
  { label: 'Q1 (Ene-Mar)', months: ['Ene', 'Feb', 'Mar'] },
  { label: 'Q2 (Abr-Jun)', months: ['Abr', 'May', 'Jun'] },
  { label: 'Q3 (Jul-Sep)', months: ['Jul', 'Ago', 'Sep'] },
  { label: 'Q4 (Oct-Dic)', months: ['Oct', 'Nov', 'Dic'] },
]

export const BIANNUAL: Period[] = [
  { label: 'H1 (Ene-Jun)', months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'] },
  { label: 'H2 (Jul-Dic)', months: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'] },
]
