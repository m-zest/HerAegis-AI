<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import type { Area } from '@/data/types'
import { getRiskColor, getRiskLabel, getRiskBg, getDistance, formatDistance } from '@/data/helpers'
import { safeSpots } from '@/data/safeSpots'

const props = defineProps<{
  area: Area
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  'spot-click': [lat: number, lng: number]
}>()

const riskFillWidth = ref(0)
const crimeFills = ref<Record<string, number>>({})
const timeFills = ref<number[]>([])

const crimeColors: Record<string, string> = {
  Harassment: '#ff2d55',
  'Sexual assault': '#ff9f0a',
  Stalking: '#ffd60a',
  Robbery: '#0a84ff',
  Kidnapping: '#bf5af2',
  Other: '#55556a',
}

const timeLabels = ['6AM', '12PM', '6PM', '9PM', '12AM', '3AM']

const nearbySafeSpots = computed(() => {
  if (!props.area) return []
  return safeSpots
    .map((spot) => ({
      ...spot,
      distance: getDistance(props.area.lat, props.area.lng, spot.lat, spot.lng),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)
})

const spotIcons: Record<string, { letter: string; color: string }> = {
  metro: { letter: 'M', color: '#30d158' },
  police: { letter: 'P', color: '#0a84ff' },
  hospital: { letter: 'H', color: '#ffd60a' },
  fire_station: { letter: 'F', color: '#ff453a' },
}

function animateBars() {
  riskFillWidth.value = 0
  crimeFills.value = {}
  timeFills.value = []

  nextTick(() => {
    setTimeout(() => {
      riskFillWidth.value = props.area.risk
    }, 80)

    const crimeEntries = Object.entries(props.area.crimes)
    crimeEntries.forEach(([key, val], i) => {
      setTimeout(() => {
        crimeFills.value = { ...crimeFills.value, [key]: val }
      }, 150 + i * 60)
    })

    const maxTime = Math.max(...props.area.times)
    props.area.times.forEach((val, i) => {
      setTimeout(() => {
        timeFills.value = [...timeFills.value]
        timeFills.value[i] = maxTime > 0 ? (val / maxTime) * 100 : 0
      }, 200 + i * 80)
    })
  })
}

watch(
  () => [props.show, props.area],
  () => {
    if (props.show && props.area) {
      animateBars()
    }
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="show" class="overlay" @click="emit('close')"></div>
    </Transition>
    <Transition name="panel">
      <div v-if="show && area" class="panel">
        <!-- Header -->
        <div class="panel-header">
          <div class="header-text">
            <h2 class="area-name">{{ area.name }}</h2>
            <span class="area-district">{{ area.district }}</span>
          </div>
          <button class="close-btn" @click="emit('close')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6L6 18" /><path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="panel-body">
          <!-- Risk Meter -->
          <div class="risk-meter">
            <div class="risk-header">
              <span class="risk-score" :style="{ color: getRiskColor(area.risk) }">{{ area.risk }}</span>
              <span class="risk-badge" :style="{ background: getRiskBg(area.risk), color: getRiskColor(area.risk) }">{{ getRiskLabel(area.risk) }}</span>
            </div>
            <div class="risk-track">
              <div
                class="risk-fill"
                :style="{ width: riskFillWidth + '%', background: getRiskColor(area.risk) }"
              ></div>
            </div>
          </div>

          <!-- Stat Cards -->
          <div class="stat-grid">
            <div class="stat-card">
              <span class="stat-value">{{ area.total.toLocaleString() }}</span>
              <span class="stat-label">Total cases</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ area.month }}</span>
              <span class="stat-label">This month</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ area.peak }}</span>
              <span class="stat-label">Peak danger</span>
            </div>
            <div class="stat-card">
              <span class="stat-value" :style="{ color: area.trend.startsWith('+') ? '#ff2d55' : '#30d158' }">{{ area.trend }}</span>
              <span class="stat-label">Trend</span>
            </div>
          </div>

          <!-- Crime Breakdown -->
          <div class="section">
            <h3 class="section-title">CRIME BREAKDOWN</h3>
            <div class="crime-list">
              <div v-for="(val, key) in area.crimes" :key="key" class="crime-row">
                <span class="crime-name">{{ key }}</span>
                <div class="crime-track">
                  <div
                    class="crime-fill"
                    :style="{
                      width: (crimeFills[key as string] ?? 0) + '%',
                      background: crimeColors[key as string] || '#55556a',
                    }"
                  ></div>
                </div>
                <span class="crime-pct">{{ val }}%</span>
              </div>
            </div>
          </div>

          <!-- Danger by Time -->
          <div class="section">
            <h3 class="section-title">DANGER BY TIME OF DAY</h3>
            <div class="time-chart">
              <div v-for="(val, i) in area.times" :key="i" class="time-col">
                <div class="time-bar-wrap">
                  <div
                    class="time-bar"
                    :style="{
                      height: (timeFills[i] ?? 0) + '%',
                      background: (timeFills[i] ?? 0) > 70 ? '#ff2d55' : (timeFills[i] ?? 0) > 40 ? '#ff9f0a' : '#ffd60a',
                    }"
                  ></div>
                </div>
                <span class="time-label">{{ timeLabels[i] }}</span>
              </div>
            </div>
          </div>

          <!-- Nearby Safe Spots -->
          <div class="section">
            <h3 class="section-title">NEARBY SAFE SPOTS</h3>
            <div class="spots-list">
              <div
                v-for="spot in nearbySafeSpots"
                :key="spot.name"
                class="spot-row spot-row--clickable"
                @click="emit('spot-click', spot.lat, spot.lng)"
              >
                <div class="spot-icon" :style="{ borderColor: spotIcons[spot.type]?.color, color: spotIcons[spot.type]?.color }">
                  {{ spotIcons[spot.type]?.letter }}
                </div>
                <div class="spot-info">
                  <span class="spot-name">{{ spot.name }}</span>
                  <span class="spot-type">{{ spot.type.replace('_', ' ') }}</span>
                </div>
                <div class="spot-actions">
                  <span class="spot-dist">{{ formatDistance(spot.distance) }}</span>
                  <a
                    :href="`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`"
                    target="_blank"
                    rel="noopener"
                    class="spot-dir"
                    @click.stop
                  >Directions</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Emergency Button -->
          <a href="tel:112" class="emergency-btn">
            Emergency &mdash; Call now
          </a>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1999;
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: var(--bg2);
  border-left: 1px solid var(--border);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.panel-enter-from,
