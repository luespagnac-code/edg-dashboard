import Papa from 'papaparse'
import type {
  MonthKey,
  MonthData,
  MetricRow,
  InstagramData,
  FacebookData,
  TikTokData,
  MetaAdsData,
  ResumenData,
  TopContent,
  AdsCampaign,
} from '../types'
import { ALL_MONTHS } from '../types'

// ─── CSV Helpers ──────────────────────────────────────────────────────────────

function parseCSV(csvText: string): string[][] {
  const result = Papa.parse<string[]>(csvText, { skipEmptyLines: false })
  return result.data
}

function parseNum(val: string | undefined): number | null {
  if (!val) return null
  const cleaned = val.replace(/[$,%\s]/g, '').replace(/,/g, '')
  const n = parseFloat(cleaned)
  return isNaN(n) ? null : n
}

function findMonthIndices(rows: string[][]): Record<MonthKey, number> {
  const indices: Partial<Record<MonthKey, number>> = {}
  for (const row of rows) {
    for (const month of ALL_MONTHS) {
      if (indices[month] !== undefined) continue
      const idx = row.findIndex(cell => cell.trim() === month)
      if (idx !== -1) indices[month] = idx
    }
    if (ALL_MONTHS.every(m => indices[m] !== undefined)) break
  }
  return indices as Record<MonthKey, number>
}

function extractValues(row: string[], monthIndices: Record<MonthKey, number>): MonthData {
  const values: MonthData = {}
  for (const month of ALL_MONTHS) {
    const idx = monthIndices[month]
    if (idx === undefined) continue
    const n = parseNum(row[idx])
    if (n !== null) values[month] = n
  }
  return values
}

function isHeader(row: string[]): boolean {
  const first = row[0]?.trim() ?? ''
  if (!first || first.length < 3) return false
  const hasAnyNum = row.slice(1).some(v => parseNum(v) !== null)
  return !hasAnyNum
}

// Groups rows into sections. A section starts when isHeader() is true.
function groupSections(rows: string[][], monthIndices: Record<MonthKey, number>) {
  const sections: { name: string; rows: string[][] }[] = []
  let current: { name: string; rows: string[][] } | null = null

  for (const row of rows) {
    const first = row[0]?.trim() ?? ''
    if (!first) continue

    if (isHeader(row) && ALL_MONTHS.every(m => !row.includes(m))) {
      current = { name: first, rows: [] }
      sections.push(current)
    } else if (current) {
      // Skip the month-header row
      if (ALL_MONTHS.some(m => row.includes(m))) continue
      current.rows.push(row)
    }
  }

  return sections.map(s => ({
    name: s.name,
    metrics: s.rows
      .filter(r => r[0]?.trim())
      .map(r => ({
        label: r[0].trim(),
        values: extractValues(r, monthIndices),
      }))
      .filter(m => Object.keys(m.values).length > 0),
    insights: s.rows
      .filter(r => {
        const f = r[0]?.trim() ?? ''
        return f.length > 60 && Object.values(extractValues(r, monthIndices)).length === 0
      })
      .map(r => r[0].trim()),
  }))
}

// ─── Instagram Parser ──────────────────────────────────────────────────────────

export function parseInstagram(csvText: string): InstagramData {
  const rows = parseCSV(csvText)
  const monthIndices = findMonthIndices(rows)
  const sections = groupSections(rows, monthIndices)

  const posicionamiento =
    sections.find(s => s.name.toUpperCase().includes('POSICIONAMIENTO'))?.metrics ?? []
  const audiencia =
    sections.find(s => s.name.toUpperCase().includes('P') && !s.name.toUpperCase().includes('POSICION'))
      ?.metrics ??
    sections.filter(s => !s.name.toUpperCase().includes('POSICIONAMIENTO') && !s.name.toUpperCase().includes('MEJOR'))[0]?.metrics ?? []

  // Top content: look for sections with content names
  const topContent: TopContent[] = []
  for (const section of sections) {
    if (section.name.toUpperCase().includes('MEJOR') || section.name.toUpperCase().includes('CONTENT')) {
      for (const metric of section.metrics) {
        for (const month of ALL_MONTHS) {
          const v = metric.values[month]
          if (v !== undefined) {
            topContent.push({ name: metric.label, views: v, likes: 0, month })
          }
        }
      }
    }
  }

  const insights: Record<string, string> = {}
  for (const section of sections) {
    for (const insight of section.insights) {
      insights[section.name] = insight
    }
  }

  return { posicionamiento, audiencia, topContent, insights }
}

// ─── Facebook Parser ───────────────────────────────────────────────────────────

