<script setup lang="ts">
const levels = [
  { label: 'Extreme', color: '#ffffb2', glow: 'rgba(255,255,178,0.5)' },
  { label: 'High', color: '#fd8d3c', glow: '' },
  { label: 'Moderate', color: '#e31a8c', glow: '' },
  { label: 'Low', color: '#7a0177', glow: '' },
]
</script>

<template>
  <div class="map-legend">
    <div v-for="level in levels" :key="level.label" class="leg-row">
      <div class="leg-dot" :style="{ background: level.color, boxShadow: level.glow ? `0 0 6px ${level.glow}` : 'none' }"></div>
      <span>{{ level.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.map-legend {
  position: fixed;
  bottom: 28px;
  left: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: var(--glass);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 16px;
}
.leg-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: var(--text2);
  font-weight: 500;
}
.leg-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .map-legend {
    bottom: 20px;
    left: 12px;
    padding: 8px 12px;
  }
}
</style>
