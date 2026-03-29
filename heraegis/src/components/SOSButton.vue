<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button class="sos-btn" @click="emit('click')" aria-label="SOS Emergency">
    SOS
  </button>
</template>

<style scoped>
.sos-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1500;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ff2d55, #ff4f70);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.8px;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(255, 45, 85, 0.4);
  animation: sosPulse 2.2s ease-in-out infinite;
  transition: transform 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sos-btn:hover {
  transform: scale(1.08);
}

.sos-btn:active {
  transform: scale(0.94);
}

@keyframes sosPulse {
  0% {
    box-shadow: 0 4px 24px rgba(255, 45, 85, 0.4);
  }
  50% {
    box-shadow: 0 4px 36px rgba(255, 45, 85, 0.7), 0 0 0 8px rgba(255, 45, 85, 0.1);
  }
  100% {
    box-shadow: 0 4px 24px rgba(255, 45, 85, 0.4);
  }
}

@media (max-width: 768px) {
  .sos-btn {
    width: 54px;
    height: 54px;
    bottom: 20px;
    right: 16px;
    font-size: 10px;
  }
}
</style>
