<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Area, TimeFilter, CrimeCategory } from '@/data/types'
import { getRiskColor } from '@/data/helpers'

const props = defineProps<{
  areas: Area[]
  timeFilter: TimeFilter
  crimeFilter: CrimeCategory
}>()

const emit = defineEmits<{
  'update:timeFilter': [value: TimeFilter]
  'update:crimeFilter': [value: CrimeCategory]
  'area-select': [area: Area]
}>()

const searchQuery = ref('')
const searchFocused = ref(false)
const activeCity = ref('DELHI')
const showCityToast = ref(false)
const toastCity = ref('')

const cities = ['DELHI', 'MUMBAI', 'BANGALORE', 'KOLKATA', 'CHENNAI', 'HYDERABAD']

function selectCity(city: string) {
  if (city !== 'DELHI') {
    toastCity.value = city
    showCityToast.value = true
    setTimeout(() => { showCityToast.value = false }, 2500)
  } else {
    activeCity.value = city
  }
}

const timeFilters: { label: string; value: TimeFilter }[] = [
  { label: 'All hours', value: 'all' },
  { label: 'Night', value: 'night' },
  { label: 'Evening', value: 'evening' },
  { label: 'Daytime', value: 'day' },
  { label: 'Early AM', value: 'early_morning' },
]

const crimeFilters: { label: string; value: CrimeCategory }[] = [
  { label: 'ALL CRIMES', value: 'all' },
  { label: 'HARASSMENT', value: 'harassment' },
  { label: 'SEXUAL ASSAULT', value: 'assault' },
  { label: 'STALKING', value: 'stalking' },
  { label: 'ROBBERY', value: 'robbery' },
  { label: 'KIDNAPPING', value: 'kidnapping' },
]

const filteredAreas = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return props.areas
    .filter(a => a.name.toLowerCase().includes(q) || a.district.toLowerCase().includes(q))
    .slice(0, 8)
})

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
    <div class="topbar-row">
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="logo-text">
          <span class="logo-name">HERAEGIS</span>
          <span class="logo-ai">AI</span>
        </div>
      </div>

      <div class="city-tabs">
        <button
          v-for="city in cities"
          :key="city"
          class="city-tab"
          :class="{ active: activeCity === city }"
          @click="selectCity(city)"
        >{{ city }}</button>
      </div>

      <div class="search-wrap">
        <svg class="search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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
            <span class="si-name">{{ area.name }}</span>
            <span class="si-risk" :style="{ color: getRiskColor(area.risk) }">{{ area.risk }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="filters-row">
      <div class="fg">
        <button v-for="tf in timeFilters" :key="tf.value" class="pill" :class="{ active: timeFilter === tf.value }" @click="emit('update:timeFilter', tf.value)">{{ tf.label }}</button>
      </div>
      <div class="fdiv"></div>
      <div class="fg">
        <button v-for="cf in crimeFilters" :key="cf.value" class="chip" :class="{ active: crimeFilter === cf.value }" @click="emit('update:crimeFilter', cf.value)">{{ cf.label }}</button>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="showCityToast" class="city-toast">
        {{ toastCity }} data coming soon. Currently showing Delhi.
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.topbar { position: fixed; top: 0; left: 280px; right: 320px; z-index: 1000; display: flex; flex-direction: column; pointer-events: none; }
.topbar > * { pointer-events: auto; }

.topbar-row { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: var(--bg2); border-bottom: 1px solid var(--border); }

.logo { display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-right: 8px; }
.logo-icon { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #ff2d55, #ff4f70); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px var(--red-g); }
.logo-text { display: flex; align-items: baseline; gap: 4px; }
.logo-name { font-family: var(--mono); font-size: 14px; font-weight: 700; letter-spacing: 1.5px; color: var(--text); }
.logo-ai { font-family: var(--mono); font-size: 11px; font-weight: 600; color: var(--red); letter-spacing: 1px; }

.city-tabs { display: flex; gap: 2px; flex-shrink: 0; }
.city-tab { padding: 5px 14px; border-radius: 6px; font-family: var(--mono); font-size: 10px; font-weight: 600; letter-spacing: 0.8px; cursor: pointer; border: 1px solid transparent; color: var(--text3); background: transparent; transition: all 0.2s; }
.city-tab:hover { color: var(--text2); }
.city-tab.active { background: var(--red); color: #fff; border-color: var(--red); }

.search-wrap { flex: 1; max-width: 220px; position: relative; margin-left: auto; }
.search-wrap input { width: 100%; height: 32px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 6px; padding: 0 10px 0 30px; color: var(--text); font-family: var(--font); font-size: 12px; outline: none; transition: all 0.2s; }
.search-wrap input:focus { border-color: var(--border2); background: rgba(255,255,255,0.06); }
.search-wrap input::placeholder { color: var(--text3); }
.search-icon { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: var(--text3); pointer-events: none; }
.search-results { position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: var(--bg3); border: 1px solid var(--border2); border-radius: 8px; overflow: hidden; max-height: 200px; overflow-y: auto; z-index: 200; }
.search-item { padding: 8px 12px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 0.15s; border-bottom: 1px solid var(--border); }
.search-item:last-child { border: none; }
.search-item:hover { background: rgba(255,255,255,0.04); }
.si-name { font-size: 12px; font-weight: 500; }
.si-risk { font-family: var(--mono); font-size: 11px; font-weight: 700; }

.filters-row { display: flex; align-items: center; gap: 8px; padding: 6px 16px; background: linear-gradient(180deg, var(--bg2) 0%, rgba(14,14,24,0.9) 60%, transparent 100%); overflow-x: auto; scrollbar-width: none; }
.filters-row::-webkit-scrollbar { display: none; }
.fg { display: flex; gap: 4px; flex-shrink: 0; }
.fdiv { width: 1px; height: 20px; background: var(--border2); flex-shrink: 0; }

.pill { padding: 4px 12px; border-radius: 6px; font-family: var(--font); font-size: 10px; font-weight: 600; cursor: pointer; border: 1px solid var(--border); color: var(--text3); background: transparent; transition: all 0.2s; white-space: nowrap; }
.pill:hover { border-color: var(--border2); color: var(--text2); }
.pill.active { background: var(--red-dim); border-color: rgba(255,45,85,0.3); color: var(--red); }

.chip { padding: 3px 8px; border-radius: 4px; font-family: var(--mono); font-size: 9px; font-weight: 600; letter-spacing: 0.4px; cursor: pointer; border: 1px solid var(--border); color: var(--text3); background: transparent; transition: all 0.2s; white-space: nowrap; }
.chip:hover { border-color: var(--border2); color: var(--text2); }
.chip.active { color: var(--text); border-color: var(--border2); background: rgba(255,255,255,0.06); }

.city-toast {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  padding: 8px 16px;
  background: var(--bg3);
  border: 1px solid var(--border2);
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text2);
  white-space: nowrap;
  z-index: 300;
  pointer-events: none;
}
.toast-enter-active { transition: opacity 0.2s, transform 0.2s; }
.toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-4px); }

@media (max-width: 1200px) { .topbar { right: 0; } }
@media (max-width: 1024px) { .topbar { left: 0; } .city-tabs { display: none; } }
@media (max-width: 768px) { .filters-row { padding: 4px 12px; } .search-wrap { max-width: 160px; } }
</style>
