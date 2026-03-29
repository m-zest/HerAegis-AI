<script setup lang="ts">
import { computed } from 'vue'
import type { Area } from '@/data/types'
import type { PoliceStation } from '@/data/policeStations'

const props = defineProps<{
  areas: Area[]
  policeStations: PoliceStation[]
}>()

const emit = defineEmits<{
  'station-click': [station: PoliceStation]
}>()

// --- Computed stats ---
const totalCrimeReports = computed(() =>
  props.areas.reduce((sum, a) => sum + a.month, 0)
)

const highRiskZones = computed(() =>
  props.areas.filter(a => a.risk >= 70).length
)

const safeCorridors = computed(() =>
  props.areas.filter(a => a.risk < 30).length
)

// --- Top 5 dangerous areas ---
const topDangerousAreas = computed(() =>
  [...props.areas]
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 5)
)

// --- Helpers ---
function formatNumber(n: number): string {
  return n.toLocaleString('en-IN')
}

function parseResponseTime(rt: string): number {
  return parseInt(rt, 10)
}

function responseTimeColor(rt: string): string {
  const mins = parseResponseTime(rt)
  if (mins < 8) return 'var(--green)'
  if (mins <= 12) return 'var(--orange)'
  return 'var(--red)'
}

function riskBarColor(risk: number): string {
  if (risk >= 80) return 'var(--red)'
  if (risk >= 60) return 'var(--orange)'
  if (risk >= 40) return 'var(--yellow)'
  return 'var(--green)'
}
</script>

<template>
  <aside class="left-panel">
    <!-- Section 1: Threat Grid -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">THREAT GRID</span>
        <span class="live-badge">
          <span class="live-dot" />
          LIVE
        </span>
      </div>

      <div class="stat-row">
        <span class="dot dot-red" />
        <div class="stat-label">
          <span class="label-main">Crime Reports</span>
          <span class="label-sub">last 30 days</span>
        </div>
        <span class="stat-value">{{ formatNumber(totalCrimeReports) }}</span>
      </div>

      <div class="stat-row">
        <span class="dot dot-orange" />
        <div class="stat-label">
          <span class="label-main">High-Risk Zones</span>
          <span class="label-sub">score &gt; 70</span>
        </div>
        <span class="stat-value">{{ highRiskZones }}</span>
      </div>

      <div class="stat-row">
        <span class="dot dot-yellow" />
        <div class="stat-label">
          <span class="label-main">Active Alerts</span>
          <span class="label-sub">unresolved</span>
        </div>
        <span class="stat-value">23</span>
      </div>

      <div class="stat-row">
        <span class="dot dot-green" />
        <div class="stat-label">
          <span class="label-main">Safe Corridors</span>
          <span class="label-sub">verified</span>
        </div>
        <span class="stat-value">{{ safeCorridors }}</span>
      </div>

      <div class="stat-row">
        <span class="dot dot-blue" />
        <div class="stat-label">
          <span class="label-main">CCTV Coverage</span>
          <span class="label-sub">nodes online</span>
        </div>
        <span class="stat-value">4,826</span>
      </div>

      <div class="stat-row">
        <span class="dot dot-purple" />
        <div class="stat-label">
          <span class="label-main">Riot Warnings</span>
          <span class="label-sub">political/communal</span>
        </div>
        <span class="stat-value">10</span>
      </div>
    </div>

    <!-- Section 2: Police Stations -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">POLICE STATIONS</span>
        <span class="count-badge">{{ policeStations.length }}</span>
      </div>

      <div class="stations-list">
        <div
          v-for="station in policeStations"
          :key="station.id"
          class="station-row"
          @click="emit('station-click', station)"
        >
          <div class="station-icon">P</div>
          <div class="station-info">
            <span class="station-name">{{ station.name }}</span>
            <span class="station-district">{{ station.district }}</span>
          </div>
          <div class="station-meta">
            <span
              class="station-response"
              :style="{ color: responseTimeColor(station.responseTime) }"
            >
              {{ station.responseTime }}
            </span>
            <span
              v-if="station.status === 'high-alert'"
              class="alert-dot"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Risk Assessment -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">RISK ASSESSMENT</span>
      </div>

      <div class="risk-list">
        <div
          v-for="area in topDangerousAreas"
          :key="area.id"
          class="risk-row"
        >
          <span class="risk-name">{{ area.name }}</span>
          <div class="risk-bar-track">
            <div
              class="risk-bar-fill"
              :style="{
                width: area.risk + '%',
                background: riskBarColor(area.risk),
              }"
            />
          </div>
          <span class="risk-score">{{ area.risk }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.left-panel {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  z-index: 100;
  background: var(--bg2);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border2) transparent;
}

.left-panel::-webkit-scrollbar {
  width: 4px;
}

.left-panel::-webkit-scrollbar-track {
  background: transparent;
}

.left-panel::-webkit-scrollbar-thumb {
  background: var(--border2);
  border-radius: 2px;
}

/* Sections */
.section {
  border-bottom: 1px solid var(--border);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--text3);
}

/* LIVE badge */
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(48, 209, 88, 0.12);
  color: var(--green);
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--green);
  animation: blink 1.4s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* Count badge */
.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  border-radius: 9px;
  background: rgba(10, 132, 255, 0.15);
  color: var(--blue);
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 600;
}

/* Stat rows */
.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
}

.stat-row:last-child {
  border-bottom: none;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-red { background: var(--red); }
.dot-orange { background: var(--orange); }
.dot-yellow { background: var(--yellow); }
.dot-green { background: var(--green); }
.dot-blue { background: var(--blue); }
.dot-purple { background: var(--purple); }

.stat-label {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.label-main {
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.3;
}

.label-sub {
  font-size: 10px;
  color: var(--text3);
  line-height: 1.3;
}

.stat-value {
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  flex-shrink: 0;
}

/* Police Stations */
.stations-list {
  max-height: 240px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border2) transparent;
}

.stations-list::-webkit-scrollbar {
  width: 3px;
}

.stations-list::-webkit-scrollbar-thumb {
  background: var(--border2);
  border-radius: 2px;
}

.station-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid var(--border);
}

.station-row:last-child {
  border-bottom: none;
}

.station-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.station-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(10, 132, 255, 0.2);
  color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

.station-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.station-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.station-district {
  font-size: 10px;
  color: var(--text3);
  line-height: 1.3;
}

.station-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.station-response {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.alert-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--red);
  flex-shrink: 0;
}

/* Risk Assessment */
.risk-list {
  padding: 8px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.risk-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.risk-name {
  font-size: 12px;
  color: var(--text);
  width: 80px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.risk-bar-track {
  flex: 1;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.risk-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.risk-score {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--text2);
  width: 22px;
  text-align: right;
  flex-shrink: 0;
}

/* Mobile: hide panel */
@media (max-width: 1023px) {
  .left-panel {
    display: none;
  }
}
</style>
