<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Area, TimeFilter } from '@/data/types'
import { getRiskColor } from '@/data/helpers'
import { safeSpots } from '@/data/safeSpots'

const props = defineProps<{
  areas: Area[]
  timeFilter: TimeFilter
}>()

const emit = defineEmits<{
  'update:timeFilter': [value: TimeFilter]
  'area-select': [area: Area]
}>()

const searchQuery = ref('')
const searchFocused = ref(false)

const timeFilters: { label: string; value: TimeFilter }[] = [
  { label: 'All hours', value: 'all' },
  { label: 'Night', value: 'night' },
  { label: 'Evening', value: 'evening' },
  { label: 'Daytime', value: 'day' },
  { label: 'Early AM', value: 'early_morning' },
]

const filteredAreas = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return props.areas
    .filter(a => a.name.toLowerCase().includes(q) || a.district.toLowerCase().includes(q))
    .slice(0, 8)
})

const totalIncidents = computed(() => props.areas.reduce((sum, a) => sum + a.total, 0))
const highRiskCount = computed(() => props.areas.filter(a => a.risk >= 70).length)

function selectArea(area: Area) {
  searchQuery.value = ''
  searchFocused.value = false
  emit('area-select', area)
}

function onBlur() {
  setTimeout(() => { searchFocused.value = false }, 200)
}
</script>

<template>
  <div class="topbar">
    <div class="topbar-main">
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="logo-text">Her<span class="accent">Aegis</span><span class="ai"> AI</span></div>
      </div>

      <div class="search-wrap">
        <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search area..."
          autocomplete="off"
          spellcheck="false"
          @focus="searchFocused = true"
          @blur="onBlur"
        />
        <div v-if="searchFocused && filteredAreas.length > 0" class="search-results">
          <div
            v-for="area in filteredAreas"
            :key="area.id"
            class="search-item"
            @mousedown.prevent="selectArea(area)"
          >
            <span class="search-item-name">{{ area.name }}</span>
            <span class="search-item-risk" :style="{ color: getRiskColor(area.risk), background: getRiskColor(area.risk) + '20' }">
              {{ area.risk }}
            </span>
          </div>
        </div>
      </div>

      <div class="controls-row">
        <button
          v-for="tf in timeFilters"
          :key="tf.value"
          class="pill"
          :class="{ active: timeFilter === tf.value }"
          @click="emit('update:timeFilter', tf.value)"
        >
          {{ tf.label }}
        </button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-chip">
        <div class="stat-dot" style="background: var(--red); box-shadow: 0 0 6px var(--red-g);"></div>
        <span class="stat-num">{{ totalIncidents.toLocaleString() }}</span>
        <span class="stat-label">incidents</span>
      </div>
      <div class="stat-chip">
        <div class="stat-dot" style="background: var(--orange);"></div>
        <span class="stat-num">{{ highRiskCount }}</span>
        <span class="stat-label">high-risk zones</span>
      </div>
      <div class="stat-chip">
        <div class="stat-dot" style="background: var(--green);"></div>
        <span class="stat-num">{{ safeSpots.length }}</span>
        <span class="stat-label">safe spots mapped</span>
      </div>
      <div class="stat-chip">
        <div class="live-dot"></div>
        <span class="stat-num" style="color: var(--green);">Live</span>
        <span class="stat-label">synced</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 16px;
  background: linear-gradient(180deg, rgba(8,8,15,0.96) 0%, rgba(8,8,15,0.8) 60%, transparent 100%);
  pointer-events: none;
}
.topbar > * { pointer-events: auto; }

.topbar-main {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0 8px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff2d55 0%, #ff6b8a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px var(--red-g), 0 2px 8px rgba(0,0,0,0.3);
}
.logo-text {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: var(--text);
}
.logo-text .accent { color: var(--red); }
.logo-text .ai { color: var(--text2); font-weight: 400; }

.search-wrap {
  flex: 1;
  max-width: 320px;
  position: relative;
}
.search-wrap input {
  width: 100%;
  height: 36px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0 12px 0 34px;
  color: var(--text);
  font-family: var(--font);
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
}
.search-wrap input:focus {
  border-color: rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.09);
}
.search-wrap input::placeholder { color: var(--text3); }
.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text3);
  pointer-events: none;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--glass2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border2);
  border-radius: 12px;
  overflow: hidden;
  max-height: 240px;
  overflow-y: auto;
  z-index: 200;
}
.search-item {
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.15s;
  border-bottom: 1px solid var(--border);
}
.search-item:last-child { border: none; }
.search-item:hover { background: rgba(255,255,255,0.05); }
.search-item-name { font-size: 13px; font-weight: 500; }
.search-item-risk {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
}

.controls-row {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  align-items: center;
}
.pill {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border);
  color: var(--text2);
  background: var(--glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.2s;
  white-space: nowrap;
  font-family: var(--font);
}
.pill.active {
  background: var(--red-dim);
  border-color: rgba(255,45,85,0.3);
  color: var(--red);
}
.pill:hover:not(.active) {
  border-color: var(--border2);
  color: var(--text);
}

.stats-row {
  display: flex;
  gap: 8px;
  padding: 8px 0;
  max-width: 1400px;
  margin: 0 auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.stats-row::-webkit-scrollbar { display: none; }

.stat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--glass);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}
.stat-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.stat-num {
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
}
.stat-label {
  font-size: 11px;
  color: var(--text2);
}
.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green);
  animation: blink 1.5s ease-in-out infinite;
}

@media (max-width: 768px) {
  .controls-row { display: none; }
  .search-wrap { max-width: 180px; }
  .topbar { padding: 0 12px; }
}
@media (max-width: 480px) {
  .search-wrap { max-width: 140px; }
  .stat-label { font-size: 10px; }
  .logo-text { font-size: 15px; }
}
</style>