.panel-leave-to {
  transform: translateX(100%);
}

.panel-enter-to,
.panel-leave-from {
  transform: translateX(0);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 20px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.area-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

.area-district {
  font-size: 12px;
  color: var(--text2);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text3);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
}

.panel-body::-webkit-scrollbar {
  width: 4px;
}

.panel-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

/* Risk Meter */
.risk-meter {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.risk-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.risk-score {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}

.risk-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.risk-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.risk-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.32, 0.72, 0, 1);
}

/* Stat Grid */
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.stat-card .stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.stat-card .stat-label {
  font-size: 10px;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Sections */
.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 10px;
  font-weight: 600;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* Crime Breakdown */
.crime-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.crime-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.crime-name {
  font-size: 12px;
  color: var(--text2);
  width: 100px;
  flex-shrink: 0;
}

.crime-track {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.crime-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(0.32, 0.72, 0, 1);
}

.crime-pct {
  font-size: 11px;
  font-weight: 600;
  color: var(--text2);
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}

/* Time Chart */
.time-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  height: 100px;
  padding-top: 8px;
}

.time-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
}

.time-bar-wrap {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.time-bar {
  width: 100%;
  max-width: 28px;
  border-radius: 3px 3px 0 0;
  transition: height 0.6s cubic-bezier(0.32, 0.72, 0, 1);
  min-height: 2px;
}

.time-label {
  font-size: 9px;
  color: var(--text3);
  letter-spacing: 0.2px;
  flex-shrink: 0;
}

/* Safe Spots */
.spots-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spot-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.spot-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.03);
}

.spot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.spot-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spot-type {
  font-size: 10px;
  color: var(--text3);
  text-transform: capitalize;
}

.spot-row--clickable {
  cursor: pointer;
  transition: background 0.15s;
}
.spot-row--clickable:hover {
  background: rgba(255,255,255,0.04);
}
.spot-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}
.spot-dist {
  font-size: 11px;
  color: var(--text2);
  font-weight: 500;
}
.spot-dir {
  font-size: 9px;
  color: var(--blue);
  text-decoration: none;
  font-weight: 600;
}
.spot-dir:hover {
  text-decoration: underline;
}

/* Emergency Button */
.emergency-btn {
  width: 100%;
  padding: 14px;
  background: var(--red-dim);
  border: 1px solid var(--red);
  border-radius: 12px;
  color: var(--red);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  flex-shrink: 0;
  margin-top: auto;
}

.emergency-btn:hover {
  background: rgba(227, 26, 94, 0.25);
}

.emergency-btn:active {
  transform: scale(0.98);
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.panel-enter-active,
.panel-leave-active {
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.panel-enter-from,
.panel-leave-to {
  transform: translateX(100%);
}

/* Mobile */
@media (max-width: 768px) {
  .panel {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 70vh;
    border-left: none;
    border-radius: 20px 20px 0 0;
    border-top: 1px solid var(--border);
  }

  .panel-enter-from,
  .panel-leave-to {
    transform: translateY(100%);
  }

  .panel-enter-to,
  .panel-leave-from {
    transform: translateY(0);
  }

  .panel-header {
    padding: 16px 16px 12px;
  }

  .area-name {
    font-size: 20px;
  }

  .panel-body {
    padding: 16px;
    gap: 20px;
  }
}
</style>
