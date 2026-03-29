<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const locationStatus = ref('')

function shareLocation() {
  if (!navigator.geolocation) {
    locationStatus.value = 'Geolocation not supported'
    return
  }

  locationStatus.value = 'Getting location...'

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`

      navigator.clipboard
        .writeText(url)
        .then(() => {
          locationStatus.value = 'Location link copied!'
          setTimeout(() => {
            locationStatus.value = ''
          }, 3000)
        })
        .catch(() => {
          locationStatus.value = 'Failed to copy'
        })
    },
    () => {
      locationStatus.value = 'Location access denied'
      setTimeout(() => {
        locationStatus.value = ''
      }, 3000)
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="sos-overlay" @click.self="emit('close')">
        <div class="sos-modal">
          <h2 class="modal-title">Emergency</h2>
          <p class="modal-subtitle">Tap to call immediately or share location</p>

          <div class="modal-actions">
            <a href="tel:112" class="action-btn action-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call 112 — Police
            </a>

            <a href="tel:1091" class="action-btn action-secondary">
              Women Helpline — 1091
            </a>

            <a href="tel:181" class="action-btn action-secondary">
              DCW — 181
            </a>

            <button class="action-btn action-location" @click="shareLocation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ locationStatus || 'Share live location' }}
            </button>
          </div>

          <button class="dismiss-btn" @click="emit('close')">Dismiss</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sos-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.sos-modal {
  background: var(--bg3);
  border: 1px solid var(--border2);
  border-radius: 24px;
  padding: 32px 24px 24px;
  max-width: 360px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
}

.modal-subtitle {
  font-size: 12px;
  color: var(--text2);
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border2);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  text-decoration: none;
  text-align: center;
}

.action-btn:active {
  transform: scale(0.97);
}

.action-primary {
  background: #ff2d55;
  border-color: #ff2d55;
  color: #ffffff;
}

.action-primary:hover {
  background: #e6274d;
}

.action-secondary {
  background: var(--glass);
  color: var(--text);
}

.action-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
}

.action-location {
  background: rgba(48, 209, 88, 0.1);
  border-color: rgba(48, 209, 88, 0.3);
  color: #30d158;
}

.action-location:hover {
  background: rgba(48, 209, 88, 0.18);
}

.dismiss-btn {
  background: none;
  border: none;
  color: var(--text3);
  font-size: 12px;
  cursor: pointer;
  padding: 6px 12px;
  transition: color 0.2s;
}

.dismiss-btn:hover {
  color: var(--text2);
}

/* Transition */
.modal-enter-active {
  transition: opacity 0.3s ease;
}

.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .sos-modal {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.modal-leave-active .sos-modal {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from .sos-modal {
  transform: scale(0.92);
  opacity: 0;
}

.modal-leave-to .sos-modal {
  transform: scale(0.92);
  opacity: 0;
}
</style>
