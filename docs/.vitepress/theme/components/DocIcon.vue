<script setup>
defineProps({ name: String })
const paths = {
  play: 'm9 5 11 7-11 7V5Z',
  server: 'M4 4h16v12H4zM8 20h8M12 16v4M8 8h.01M11 8h5',
  devices: 'M3 4h12v11H3zM7 19h4M9 15v4M17 8h4v12h-7v-3',
  tools: 'M14 6a4 4 0 0 0-5 5l-6 6 4 4 6-6a4 4 0 0 0 5-5l-3 3-3-3 3-3Z',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  book: 'M12 5v15M3 4c4-1 6 0 9 1 3-1 5-2 9-1v15c-4-1-6 0-9 1-3-1-5-2-9-1V4Z',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
}
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.book" />
  </svg>
</template>
