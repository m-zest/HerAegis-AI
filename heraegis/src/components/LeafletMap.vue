<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import type { Area, TimeFilter, CrimeCategory } from '@/data/types'
import { generateHeatPoints, getRiskColor } from '@/data/helpers'
import { safeSpots } from '@/data/safeSpots'

declare const L: any

const props = defineProps<{
  areas: Area[]
  timeFilter: TimeFilter
  crimeFilter: CrimeCategory
}>()

const emit = defineEmits<{
  'area-click': [area: Area]
}>()

let map: any = null
let heatLayer: any = null
let circleMarkers: any[] = []
let safeSpotLayerGroup: any = null

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

  addHeatmap()
  addAreaMarkers()
  addSafeSpots()
}

function addHeatmap() {
  if (!map) return
  if (heatLayer) map.removeLayer(heatLayer)

  const heatPoints = generateHeatPoints(props.areas)
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
}

function addAreaMarkers() {
  if (!map) return
  circleMarkers.forEach(m => map.removeLayer(m))
  circleMarkers = []

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
      `<div style="font-family:'DM Sans',system-ui,sans-serif">` +
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

  const iconConfig: Record<string, { letter: string; bg: string; border: string }> = {
    metro: { letter: 'M', bg: 'rgba(48,209,88,0.2)', border: '#30d158' },
    police: { letter: 'P', bg: 'rgba(10,132,255,0.2)', border: '#0a84ff' },
    hospital: { letter: 'H', bg: 'rgba(255,214,10,0.2)', border: '#ffd60a' },
    fire_station: { letter: 'F', bg: 'rgba(255,69,58,0.2)', border: '#ff453a' },
  }

  const markers: any[] = []
  for (const spot of safeSpots) {
    const cfg = iconConfig[spot.type] || iconConfig.police!
    const icon = L.divIcon({
      html: `<div class="safe-marker-icon" style="background:${cfg.bg};border-color:${cfg.border};color:${cfg.border}">${cfg.letter}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: '',
    })

    const marker = L.marker([spot.lat, spot.lng], { icon })
    marker.bindPopup(
      `<div style="font-family:'DM Sans',system-ui,sans-serif">` +
      `<div style="font-weight:700;font-size:13px">${spot.name}</div>` +
      `<div style="font-size:11px;color:#8a8aa4;text-transform:capitalize">${spot.type.replace('_', ' ')}</div>` +
      (spot.phone ? `<div style="font-size:11px;color:#0a84ff;margin-top:4px">${spot.phone}</div>` : '') +
      `</div>`
    )
    markers.push(marker)
  }

  safeSpotLayerGroup = L.layerGroup(markers).addTo(map)
}

function flyToArea(area: Area) {
  if (map) {
    map.flyTo([area.lat, area.lng], 14, { duration: 1 })
  }
}

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})

defineExpose({ flyToArea })
</script>

<template>
  <div id="leaflet-map"></div>
</template>

<style scoped>
#leaflet-map {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: #08080f;
}
</style>
