import type { Area } from './types'

export function getRiskColor(risk: number): string {
  if (risk >= 75) return '#ff2d55'
  if (risk >= 50) return '#ff9f0a'
  if (risk >= 30) return '#ffd60a'
  return '#30d158'
}

export function getRiskLabel(risk: number): string {
  if (risk >= 75) return 'Critical'
  if (risk >= 50) return 'High'
  if (risk >= 30) return 'Moderate'
  return 'Low'
}

export function getRiskBg(risk: number): string {
  if (risk >= 75) return 'rgba(255,45,85,0.12)'
  if (risk >= 50) return 'rgba(255,159,10,0.12)'
  if (risk >= 30) return 'rgba(255,214,10,0.12)'
  return 'rgba(48,209,88,0.12)'
}

export function generateHeatPoints(areas: Area[]): [number, number, number][] {
  const pts: [number, number, number][] = []
  areas.forEach(a => {
    const count = Math.round(a.risk * 2.5)
    const spread = a.risk > 70 ? 0.015 : a.risk > 40 ? 0.012 : 0.008
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * spread
      const lat = a.lat + Math.sin(angle) * r
      const lng = a.lng + Math.cos(angle) * r * (1 / Math.cos(a.lat * Math.PI / 180))
      const intensity = 0.3 + Math.random() * 0.7 * (a.risk / 100)
      pts.push([lat, lng, intensity])
    }
  })
  // corridor noise between connected high-risk areas
  const corridors = [
    { from: [28.6448, 77.2120], to: [28.6506, 77.2301], n: 40 },
    { from: [28.6506, 77.2301], to: [28.6770, 77.2720], n: 35 },
    { from: [28.6730, 77.2910], to: [28.6930, 77.3120], n: 30 },
    { from: [28.7060, 77.0690], to: [28.7280, 77.1700], n: 25 },
    { from: [28.6519, 77.1905], to: [28.6315, 77.2167], n: 20 },
    { from: [28.5700, 77.2430], to: [28.5310, 77.2710], n: 25 },
  ]
  corridors.forEach(c => {
    for (let i = 0; i < c.n; i++) {
      const t = Math.random()
      const lat = c.from[0]! + (c.to[0]! - c.from[0]!) * t + (Math.random() - 0.5) * 0.005
      const lng = c.from[1]! + (c.to[1]! - c.from[1]!) * t + (Math.random() - 0.5) * 0.005
      pts.push([lat, lng, 0.2 + Math.random() * 0.4])
    }
  })
  return pts
}

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3
  const p1 = lat1 * Math.PI / 180
  const p2 = lat2 * Math.PI / 180
  const dp = (lat2 - lat1) * Math.PI / 180
  const dl = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return Math.round(meters) + 'm'
  return (meters / 1000).toFixed(1) + 'km'
}
