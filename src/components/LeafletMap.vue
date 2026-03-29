<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import type { Area, TimeFilter, CrimeCategory } from '@/data/types'
import { getRiskColor } from '@/data/helpers'
import { safeSpots } from '@/data/safeSpots'
import { riotZones } from '@/data/riotZones'
import { policeStations } from '@/data/policeStations'

declare const L: any

const props = defineProps<{
  areas: Area[]
  timeFilter: TimeFilter
  crimeFilter: CrimeCategory
  showPoliceStations: boolean
}>()

const emit = defineEmits<{
  'area-click': [area: Area]
}>()

let map: any = null
let heatLayer: any = null
let circleMarkers: any[] = []
let safeSpotLayerGroup: any = null
let riotLayerGroup: any = null
let policeLayerGroup: any = null

function initMap() {
  map = L.map('leaflet-map', {
    center: [28.6139, 77.2090],
    zoom: 12,
    minZoom: 10,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: false,
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map)

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  rebuildLayers()
  addSafeSpots()
  addRiotZones()
  addPoliceStations()
}

function rebuildLayers() {
  if (!map) return

  // Remove old heatmap
  if (heatLayer) map.removeLayer(heatLayer)
  circleMarkers.forEach(m => map.removeLayer(m))
  circleMarkers = []

  // Build filtered heatmap
  const heatPoints = generateFilteredHeatPoints(props.areas, props.timeFilter, props.crimeFilter)
  heatLayer = L.heatLayer(heatPoints, {
    radius: 28,
    blur: 22,
    maxZoom: 16,
    max: 1,
    minOpacity: 0.35,
    gradient: {
      0.0: 'transparent',
      0.15: '#7a0177',
      0.35: '#c51b8a',
      0.5: '#e31a8c',
      0.65: '#fd8d3c',
      0.8: '#fecc5c',
      0.95: '#ffffb2',
      1.0: '#ffffee',
    },
  }).addTo(map)

  // Circle markers
  for (const area of props.areas) {
    const color = getRiskColor(area.risk)
    const radius = area.risk > 70 ? Math.max(600, area.risk * 9) : area.risk > 40 ? 500 : 350
    const baseFillOpacity = area.risk >= 75 ? 0.18 : area.risk >= 50 ? 0.14 : area.risk >= 30 ? 0.10 : 0.08

    const circle = L.circle([area.lat, area.lng], {
      radius,
      color,
      fillColor: color,
      fillOpacity: baseFillOpacity,
      weight: 1.5,
      opacity: 0.4,
    }).addTo(map)

    circle.on('mouseover', function (this: any) {
      this.setStyle({ fillOpacity: baseFillOpacity + 0.15, weight: 2.5, opacity: 0.7 })
    })
    circle.on('mouseout', function (this: any) {
      this.setStyle({ fillOpacity: baseFillOpacity, weight: 1.5, opacity: 0.4 })
    })

    circle.bindPopup(
      `<div style="font-family:'Space Grotesk',sans-serif">` +
      `<div style="font-weight:700;font-size:14px;margin-bottom:2px">${area.name}</div>` +
      `<div style="font-size:11px;color:#8a8aa4;margin-bottom:4px">${area.district} District</div>` +
      `<div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;color:${color}">Risk: ${area.risk}/100</div>` +
      `<div style="font-size:11px;color:#0a84ff;cursor:pointer;margin-top:4px;font-weight:600">View details &rarr;</div>` +
      `</div>`,
      { closeButton: true }
    )

    circle.on('click', () => {
      emit('area-click', area)
      map.flyTo([area.lat, area.lng], 14, { duration: 1 })
    })

    circleMarkers.push(circle)
  }
}

function addSafeSpots() {
  if (!map) return
  if (safeSpotLayerGroup) map.removeLayer(safeSpotLayerGroup)

  const iconCfg: Record<string, { letter: string; bg: string; border: string }> = {
    metro: { letter: 'M', bg: 'rgba(48,209,88,0.2)', border: '#30d158' },
    police: { letter: 'P', bg: 'rgba(10,132,255,0.2)', border: '#0a84ff' },
    hospital: { letter: 'H', bg: 'rgba(255,214,10,0.2)', border: '#ffd60a' },
    fire_station: { letter: 'F', bg: 'rgba(255,69,58,0.2)', border: '#ff453a' },
  }

  const markers: any[] = []
  for (const spot of safeSpots) {
    const cfg = iconCfg[spot.type] || iconCfg.police!
    const icon = L.divIcon({
      html: `<div class="safe-marker-icon" style="background:${cfg.bg};border-color:${cfg.border};color:${cfg.border}">${cfg.letter}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: '',
    })
    const marker = L.marker([spot.lat, spot.lng], { icon })
    marker.bindPopup(
      `<div style="font-family:'Space Grotesk',sans-serif">` +
      `<div style="font-weight:700;font-size:13px">${spot.name}</div>` +
      `<div style="font-size:11px;color:#8a8aa4;text-transform:capitalize">${spot.type.replace('_', ' ')}</div>` +
      `</div>`
    )
    markers.push(marker)
  }
  safeSpotLayerGroup = L.layerGroup(markers).addTo(map)
}

function addRiotZones() {
  if (!map) return
  if (riotLayerGroup) map.removeLayer(riotLayerGroup)

  const markers: any[] = []
  const sevColors: Record<string, string> = { high: '#ff2d55', medium: '#ff9f0a', low: '#ffd60a' }

  for (const zone of riotZones) {
    const color = sevColors[zone.severity] || '#ff9f0a'
    const circle = L.circle([zone.lat, zone.lng], {
      radius: zone.radius,
      color,
      fillColor: color,
      fillOpacity: 0.08,
      weight: 2,
      opacity: 0.6,
      dashArray: '8, 6',
    })
    circle.bindPopup(
      `<div style="font-family:'Space Grotesk',sans-serif">` +
      `<div style="font-weight:700;font-size:13px;color:${color}">${zone.name}</div>` +
      `<div style="font-family:'JetBrains Mono',monospace;font-size:9px;padding:2px 6px;background:${color}20;color:${color};border-radius:3px;display:inline-block;margin:4px 0">${zone.type.replace('_', ' ')}</div>` +
      `<div style="font-size:11px;color:#8a8aa4;margin-top:4px;line-height:1.4">${zone.description}</div>` +
      `<div style="font-size:9px;color:#55556a;margin-top:4px">Updated: ${zone.lastUpdated}</div>` +
      `</div>`
    )
    markers.push(circle)
  }
  riotLayerGroup = L.layerGroup(markers).addTo(map)
}

function addPoliceStations() {
  if (!map) return
  if (policeLayerGroup) map.removeLayer(policeLayerGroup)

  const psMarkers: any[] = []
  for (const ps of policeStations) {
    const isAlert = ps.status === 'high-alert'
    const icon = L.divIcon({
      html: `<div class="safe-marker-icon" style="background:rgba(10,132,255,0.25);border-color:${isAlert ? '#ff2d55' : '#0a84ff'};color:${isAlert ? '#ff2d55' : '#0a84ff'};font-size:9px">P</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: '',
    })
    const marker = L.marker([ps.lat, ps.lng], { icon })
    marker.bindPopup(
      `<div style="font-family:'Space Grotesk',sans-serif">` +
      `<div style="font-weight:700;font-size:13px">${ps.name}</div>` +
      `<div style="font-size:11px;color:#8a8aa4">${ps.district} District</div>` +
      `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#0a84ff;margin-top:4px">${ps.phone}</div>` +
      `<div style="font-size:10px;color:#8a8aa4;margin-top:2px">${ps.officers} officers &middot; Avg response: ${ps.responseTime}</div>` +
      (isAlert ? `<div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#ff2d55;margin-top:4px">HIGH ALERT</div>` : '') +
      `</div>`
    )
    psMarkers.push(marker)
  }
  policeLayerGroup = L.layerGroup(psMarkers).addTo(map)
}

// Filtered heatmap generation
function generateFilteredHeatPoints(areas: Area[], timeFilter: TimeFilter, crimeFilter: CrimeCategory): [number, number, number][] {
  const pts: [number, number, number][] = []

  areas.forEach(a => {
    let timeMul = 1.0
    if (timeFilter === 'night') timeMul = a.risk > 60 ? 1.8 : 0.5
    else if (timeFilter === 'evening') timeMul = a.risk > 50 ? 1.4 : 0.7
    else if (timeFilter === 'day') timeMul = a.risk > 70 ? 0.4 : 1.3
    else if (timeFilter === 'early_morning') timeMul = a.risk > 65 ? 1.6 : 0.3

    let crimeMul = 1.0
    if (crimeFilter !== 'all') {
      const crimeMap: Record<string, string> = {
        harassment: 'Harassment',
        assault: 'Sexual assault',
        stalking: 'Stalking',
        robbery: 'Robbery',
        kidnapping: 'Kidnapping',
      }
      const crimeName = crimeMap[crimeFilter] || ''
      const pct = a.crimes[crimeName] || 0
      crimeMul = Math.max(0.1, pct / 30)
    }

    const count = Math.round(a.risk * 2.5 * timeMul * crimeMul)
    const spread = a.risk > 70 ? 0.015 : a.risk > 40 ? 0.012 : 0.008

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * spread
      const lat = a.lat + Math.sin(angle) * r
      const lng = a.lng + Math.cos(angle) * r * (1 / Math.cos(a.lat * Math.PI / 180))
      const intensity = Math.min(1, 0.3 + Math.random() * 0.7 * (a.risk / 100) * timeMul * crimeMul)
      pts.push([lat, lng, intensity])
    }
  })

  if (timeFilter === 'all' && crimeFilter === 'all') {
    const corridors = [
      { from: [28.6448, 77.2120], to: [28.6506, 77.2301], n: 40 },
      { from: [28.6506, 77.2301], to: [28.6770, 77.2720], n: 35 },
      { from: [28.6730, 77.2910], to: [28.6930, 77.3120], n: 30 },
      { from: [28.7060, 77.0690], to: [28.7280, 77.1700], n: 25 },
    ]
    corridors.forEach(c => {
      for (let i = 0; i < c.n; i++) {
        const t = Math.random()
        const lat = c.from[0]! + (c.to[0]! - c.from[0]!) * t + (Math.random() - 0.5) * 0.005
        const lng = c.from[1]! + (c.to[1]! - c.from[1]!) * t + (Math.random() - 0.5) * 0.005
        pts.push([lat, lng, 0.2 + Math.random() * 0.4])
      }
    })
  }

  return pts
}

function flyToArea(area: Area) {
  if (map) map.flyTo([area.lat, area.lng], 14, { duration: 1 })
}

watch(
  () => [props.timeFilter, props.crimeFilter],
  () => { rebuildLayers() }
)

onMounted(() => { initMap() })
onBeforeUnmount(() => { if (map) { map.remove(); map = null } })
defineExpose({ flyToArea })
</script>

<template>
  <div id="leaflet-map"></div>
</template>

<style scoped>
#leaflet-map { position: absolute; inset: 0; z-index: 1; background: #08080f; }
</style>
