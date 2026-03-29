<script setup lang="ts">
import type { NewsItem } from '@/data/news'

const props = defineProps<{
  newsItems: NewsItem[]
}>()

const categoryColor: Record<string, string> = {
  CRIME: 'var(--red)',
  PROTEST: 'var(--orange)',
  ADVISORY: 'var(--blue)',
  RESCUE: 'var(--green)',
  ALERT: 'var(--yellow)',
  POLITICS: 'var(--purple)',
}

const categoryBg: Record<string, string> = {
  CRIME: 'rgba(255,45,85,0.15)',
  PROTEST: 'rgba(255,159,10,0.15)',
  ADVISORY: 'rgba(10,132,255,0.15)',
  RESCUE: 'rgba(48,209,88,0.15)',
  ALERT: 'rgba(255,214,10,0.15)',
  POLITICS: 'rgba(191,90,242,0.15)',
}

const metrics = [
  { label: 'CRIME RATE', value: '78', color: 'var(--red)', percent: 78 },
  { label: 'RESPONSE TIME', value: '12 min', color: 'var(--orange)', percent: 45 },
  { label: 'PATROL DENSITY', value: '64', color: 'var(--yellow)', percent: 64 },
  { label: 'ALERT LEVEL', value: 'HIGH', color: 'var(--red)', percent: 88 },
]
</script>

<template>
  <aside class="right-panel">
    <!-- Signal Feed Section -->
    <div class="section-header">
      <span class="section-title">SIGNAL FEED</span>
      <span class="live-badge live-badge--red">
        <span class="live-dot live-dot--red"></span>
        LIVE
      </span>
    </div>

    <div class="signal-list">
      <div
        v-for="item in newsItems"
        :key="item.id"
        class="signal-card"
        :class="{ 'signal-card--urgent': item.urgent }"
      >
        <div class="signal-card__top">
          <span
            class="source-badge"
            :style="{ background: categoryBg[item.category], color: categoryColor[item.category] }"
          >
            {{ item.source }}
          </span>
          <span class="signal-card__time">{{ item.time }}</span>
        </div>
        <div class="signal-card__categories">
          <span
            class="category-pill"
            :style="{ background: categoryBg[item.category], color: categoryColor[item.category] }"
          >
            {{ item.category }}
          </span>
        </div>
        <div class="signal-card__title">{{ item.title }}</div>
        <div v-if="item.location" class="signal-card__location">
          <span class="location-dot"></span>
          {{ item.location }}
        </div>
      </div>
    </div>

    <!-- Incident Tempo Section -->
    <div class="section-header section-header--tempo">
      <span class="section-title">INCIDENT TEMPO</span>
      <span class="hot-badge">HOT METRICS</span>
    </div>

    <div class="metrics">
      <div v-for="m in metrics" :key="m.label" class="metric-row">
        <span class="metric-label">{{ m.label }}</span>
        <div class="metric-bar-track">
          <div
            class="metric-bar-fill"
            :style="{ width: m.percent + '%', background: m.color }"
          ></div>
        </div>
        <span class="metric-value" :style="{ color: m.color }">{{ m.value }}</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.right-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 32px;
  width: 320px;
  z-index: 100;
  background: var(--bg2);
  border-left: 1px solid var(--border);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: var(--border2) transparent;
}

.right-panel::-webkit-scrollbar {
  width: 4px;
}

.right-panel::-webkit-scrollbar-track {
  background: transparent;
}

.right-panel::-webkit-scrollbar-thumb {
  background: var(--border2);
  border-radius: 2px;
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.section-header--tempo {
  border-top: 1px solid var(--border);
}

.section-title {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--text2);
  text-transform: uppercase;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--red);
  background: rgba(255, 45, 85, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.live-badge--red {
  color: var(--red);
  background: rgba(255, 45, 85, 0.1);
}

.live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  animation: blink 1.4s ease-in-out infinite;
}

.live-dot--red {
  background: var(--red);
  box-shadow: 0 0 6px var(--red);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.hot-badge {
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--red);
  text-transform: uppercase;
}

/* Signal List */
.signal-list {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border2) transparent;
}

/* Signal Card */
.signal-card {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s ease;
}

.signal-card:hover {
  background: rgba(255, 255, 255, 0.02);
}

.signal-card--urgent {
  border-left: 2px solid var(--red);
}

.signal-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.source-badge {
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 3px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.signal-card__time {
  font-size: 10px;
  color: var(--text3);
  font-family: var(--mono);
  flex-shrink: 0;
}

.signal-card__categories {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
}

.category-pill {
  font-family: var(--mono);
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 3px;
  letter-spacing: 0.5px;
}

.signal-card__title {
  font-size: 12px;
  color: var(--text);
  line-height: 1.4;
  font-weight: 500;
}

.signal-card__location {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  font-size: 10px;
  color: var(--text2);
}

.location-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text3);
  flex-shrink: 0;
}

/* Metrics */
.metrics {
  padding: 12px 16px 16px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.metric-label {
  font-family: var(--mono);
  font-size: 10px;
  text-transform: uppercase;
  color: var(--text3);
  letter-spacing: 0.5px;
  white-space: nowrap;
  width: 100px;
  flex-shrink: 0;
}

.metric-bar-track {
  flex: 1;
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}

.metric-value {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 700;
  text-align: right;
  white-space: nowrap;
  min-width: 48px;
}

/* Mobile */
@media (max-width: 1200px) {
  .right-panel {
    display: none;
  }
}
</style>
