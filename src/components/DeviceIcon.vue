<script setup vapor>
defineProps({ name: { type: String, required: true } })
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g v-if="name === 'sun'"><circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></g>
    <g v-else-if="name === 'android'"><path d="M5 10a7 7 0 0 1 14 0v7H5zM8 4 6 1m10 3 2-3M2 10v6m20-6v6M8 17v5m8-5v5"/><path d="M8 7h.01M16 7h.01" stroke-width="2"/></g>
    <path v-else-if="name === 'windows'" d="M3 5l8-1v7H3zm10-1.3 8-1v8.3h-8zM3 13h8v7l-8-1zm10 0h8v8.3l-8-1z" fill="currentColor" stroke="none"/>
    <g v-else-if="name === 'harmony'"><circle cx="12" cy="10" r="7"/><path d="M7 21h10"/></g>
    <path v-else-if="name === 'apple'" d="M16.4 12.2c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.7 0-1.7-.7-2.8-.7-1.4 0-2.7.8-3.5 2.1-1.5 2.7-.4 6.6 1.1 8.7.7 1 1.5 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 2-1.1 2.7-2.1.8-1.2 1.1-2.3 1.1-2.4 0-.1-2.7-1.1-2.7-3.7ZM14.5 6.2c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.7-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.2Z"/>
    <g v-else-if="name === 'linux'"><path d="M8 10V6a4 4 0 0 1 8 0v4c0 2 3 4 3 7 0 2-3 4-7 4s-7-2-7-4c0-3 3-5 3-7Z"/><path d="m10 9 2 2 2-2-2-1zm-2 8-4 3 5 2 1-3m6-2 4 3-5 2-1-3M8 11c-1 5 1 7 4 7s5-2 4-7M10 6h.01M14 6h.01"/></g>
    <g v-else-if="name === 'steam'"><circle cx="16.5" cy="7.5" r="4.5"/><circle cx="16.5" cy="7.5" r="2.4"/><circle cx="7.5" cy="16.5" r="3.5"/><path d="m10 19 8-7M6 13l6-8M1 13l7 3m-1 3-6-3"/></g>
    <g v-else-if="name === 'tv'"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/></g>
    <g v-else-if="name === 'vr'"><path d="M3 8c0-2 2-3 4-3h10c2 0 4 1 4 3v5c0 2-2 3-4 3h-3l-2-2-2 2H7c-2 0-4-1-4-3zM7 10h2m6 0h2"/></g>
  </svg>
</template>
