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

function preview(event) {
  // Teek opens the viewer from image clicks; forward button/keyboard activation once.
  if (event.target.tagName !== 'IMG') event.currentTarget.querySelector('img')?.click()
}
</script>

<template>
  <div class="screenshot-focus">
    <button
      v-for="(region, index) in regions"
      :key="index"
      type="button"
      class="screenshot-focus-region"
      :aria-label="`查看完整截图，重点区域 ${index + 1}`"
      :style="regionStyle(region, sourceWidth)"
      @click="preview"
    >
      <slot />
    </button>
  </div>
</template>
