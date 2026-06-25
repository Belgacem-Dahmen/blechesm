<template>
  <div class="blechesm-loader" :style="{ '--size': size }" role="status" aria-label="Chargement">
    <div class="blechesm-loader__stage">
      <div class="blechesm-loader__glow" />
      <img
        class="blechesm-loader__logo"
        :src="logoSrc"
        alt=""
        draggable="false"
      />
      <div class="blechesm-loader__shadow" />
    </div>
    <p v-if="label" class="blechesm-loader__label">{{ label }}</p>
  </div>
</template>

<script setup>
import defaultLogo from '@/assets/logo.png'

defineProps({
  logoSrc: { type: String, default: defaultLogo },
  size:    { type: String, default: '96px' },
  label:   { type: String, default: '' },
})
</script>

<style scoped>
.blechesm-loader {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.blechesm-loader__stage {
  position: relative;
  width: var(--size);
  height: var(--size);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 600px;
}

.blechesm-loader__glow {
  position: absolute;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(61,123,255,0.55) 0%, rgba(61,123,255,0) 70%);
  filter: blur(14px);
  animation: bl-pulse 2.2s ease-in-out infinite;
  z-index: 0;
}

.blechesm-loader__logo {
  position: relative;
  z-index: 1;
  width: 78%;
  height: 78%;
  object-fit: contain;
  transform-style: preserve-3d;
  animation: bl-rotate 2.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  will-change: transform;
  filter: drop-shadow(0 0 18px rgba(61,123,255,0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.5));
}

.blechesm-loader__shadow {
  position: absolute;
  bottom: 2%;
  width: 50%;
  height: 10%;
  border-radius: 50%;
  background: rgba(0,0,0,0.35);
  filter: blur(4px);
  animation: bl-shadow 2.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  z-index: 0;
}

@keyframes bl-rotate {
  0%   { transform: rotateY(0deg)   rotateX(4deg); }
  25%  { transform: rotateY(90deg)  rotateX(4deg) scale(0.92); }
  50%  { transform: rotateY(180deg) rotateX(4deg); }
  75%  { transform: rotateY(270deg) rotateX(4deg) scale(0.92); }
  100% { transform: rotateY(360deg) rotateX(4deg); }
}

@keyframes bl-pulse {
  0%, 100% { opacity: 0.5; transform: scale(0.9); }
  50%       { opacity: 1;   transform: scale(1.12); }
}

@keyframes bl-shadow {
  0%, 50%, 100% { transform: scaleX(1);   opacity: 0.3; }
  25%, 75%      { transform: scaleX(0.6); opacity: 0.15; }
}

.blechesm-loader__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text-3);
}

@media (prefers-reduced-motion: reduce) {
  .blechesm-loader__logo,
  .blechesm-loader__glow,
  .blechesm-loader__shadow { animation: none; }
}
</style>
