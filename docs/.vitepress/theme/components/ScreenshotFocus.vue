<script setup>
defineProps({
  sourceWidth: { type: Number, required: true },
  regions: { type: Array, required: true },
})

// Regions use source-image pixels: [left, top, width, height].
// Keep the original image intact so Teek's viewer can show its full context.
function regionStyle([left, top, width, height], sourceWidth) {
  return {
    aspectRatio: `${width} / ${height}`,
    '--focus-width': `${(sourceWidth / width) * 100}%`,
    '--focus-left': `${(-left / width) * 100}%`,
    '--focus-top': `${(-top / height) * 100}%`,
  }
}
</script>

<template>
  <div class="screenshot-focus">
    <div
      v-for="(region, index) in regions"
      :key="index"
      class="screenshot-focus-region"
      :style="regionStyle(region, sourceWidth)"
    >
      <slot />
    </div>
  </div>
</template>
