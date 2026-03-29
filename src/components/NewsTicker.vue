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
  CRIME: 'rgba(255,45,85,0.2)',
  PROTEST: 'rgba(255,159,10,0.2)',
  ADVISORY: 'rgba(10,132,255,0.2)',
  RESCUE: 'rgba(48,209,88,0.2)',
  ALERT: 'rgba(255,214,10,0.2)',
  POLITICS: 'rgba(191,90,242,0.2)',
}
</script>

<template>
  <div class="ticker">
    <div class="ticker__label">
      <span class="ticker__dot"></span>
      <span class="ticker__text">LIVE FEED</span>
    </div>
    <div class="ticker__scroll-area">
      <div class="ticker__scroller">
        <!-- First copy -->
        <template v-for="item in newsItems" :key="'a-' + item.id">
          <span
            class="ticker__source"
            :style="{ background: categoryBg[item.category], color: categoryColor[item.category] }"
          >
            {{ item.source }}
          </span>
          <span class="ticker__time">{{ item.time }}</span>
          <span class="ticker__title">{{ item.title }}</span>
          <span class="ticker__sep">&#xb7;</span>
        </template>
        <!-- Second copy for seamless loop -->
        <template v-for="item in newsItems" :key="'b-' + item.id">
          <span
            class="ticker__source"
            :style="{ background: categoryBg[item.category], color: categoryColor[item.category] }"
          >
            {{ item.source }}
          </span>
          <span class="ticker__time">{{ item.time }}</span>
          <span class="ticker__title">{{ item.title }}</span>
          <span class="ticker__sep">&#xb7;</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 32px;
  z-index: 1100;
  background: var(--bg2);
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ticker__label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  height: 100%;
}

.ticker__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 6px var(--green);
  animation: blink 1.4s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.ticker__text {
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text2);
}

.ticker__scroll-area {
  flex: 1;
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
}

.ticker__scroller {
  display: flex;
  align-items: center;
  gap: 24px;
  white-space: nowrap;
  animation: scroll 50s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.ticker__source {
  font-family: var(--mono);
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 3px;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.ticker__time {
  font-size: 8px;
  color: var(--text3);
  font-family: var(--mono);
  flex-shrink: 0;
}

.ticker__title {
  font-size: 10px;
  color: var(--text);
  flex-shrink: 0;
}

.ticker__sep {
  color: var(--text3);
  font-size: 14px;
  flex-shrink: 0;
}

/* Mobile */
@media (max-width: 1200px) {
  .ticker {
    height: 28px;
  }

  .ticker__title {
    font-size: 8px;
  }

  .ticker__source {
    font-size: 7px;
  }

  .ticker__time {
    font-size: 7px;
  }
}
</style>