export function parseFacebook(csvText: string): FacebookData {
  const rows = parseCSV(csvText)
  const monthIndices = findMonthIndices(rows)
  const sections = groupSections(rows, monthIndices)

  const posicionamiento =
    sections.find(s => s.name.toUpperCase().includes('POSICIONAMIENTO'))?.metrics ?? []

  const audienciaSections = sections.filter(
    s => !s.name.toUpperCase().includes('POSICIONAMIENTO') && !s.name.toUpperCase().includes('MEJOR'),
  )
  const audiencia = audienciaSections[0]?.metrics ?? []

  const topContent: TopContent[] = []
  const insights: Record<string, string> = {}
  for (const section of sections) {
    for (const insight of section.insights) {
      insights[section.name] = insight
    }
  }

  return { posicionamiento, audiencia, topContent, insights }
}

// ─── TikTok Parser ─────────────────────────────────────────────────────────────

export function parseTikTok(csvText: string): TikTokData {
  const rows = parseCSV(csvText)
  const monthIndices = findMonthIndices(rows)
  const sections = groupSections(rows, monthIndices)

  const publicaciones = sections[0]?.metrics ?? []
  const insights: Record<string, string> = {}
  for (const section of sections) {
    for (const insight of section.insights) {
      insights[section.name] = insight
    }
  }

  return { publicaciones, topVideos: [], insights }
}

// ─── Meta Ads Parser ───────────────────────────────────────────────────────────

export function parseMetaAds(csvText: string): MetaAdsData {
  const rows = parseCSV(csvText)
  const monthIndices = findMonthIndices(rows)

  // Find investment total row
  const investmentTotal: MonthData = {}
  for (const row of rows) {
    const label = row[0]?.trim().toLowerCase() ?? ''
    if (label.includes('inversi') && label.includes('total')) {
      const vals = extractValues(row, monthIndices)
      Object.assign(investmentTotal, vals)
      break
    }
  }

  const campaigns: AdsCampaign[] = []
  let currentCampaign: AdsCampaign | null = null

  const stageMap: Record<string, 'TOFU' | 'MOFU' | 'BOFU'> = {
    TOFU: 'TOFU',
    MOFU: 'MOFU',
    BOFU: 'BOFU',
  }

  for (const row of rows) {
    const first = row[0]?.trim() ?? ''
    if (!first) continue

    const upper = first.toUpperCase()
    const stage = Object.entries(stageMap).find(([key]) => upper.includes(key))?.[1]

    if (stage && isHeader(row)) {
      // Detect campaign name (everything after "TOFU —" or similar)
      const namePart = first.replace(/TOFU\s*[-–—]?\s*/i, '').replace(/MOFU\s*[-–—]?\s*/i, '').replace(/BOFU\s*[-–—]?\s*/i, '').trim()
      currentCampaign = { name: namePart || first, stage, metrics: [] }
      campaigns.push(currentCampaign)
    } else if (currentCampaign && !ALL_MONTHS.some(m => row.includes(m))) {
      const vals = extractValues(row, monthIndices)
      if (Object.keys(vals).length > 0) {
        currentCampaign.metrics.push({ label: first, values: vals })
      }
    }
  }

  const insights: Record<string, string> = {}
  for (const row of rows) {
    const first = row[0]?.trim() ?? ''
    if (first.length > 80 && Object.values(extractValues(row, monthIndices)).length === 0) {
      insights['general'] = first
    }
  }

  return { investmentTotal, campaigns, insights }
}

// ─── Resumen Parser ────────────────────────────────────────────────────────────

export function parseResumen(csvText: string): ResumenData {
  const rows = parseCSV(csvText)
  const monthIndices = findMonthIndices(rows)
  const sections = groupSections(rows, monthIndices)

  const marcaSection = sections.find(s => s.name.toUpperCase().includes('MARCA') || s.name.toUpperCase().includes('POSICION'))
  const centroSection = sections.find(s => s.name.toUpperCase().includes('CENTRO'))
  const proyectoSection = sections.find(s => s.name.toUpperCase().includes('PROYECTO') || s.name.toUpperCase().includes('COMERCIAL'))

  const allMetrics = marcaSection?.metrics ?? []
  const marcaIG = allMetrics.filter(m => m.label.toUpperCase().startsWith('IG'))
  const marcaFB = allMetrics.filter(m => m.label.toUpperCase().startsWith('FB'))

  return {
    marcaIG: marcaIG.length ? marcaIG : allMetrics.slice(0, 3),
    marcaFB: marcaFB.length ? marcaFB : allMetrics.slice(3),
    centro: centroSection?.metrics ?? [],
    proyecto: proyectoSection?.metrics ?? [],
  }
}

// ─── Aggregation helpers ────────────────────────────────────────────────────────

export function sumMetricOverMonths(metric: MetricRow, months: MonthKey[]): number {
  return months.reduce((acc, m) => acc + (metric.values[m] ?? 0), 0)
}

export function avgMetricOverMonths(metric: MetricRow, months: MonthKey[]): number {
  const vals = months.map(m => metric.values[m]).filter((v): v is number => v !== undefined)
  if (!vals.length) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}
