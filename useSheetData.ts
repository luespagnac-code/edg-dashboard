import { useState, useEffect, useCallback } from 'react'
import type { DashboardData } from '../types'
import {
  parseInstagram,
  parseFacebook,
  parseTikTok,
  parseMetaAds,
  parseResumen,
} from '../utils/parseSheets'

const SHEET_ID = '1nLe9F1O3_wHavg6-jum8H8ATzHgPkC2z'

const GID = {
  resumen: '1015862116',
  instagram: '910282513',
  facebook: '706536454',
  tiktok: '1935357886',
  metaAds: '809679087',
}

function sheetUrl(gid: string) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`
}

async function fetchCSV(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

export function useSheetData() {
  const [data, setData] = useState<DashboardData>({
    instagram: null,
    facebook: null,
    tiktok: null,
    metaAds: null,
    resumen: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [igCsv, fbCsv, ttCsv, maCsv, resCsv] = await Promise.all([
        fetchCSV(sheetUrl(GID.instagram)),
        fetchCSV(sheetUrl(GID.facebook)),
        fetchCSV(sheetUrl(GID.tiktok)),
        fetchCSV(sheetUrl(GID.metaAds)),
        fetchCSV(sheetUrl(GID.resumen)),
      ])

      setData({
        instagram: parseInstagram(igCsv),
        facebook: parseFacebook(fbCsv),
        tiktok: parseTikTok(ttCsv),
        metaAds: parseMetaAds(maCsv),
        resumen: parseResumen(resCsv),
      })
      setLastUpdated(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, lastUpdated, refresh: load }
}
