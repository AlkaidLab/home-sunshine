<script setup vapor>
const createMeteor = (
  x,
  y,
  delay,
  duration,
  length,
  travel,
  angle,
  opacity,
  thickness = 1,
  glow = 3,
) => ({
  '--meteor-x': `${x}%`,
  '--meteor-y': `${y}%`,
  '--meteor-delay': `${delay}s`,
  '--meteor-duration': `${duration}s`,
  '--meteor-length': `${length}px`,
  '--meteor-travel': `${travel}vw`,
  '--meteor-angle': `${angle}deg`,
  '--meteor-opacity': opacity,
  '--meteor-thickness': `${thickness}px`,
  '--meteor-glow': `${glow}px`,
})

// x, y, delay, duration, length, travel, angle, opacity, thickness, glow
const meteors = [
  createMeteor(94, -12, -1.8, 9.8, 132, 96, 144, 0.92, 2, 5),
  createMeteor(80, -24, -6.4, 12.6, 82, 78, 149, 0.62),
  createMeteor(108, 2, -9.2, 14.2, 158, 108, 141, 0.96, 2, 6),
  createMeteor(66, -30, -3.6, 11.4, 68, 72, 151, 0.5),
  createMeteor(100, 20, -11.7, 15.5, 110, 92, 146, 0.75, 1.5, 4),
  createMeteor(52, -36, -7.8, 13.8, 58, 62, 139, 0.42, 1, 2),
  createMeteor(118, -18, -14.2, 16.8, 142, 116, 147, 0.86, 2, 5),
  createMeteor(88, 8, -4.9, 8.6, 74, 84, 143, 0.58),
  createMeteor(72, -8, -10.6, 10.7, 102, 76, 148, 0.7, 1.5, 4),
  createMeteor(112, 30, -2.7, 13.4, 52, 78, 137, 0.38, 1, 2),
  createMeteor(58, -18, -12.9, 9.3, 88, 66, 142, 0.64),
  createMeteor(104, -34, -7.1, 12.1, 122, 104, 150, 0.8, 1.5, 5),
  createMeteor(84, 34, -15.4, 17.6, 62, 70, 140, 0.44, 1, 2),
  createMeteor(124, 8, -5.8, 11.8, 176, 124, 145, 1, 2, 7),
  createMeteor(68, 16, -8.7, 14.9, 48, 58, 152, 0.34, 1, 2),
  createMeteor(96, -28, -13.6, 10.2, 94, 94, 138, 0.68, 1.5, 4),
].map((style, index) => ({ id: index + 1, style }))
</script>

<template>
  <div class="meteor-sky" aria-hidden="true">
    <span
      v-for="meteor in meteors"
      :key="meteor.id"
      class="meteor"
      :style="meteor.style"
    ></span>
  </div>
</template>

<style scoped lang="less">
.meteor-sky {
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.72;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle, rgba(var(--meteor-rgb), 0.5) 0 1px, transparent 1.5px),
      radial-gradient(circle, rgba(var(--meteor-rgb), 0.28) 0 1px, transparent 1.5px);
    background-position: 0 0, 34px 46px;
    background-size: 86px 86px, 118px 118px;
    mask-image: linear-gradient(to bottom, #000, transparent 88%);
    opacity: 0.32;
  }
}

.meteor {
  position: absolute;
  top: var(--meteor-y);
  left: var(--meteor-x);
  width: var(--meteor-length);
  height: var(--meteor-thickness);
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(var(--meteor-rgb), 0.12) 18%,
    rgba(var(--meteor-rgb), 0.85) 78%,
    rgba(255, 255, 255, 0.98)
  );
  filter: drop-shadow(0 0 var(--meteor-glow) rgba(var(--meteor-rgb), 0.72));
  opacity: 0;
  transform: rotate(var(--meteor-angle)) translate3d(0, 0, 0);
  transform-origin: right center;
  will-change: transform, opacity;
  animation: meteor-flight var(--meteor-duration) linear var(--meteor-delay) infinite;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -1px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #fff;
    box-shadow:
      0 0 6px 2px rgba(var(--meteor-rgb), 0.82),
      0 0 14px 4px rgba(var(--meteor-rgb), 0.26);
    transform: translateY(-50%);
  }
}

@keyframes meteor-flight {
  0%, 3% {
    opacity: 0;
    transform: rotate(var(--meteor-angle)) translate3d(0, 0, 0) scaleX(0.72);
  }

  6% {
    opacity: var(--meteor-opacity);
  }

  27% {
    opacity: calc(var(--meteor-opacity) * 0.82);
  }

  33%, 100% {
    opacity: 0;
    transform: rotate(var(--meteor-angle)) translate3d(var(--meteor-travel), 0, 0) scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .meteor {
    display: none;
    animation: none;
  }

  .meteor-sky::before {
    opacity: 0.18;
  }
}
</style>
