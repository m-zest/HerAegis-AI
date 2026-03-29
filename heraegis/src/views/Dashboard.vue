<script setup lang="ts">
import { ref } from 'vue'
import type { Area, TimeFilter, CrimeCategory } from '@/data/types'
import { areas } from '@/data/areas'
import LeafletMap from '@/components/LeafletMap.vue'
import TopBar from '@/components/TopBar.vue'
import FilterBar from '@/components/FilterBar.vue'
import AreaDetailPanel from '@/components/AreaDetailPanel.vue'
import MapLegend from '@/components/MapLegend.vue'
import SOSButton from '@/components/SOSButton.vue'
import SOSModal from '@/components/SOSModal.vue'

const selectedArea = ref<Area | null>(null)
const timeFilter = ref<TimeFilter>('all')
const crimeFilter = ref<CrimeCategory>('all')
const showPanel = ref(false)
const showSOS = ref(false)
const mapRef = ref<InstanceType<typeof LeafletMap> | null>(null)

function onAreaClick(area: Area) {
  selectedArea.value = area
  showPanel.value = true
  mapRef.value?.flyToArea(area)
}

function closePanel() {
  showPanel.value = false
}
</script>

<template>
  <div class="dashboard">
    <LeafletMap
      ref="mapRef"
      :areas="areas"
      :time-filter="timeFilter"
      :crime-filter="crimeFilter"
      @area-click="onAreaClick"
    />
    <TopBar
      :areas="areas"
      :time-filter="timeFilter"
      @update:time-filter="timeFilter = $event"
      @area-select="onAreaClick"
    />
    <FilterBar
      :crime-filter="crimeFilter"
      @update:crime-filter="crimeFilter = $event"
    />
    <AreaDetailPanel
      v-if="selectedArea"
      :area="selectedArea"
      :show="showPanel"
      @close="closePanel"
    />
    <MapLegend />
    <SOSButton @click="showSOS = true" />
    <SOSModal :show="showSOS" @close="showSOS = false" />
    <div class="disclaimer">
      Data sourced from NCRB reports and Delhi Police public records. For awareness purposes only. Does not replace emergency services.
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.disclaimer {
  position: fixed;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text3);
  font-size: 10px;
  letter-spacing: 0.3px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
  opacity: 0.7;
}
@media (max-width: 768px) {
  .disclaimer { display: none; }
}
</style>
