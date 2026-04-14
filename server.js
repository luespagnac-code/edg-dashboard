import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const app = express()
const PORT = process.env.PORT || 3000
const __dirname = dirname(fileURLToPath(import.meta.url))
const SHEET_ID = '1nLe9F1O3_wHavg6-jum8H8ATzHgPkC2z'

// Proxy hacia Google Sheets — sin CORS
app.get('/api/sheet/:gid', async (req, res) => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv&gid=${req.params.gid}`
  try {
    const response = await fetch(url)
    const csv = await response.text()
    res.setHeader('Content-Type', 'text/csv')
    res.send(csv)
  } catch {
    res.status(500).send('Error al obtener datos')
  }
})

// Sirve el frontend
app.use(express.static(join(__dirname, 'dist')))
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
