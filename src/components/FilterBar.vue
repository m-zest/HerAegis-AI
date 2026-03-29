<script setup lang="ts">
import type { CrimeCategory } from '@/data/types'

defineProps<{
  crimeFilter: CrimeCategory
}>()

const emit = defineEmits<{
  'update:crimeFilter': [value: CrimeCategory]
}>()

const filters: { label: string; value: CrimeCategory }[] = [
  { label: 'All crimes', value: 'all' },
  { label: 'Harassment', value: 'harassment' },
  { label: 'Sexual assault', value: 'assault' },
  { label: 'Stalking', value: 'stalking' },
  { label: 'Robbery', value: 'robbery' },
  { label: 'Kidnapping', value: 'kidnapping' },
]
</script>

<template>
  <div class="filter-bar">
    <button
      v-for="f in filters"
      :key="f.value"
      class="f-chip"
      :class="{ active: crimeFilter === f.value }"
      @click="emit('update:crimeFilter', f.value)"
    >
      {{ f.label }}
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  z-index: 900;
  display: flex;
  gap: 5px;
  padding: 4px 16px 2px;
  max-width: 1432px;
  margin: 0 auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  pointer-events: none;
}
.filter-bar > * { pointer-events: auto; }
.filter-bar::-webkit-scrollbar { display: none; }

.f-chip {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border);
  color: var(--text3);
  background: var(--glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  white-space: nowrap;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-family: var(--font);
  flex-shrink: 0;
}
.f-chip:hover { border-color: var(--border2); color: var(--text2); }
.f-chip.active { color: var(--text); border-color: var(--border2); background: rgba(255,255,255,0.07); }
</style>
