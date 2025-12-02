<route lang="yaml">
meta:
  requiresAuth: true
</route>

<template>
  <v-container class="fill-height pb-10" fluid>


  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { storeToRefs } from "pinia";
;
</script>

<style scoped>
.clock-text {
  font-size: 5rem;
  line-height: 1;
  letter-spacing: -2px;
  background: linear-gradient(to bottom right, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-button-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pulse-button {
  z-index: 2;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: radial-gradient(circle at 30% 30%, #38bdf8, #0284c7) !important;
  box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
  animation: pulse-primary 2s infinite;
}

.pulse-button:active {
  transform: scale(0.95);
}

.glow-effect {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: #38bdf8;
  filter: blur(60px);
  opacity: 0.2;
  z-index: 1;
  animation: breathe 4s ease-in-out infinite;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
}

.hover-bg:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.tracking-widest {
  letter-spacing: 0.2em;
}

@keyframes pulse-primary {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 20px rgba(56, 189, 248, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
  }
}

@keyframes breathe {
  0%,
  100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
}

@media (max-width: 600px) {
  .clock-text {
    font-size: 3.5rem;
  }
}
</style>
