<script setup lang="ts">
import { ref } from 'vue'
import type { Area, TimeFilter, CrimeCategory } from '@/data/types'
import { areas } from '@/data/areas'
import { newsItems } from '@/data/news'
import { policeStations, type PoliceStation } from '@/data/policeStations'
import LeafletMap from '@/components/LeafletMap.vue'
import TopBar from '@/components/TopBar.vue'
import LeftPanel from '@/components/LeftPanel.vue'
import RightPanel from '@/components/RightPanel.vue'
import AreaDetailPanel from '@/components/AreaDetailPanel.vue'
import MapLegend from '@/components/MapLegend.vue'
import SOSButton from '@/components/SOSButton.vue'
import SOSModal from '@/components/SOSModal.vue'
import NewsTicker from '@/components/NewsTicker.vue'

const selectedArea = ref<Area | null>(null)
const timeFilter = ref<TimeFilter>('all')
const crimeFilter = ref<CrimeCategory>('all')
const showPanel = ref(false)
const showSOS = ref(false)
const showPoliceStations = ref(true)
const mapRef = ref<InstanceType<typeof LeafletMap> | null>(null)

function onAreaClick(area: Area) {
  selectedArea.value = area
  showPanel.value = true
  mapRef.value?.flyToArea(area)
}

function closePanel() {
  showPanel.value = false
}

function onStationClick(station: PoliceStation) {
  mapRef.value?.flyToCoords(station.lat, station.lng, 16)
}

function onSpotClick(lat: number, lng: number) {
  mapRef.value?.flyToCoords(lat, lng, 16)
}

function onNewsLocationClick(location: string) {
  const area = areas.find(a => a.name === location)
  if (area) {
    mapRef.value?.flyToArea(area)
  }
}
</script>

<template>
  <div class="dashboard">
    <LeftPanel
      :areas="areas"
      :police-stations="policeStations"
      @station-click="onStationClick"
      @area-click="onAreaClick"
    />
    <LeafletMap
      ref="mapRef"
      :areas="areas"
      :time-filter="timeFilter"
      :crime-filter="crimeFilter"
      :show-police-stations="showPoliceStations"
      @area-click="onAreaClick"
    />
    <TopBar
      :areas="areas"
      :time-filter="timeFilter"
      :crime-filter="crimeFilter"
      @update:time-filter="timeFilter = $event"
      @update:crime-filter="crimeFilter = $event"
      @area-select="onAreaClick"
    />
    <RightPanel
      :news-items="newsItems"
      @location-click="onNewsLocationClick"
    />
    <AreaDetailPanel
      v-if="selectedArea"
      :area="selectedArea"
      :show="showPanel"
      @close="closePanel"
      @spot-click="onSpotClick"
    />
    <MapLegend />
    <SOSButton @click="showSOS = true" />
    <SOSModal :show="showSOS" @close="showSOS = false" />
    <NewsTicker :news-items="newsItems" />
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
</style>
